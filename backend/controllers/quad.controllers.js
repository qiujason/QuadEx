const db = require('../db')

const getQuad = (req, res) => {
    if (req.query.id != null) {
        db.query('SELECT * FROM quads WHERE name = $1', [req.query.id], (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    } else if (req.query.event != null) {
        db.query('SELECT * FROM quads WHERE name IN (SELECT quad_name FROM quad_events WHERE event_id = $1)', [req.query.event], (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    } else {
        res.status(500).send("No parameter provided")
    }
}

const postQuad = (req, res) => {
    const {
        name,
        dorms,
        pic
    } = req.body

    db.query('INSERT INTO quads (name, dorms, pic) VALUES ($1, $2)',
        [
            name,
            dorms,
            pic
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`Quad added with name: ${name}`)
            }
        })
}

const postQuadEvent = (req, res) => {
    db.query('INSERT INTO quad_events (quad_name, event_id) VALUES ($1, $2)',
        [
            req.query.quad_name,
            req.query.event_id
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`Event ${req.query.event_id} added to quad ${req.query.quad_name}`)
            }
        })
}

const putQuad = (req, res) => {
    const {
        dorms,
        pic
    } = req.body

    db.query('UPDATE quads SET dorms = $2, pic = $3 WHERE name = $1',
        [
            req.query.id,
            dorms,
            pic
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).send(`Quad modified with name: ${req.query.id}`)
            }
        })
}

const deleteQuad = (req, res) => {
    db.query('DELETE FROM quads WHERE name = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).send(`Quad deleted with name: ${req.query.id}`)
        }
    })
}

const deleteQuadEvent = (req, res) => {
    db.query('DELETE FROM quad_events WHERE quad_name = $1 AND event_id = $2',
        [
            req.query.quad_name,
            req.query.event_id
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`Event ${req.query.event_id} deleted from quad ${req.query.quad_name}`)
            }
        })
}

module.exports = {
    getQuad,
    postQuad,
    postQuadEvent,
    putQuad,
    deleteQuad,
    deleteQuadEvent
}