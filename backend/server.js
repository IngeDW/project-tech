const express = require('express')
const app = express()
const port = 3000
// body-parser laat server weten wat voor data er binnen komt
const bodyParser = require('body-parser')
const multer  = require('multer')
//slug maakt url save (verandert leestekens goed)
const slug = require('slug')
const session = require('express-session')
const upload = multer({dest:'static/upload/'})
require('dotenv').config()
//Connect met de database van Mongo
var db;
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@projecttech-hvfp2.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect((err, client, res) => {
    if (err) {
      console.log(err);
    }
    db = client.db(process.env.DB_NAME);
  });

// Eerst alle app.set en app.use
app.set('view engine', 'ejs');
app.set('views', 'views');
// app.use('/static', express.static(__dirname + '/static));
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))

// Dan alle app.get en app.post (get stuurt iets terug naar client)
// Routing
app.get('/', (req, res) => res.render('index.ejs', {title:'Maak een profiel aan'}))
app.get('/error', (req, res) => res.status(404).render('index.ejs', {title:'Panieek'}))
app.get('/about', (req, res) => res.send('Over mij'))
app.get('/file', (req, res) => res.sendFile('/Users/inge/Documents/• HVA/JAAR 2/TECH/datingapp/static/images/banner6.jpg'))
app.get('/mp3', (req, res) => res.sendFile('/Users/inge/Documents/• HVA/JAAR 2/TECH/datingapp/static/images/mpvierrr.mp4'))
app.get('/profile/:id', profile)

  function profile(req, res) {
        const id = req.params.id
        res.render('result.ejs', req.session.user);
      }

app.post('/add-profile', upload.single('cover'), myForm)
app.post('/', upload.single('cover'), myForm)

  function myForm(req, res, next){
    const id = slug(req.body.username).toLowerCase()
    req.session.user = {
  		  username: req.body.username,
  		  regio: req.body.regio,
  		  jaar: req.body.jaar,
        gender:req.body.gender,
        biografie: req.body.biografie,
        cover: req.file ? req.file.filename : null
  	   };
       db.collection('profiles').insertOne(req.session.user)
       console.log(req.session.user)
       res.redirect('profile/' + req.body.username);
     }

// als je op een route komt die ik niet gedefinieerd heb, laat hij een error zien
app.get('*', (req, res) => res.send('404 error not found'))
// listen altijd als laatste
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
