// Const en Requires
const express = require('express')                                              // Express is een framework voor Node.js en zorgt ervoor dat je veel api's kan gebruiken.
const app = express()
const port = 3000                                                               // In de browser is de applicatie te zien op: Localhost:3000.
const bodyParser = require('body-parser')                                       // Body-parser laat server weten wat voor soort data er binnen komt.
const multer  = require('multer')                                               // Multer is een node.js-middleware voor het afhandelen van multipart/formuliergegevens, die voornamelijk wordt gebruikt voor het uploaden van bestanden zoals profiel foto's (Bron: https://www.npmjs.com/package/multer).
const slug = require('slug')                                                    // Slug maakt url save (verandert leestekens naar veilige tekens)
const session = require('express-session')
const upload = multer({dest:'static/upload/'})                                  // Dit zorgt ervoor dat de geuploade bestanden (profiel foto's) van de client in de map static/upload komen
require('dotenv').config()                                                      // Zodat je process.env.DB_USER etc. kunt gebruiken
ObjectID = require('mongodb').ObjectID 			                                    // Haalt ObjectID uit Mongo database

// Database MongoDB
var db;
const MongoClient = require('mongodb').MongoClient;                             // Connect met de database van Mongo
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@projecttech-hvfp2.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true } );
  client.connect((err, client, res) => {
    if (err) {
      console.log(err)                                                          // Kan er geen connectie worden gemaakt met de database? Laat error zien.
    }
    db = client.db(process.env.DB_NAME);                                        // Client kan connectie maken met database en kan de data gebruiken en er in plaatsen.
  });

// SET en USE
app.set('view engine', 'ejs')                                                   // Hier zeg je dat je de template engine EJS gebruikt.
app.set('views', 'views')                                                       // Alle EJS bestanden zijn te vinden in de map views.
app.use(express.static('static'))                                               // Andere mogelijkheid voor kortere linkjes: app.use('/static', express.static(__dirname + '/static));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))                                // Krijg met bodyParser toegang tot de Request Body-objecten (bijv. req.body.username), vooral als het gaat om onze POST-verzoeken (in formulieren).
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))

// GET: (get stuurt url naar client na aanvraag naar de server)
app.get('/', (req, res) => res.render('index.ejs'))                             // Is de client op Localhost:3000/ dan ziet hij de home pagina index.ejs.

app.get('/profile/:id', profile)

function profile(req, res) {
  db.collection('profiles').findOne(
    {_id: ObjectID(req.params.id)},
    function (err) {												                                    // Zoek juiste ObjectID uit 'profiles' collection uit mijn Mongo database
      if (err) throw err;
      res.render('result.ejs', req.session.user);							                  // Render result.ejs met data van req.session.user
  })
}

app.get('/update/:id', findIDtoUpdateResultPage);                               // Dit stuurt de user naar de overzichtspagina met alle ingevulde data

function findIDtoUpdateResultPage(req, res) {
	db.collection('profiles').findOne(										                        // Vind ObjectID uit de 'profiles' collection van m'n Mongo database die overeenkomt met de client.
		{_id: ObjectID(req.session.user._id)},									                    // Zoek juiste ObjectID uit 'profiles' collection uit mijn Mongo database
		function (err, result) {												                            // Deze functie gaat af indien er iets is gevonden / of niet
      if (err) throw err;
			res.render('update.ejs', result);							                            // Render update.ejs met data van de gevonden _id
		});
}

app.get('/logout-profile', logOutProfile)                                       // Wanneer de client uit wilt loggen, dan wordt de sessie met data stop gezet en worden zijn gegevens niet verwijderd in de database maar wel van de client side.

function logOutProfile (req, res, next) {
  req.session.destroy(function () {
    res.render('loggedOut.ejs');                                                // Client wordt na uitloggen gestuurd naar een pagina waar een melding staat: U bent uigelogd.
  })
}

app.get('/to-add-profile', (req, res) => res.render('index.ejs'))               // Klik op knop 'maak profiel aan'en de index.ejs rendert waar het form staat om je profiel aan te maken

app.get('*', (req, res) => res.send('404 error not found'))                     // Als je op een route komt die ik niet gedefinieerd heb (*), laat hij een error zien


// POST: (client post data in de database via de server)

app.post('/add-profile', upload.single('cover'), myForm)

function myForm(req, res){                                                      // Form actie om req.session.user in db.collection('profiles') te 'inserten'.
  const id = slug(req.body.username).toLowerCase()                              // Slug maakt id veilig en in kleine letters.
  req.session.user = {
	  username: req.body.username,                                                // Deze info haal ik uit het form met: name='username'
	  regio: req.body.regio,
	  jaar: req.body.jaar,
    gender:req.body.gender,
    biografie: req.body.biografie,
    cover: req.file ? req.file.filename : null
  }
    db.collection('profiles').insertOne(req.session.user, callback);            // Profiles is een collectie in de database waar req.session.user geinsered wordt
    function callback (err, result){
      res.redirect('profile/' + result.insertedId);                             // result.insertedId is de directe mongodb id via de result parameter
    }
}

app.post('/sendUpdate', updateBio);                                             // Form actie om updateBiografie in Biografie te updaten

function updateBio(req, res){
	db.collection('profiles').updateOne(						           	                  // Update iets wat in de collection 'user' zit van MongoDB.
		{_id: ObjectID(req.session.user._id)},							      	                // Zoek juiste ObjectID uit 'profiles' collection uit mijn Mongo database
		{$set: {biografie: req.body.updateBiografie}},          	                  // De operator $ set vervangt de waarde van een veld door de opgegeven waarde (Bron: https://docs.mongodb.com/manual/reference/operator/update/set/)
		(err)=>{
			if (err) throw err;
			res.redirect('update/' + req.session.user._id);	       	                  // Stuur user naar update/_id, waar de nieuwe pagina staat met alle gegevens van de gebruiker
		})
}

app.post('/datingPage', toDatingPage);                                          // Form actie om data Client in de datingPage.ejs te stoppen

function toDatingPage(req, res, result){
  db.collection('profiles').findOne(										                        // Zoek juiste ObjectID uit 'profiles' collection uit mijn Mongo database
    {_id: ObjectID(req.session.user._id)},
    function (err, result) {
      if (err) throw err;
      res.render('datingPage.ejs', result);							                        // Render de datingPage.ejs met de gegevens van _id (het resultaat van de findOne)
    })
  }


// LISTEN: altijd als laatste
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
