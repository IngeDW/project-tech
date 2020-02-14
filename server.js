const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/about', (req, res) => res.send('Over mij'))
app.get('*', (req, res) => res.send('404 error not found'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
