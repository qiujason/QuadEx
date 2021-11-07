const db = require('../db')

const getFavoriteEventsByUser = (req, res) => {
    db.query('SELECT * FROM events WHERE id IN (SELECT event_id FROM favorited_events WHERE net_id = $1)', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const getUsersByFavoriteEvents = (req, res) => {
    db.query('SELECT * FROM users WHERE net_id IN (SELECT net_id FROM favorited_events WHERE event_id = $1)', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const postFavoriteEvents = (req, res) => {
    db.query('INSERT INTO favorited_events (net_id, event_id) VALUES ($1, $2)',
        [
            req.query.net_id,
            req.query.event_id
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`Event ${req.query.event_id} favorited for user ${req.query.net_id}`)
            }
        })
}

const deleteFavoriteEvents = (req, res) => {
    db.query('DELETE FROM favorited_events WHERE net_id = $1 AND event_id = $2', 
        [
            req.query.net_id,
            req.query.event_id
        ], 
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).send(`Event ${req.query.event_id} unfavorited for user ${req.query.net_id}`)
            }
        })
}

module.exports = {
    getFavoriteEventsByUser,
    getUsersByFavoriteEvents,
    postFavoriteEvents,
    deleteFavoriteEvents
}