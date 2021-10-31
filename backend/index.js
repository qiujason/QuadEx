const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const db = require('./queries')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/users', (req, res) => {
    db.getUsers(req, res)
})

app.post('/users', (req, res) => {
    db.postUsers(req, res)
})

app.put('/users', (req, res) => {
    db.putUsers(req, res)
})

app.delete('/users', (req, res) => {
    db.deleteUsers(req, res)
})

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})