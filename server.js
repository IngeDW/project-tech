

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/about', (req, res) => res.send('Over mij'))
app.get('/file', (req, res) => res.sendFile('/Users/inge/Documents/• HVA/JAAR 2/TECH/datingapp/static/images/banner6.jpg'))
app.get('/mp3', (req, res) => res.sendFile('/Users/inge/Documents/• HVA/JAAR 2/TECH/datingapp/static/images/mpvierrr.mp4'))

app.get('*', (req, res) => res.send('404 error not found'))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))


let ejs = require('ejs'),
    people = ['geddy', 'neil', 'alex'],
    html = ejs.render('<%= people.join(", "); %>', {people: people});
