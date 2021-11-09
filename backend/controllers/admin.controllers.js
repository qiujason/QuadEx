const db = require('../db')

const getAdmin = (req, res) => {
    db.query('SELECT * FROM admin WHERE username = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}


const postAdmin = (req, res) => {
    const {
        username,
        title,
        email
    } = req.body

    db.query('INSERT INTO admin (username, title, email) VALUES ($1, $2, $3)',
        [
            username,
            title,
            email
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`User added with ID: ${net_id}`)
            }
        })
}

const putAdmin = (req, res) => {
    const {
        username,
        title,
        email
    } = req.body

    db.query('UPDATE admin SET username = $2, title = $3, email = $4 WHERE net_id = $1',
        [
            req.query.id,
            username,
            title,
            email
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).send(`User modified with ID: ${req.query.id}`)
            }
        })
}

const deleteAdmin = (req, res) => {
    db.query('DELETE FROM admin WHERE net_id = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).send(`User deleted with ID: ${req.query.id}`)
        }
    })
}

module.exports = {
    getAdmin,
    postAdmin,
    putAdmin,
    deleteAdmin
}