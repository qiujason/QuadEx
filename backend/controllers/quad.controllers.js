const db = require('../db')

const getQuad = (req, res) => {
    db.query('SELECT * FROM quads WHERE name = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const postQuad = (req, res) => {
    const {
        name,
        dorms
    } = req.body

    db.query('INSERT INTO quads (name, dorms) VALUES ($1, $2)',
        [
            name,
            dorms
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`Quad added with name: ${name}`)
            }
        })
}

const putQuad = (req, res) => {
    const {
        name,
        dorms
    } = req.body

    db.query('UPDATE quads SET dorms = $2 WHERE name = $1',
        [
            req.query.id,
            dorms
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

module.exports = {
    getQuad,
    postQuad,
    putQuad,
    deleteQuad
}