const db = require('../db')

const getPointsByUserID = (req, res) => {
    db.query('SELECT * FROM points WHERE net_id = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const getSumPointsByUserID = (req, res) => {
    db.query('SELECT SUM(point_value) FROM points WHERE net_id = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const getPointsByQuad = (req, res) => {
    db.query('SELECT * FROM points LEFT JOIN users ON points.net_id = users.net_id WHERE quad = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const getSumPointsByQuad = (req, res) => {
    db.query('SELECT SUM(point_value) as points FROM points LEFT JOIN users ON points.net_id = users.net_id WHERE quad = $1 GROUP BY quad', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const postPoints = (req, res) => {
    const {
        net_id,
        date,
        point_value,
        reason
    } = req.body

    db.query('INSERT INTO points (net_id, date, point_value, reason) VALUES ($1, $2, $3, $4) RETURNING id',
        [
            net_id,
            date,
            point_value,
            reason
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`ID: ${results.rows[0].id} - ${point_value} points given to ${net_id} on date ${date} for ${reason}`)
            }
        })
}

const putPoints = (req, res) => {
    const {
        net_id,
        date,
        point_value,
        reason
    } = req.body

    db.query('UPDATE points SET net_id = $2, date = $3, point_value = $4, reason = $5 WHERE id = $1',
        [
            req.query.id,
            net_id,
            date,
            point_value,
            reason
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).send(`Points modified with ID: ${req.query.id}`)
            }
        })
}

const deletePoints = (req, res) => {
    db.query('DELETE FROM points WHERE id = $1', [req.query.id], (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).send(`ID ${req.query.id} removed from points`)
            }
        })
}

module.exports = {
    getPointsByUserID,
    getSumPointsByUserID,
    getPointsByQuad,
    getSumPointsByQuad,
    postPoints,
    putPoints,
    deletePoints
}