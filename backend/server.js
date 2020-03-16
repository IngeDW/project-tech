
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const multer  = require('multer')
const slug = require('slug')
const session = require('express-session')
const upload = multer({dest:'static/upload/'})
require('dotenv').config()
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

app.set('view engine', 'ejs');
app.set('views', 'views');

//slug maakt url save (verandert leestekens goed)
// body-parser laat server weten wat voor data er binnen komt

//public
//app.use('/static', express.static(__dirname + '/static));
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
// get stuurt iets terug
//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => res.render('index.ejs', {title:'Maak een profiel aan'}))
app.get('/error', (req, res) => res.status(404).render('index.ejs', {title:'Panieek'}))
app.get('/about', (req, res) => res.send('Over mij'))
app.get('/file', (req, res) => res.sendFile('/Users/inge/Documents/• HVA/JAAR 2/TECH/datingapp/static/images/banner6.jpg'))
app.get('/mp3', (req, res) => res.sendFile('/Users/inge/Documents/• HVA/JAAR 2/TECH/datingapp/static/images/mpvierrr.mp4'))
app.get('/profile/:id', profile)
app.post('/add-profile', upload.single('cover'), myForm)
app.post('/', upload.single('cover'), myForm)


function myForm(req, res, next){
  console.log(req.body);
  var id = slug(req.body.username).toLowerCase()

  const username = req.body.username
  const regio = req.body.regio
  const jaar = req.body.jaar
  const gender = req.body.gender
  const biografie = req.body.biografie
  const cover = req.file ? req.file.filename : null
  const form = {
    username: username,
    regio: regio,
    jaar: jaar,
    gender: gender,
    biografie: biografie,
    cover: cover
  }
  req.session.form = form
  db.collection('profiles').insertOne(req.session.form)
  res.redirect('profile/' + id)
 next()
}


app.get('/profile/:id', profile)



const allProfiles = []

// function addProfile(req, res, next) {
//   console.log(req.body);
//   var id = slug(req.body.username).toLowerCase()
//  //  db.collection('profiles').insertOne(req.session.form, function (error, response) {
//  //    if(error) {
//  //        console.log('Error occurred while inserting')
//  //        res.send('400 Bad Request Error')
//  //    } else {
//  //      res.redirect('profile/' + id)
//  //    }
//  // })
// }

// function addProfile(req, res, next) {
//   console.log(req.body);
//   var id = slug(req.body.username).toLowerCase()
//   db.collection('profiles').insertOne(req.session.form, res.redirect('profile/' + id)
//
// })




function profile(req, res) {
  db.collection('profiles').find().toArray(function (err, data){
      const id = req.params.id
      const profile = data.filter(item => item.id === id)[0];
      res.render('result.ejs', profile);
   })
}


app.get('*', (req, res) => res.send('404 error not found'))
// listen als laatste
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
