const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const port = 3001

const usersRouter = require('./routes/users.routes')

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.json({ info: 'Connected to backend!' })
})

app.use('/users', usersRouter)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})