const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const port = 3001

const usersRouter = require('./routes/users.routes')
const eventsRouter = require('./routes/events.routes')
const quadsRouter = require('./routes/quads.routes')

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
app.use('/events', eventsRouter)
app.use('/quads', quadsRouter)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})