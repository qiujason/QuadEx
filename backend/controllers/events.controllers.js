const db = require('../db')

const getEvents = (req, res) => {
    db.query('SELECT * FROM events WHERE id = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const postEvents = (req, res) => {
    const {
        title,
        time,
        date,
        description,
        location,
        tags
    } = req.body

    db.query('INSERT INTO events (title, time, date, description, location, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [
            title,
            time,
            date,
            description,
            location,
            tags
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`Event added with ID: ${results.rows[0].id}`)
            }
        })
}

const putEvents = (req, res) => {
    const {
        title,
        time,
        date,
        description,
        location,
        tags
    } = req.body

    db.query('UPDATE events SET title = $2, time = $3, date = $4, description = $5, location = $6, tags = $7 WHERE id = $1',
        [
            req.query.id,
            title,
            time,
            date,
            description,
            location,
            tags
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).send(`Event modified with ID: ${req.query.id}`)
            }
        })
}

const deleteEvents = (req, res) => {
    db.query('DELETE FROM events WHERE id = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).send(`Event deleted with ID: ${req.query.id}`)
        }
    })
}

module.exports = {
    getEvents,
    postEvents,
    putEvents,
    deleteEvents
}