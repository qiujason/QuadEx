const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const port = 3001

const usersRouter = require('./routes/users.routes')
const eventsRouter = require('./routes/events.routes')
const quadsRouter = require('./routes/quads.routes')
const pointsRouter = require('./routes/points.routes')
const adminsRouter = require('./routes/admin.routes')

const imagesRouter = require('./routes/images.routes')

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
app.use('/points', pointsRouter)
app.use('/admins', adminsRouter)

app.use('/images', imagesRouter)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})