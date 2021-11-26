const db = require('../db')

const getEvents = (req, res) => {
    if (req.query.id == null) {
        if (req.query.quad == null) {
            db.query('SELECT * FROM events', (error, results) => {
                if (error) {
                    res.status(500).send("Error executing query: " + error)
                } else {
                    res.status(200).json(results.rows)
                }
            })
        } else {
            if (req.query.date == null) {
                db.query('SELECT * FROM events WHERE id IN (SELECT event_id FROM quad_events WHERE quad_name = $1)', [req.query.quad], (error, results) => {
                    if (error) {
                        res.status(500).send("Error executing query: " + error)
                    } else {
                        res.status(200).json(results.rows)
                    }
                })
            } else {
                db.query('SELECT * FROM events WHERE id IN (SELECT event_id FROM quad_events WHERE quad_name = $1) AND date = $2', 
                    [
                        req.query.quad,
                        req.query.date
                    ], 
                    (error, results) => {
                    if (error) {
                        res.status(500).send("Error executing query: " + error)
                    } else {
                        res.status(200).json(results.rows)
                    }
                })
            }
        }
    } else {
        db.query('SELECT * FROM events WHERE id = $1', [req.query.id], (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }
}

const postEvents = (req, res) => {
    const {
        title,
        time,
        date,
        end_time,
        end_date,
        description,
        location,
        tags,
        pic,
    } = req.body

    db.query('INSERT INTO events (title, time, date, end_time, end_date, description, location, tags, pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        [
            title,
            time,
            date,
            end_time,
            end_date,
            description,
            location,
            tags,
            pic
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`${results.rows[0].id}`)
            }
        })
}

const putEvents = (req, res) => {
    const {
        title,
        time,
        date,
        end_time,
        end_date,
        description,
        location,
        tags,
        pic
    } = req.body

    db.query('UPDATE events SET title = $2, time = $3, date = $4, end_time = $5, end_date = $6, description = $7, location = $8, tags = $9, pic = $10 WHERE id = $1',
        [
            req.query.id,
            title,
            time,
            date,
            end_time,
            end_date,
            description,
            location,
            tags,
            pic
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