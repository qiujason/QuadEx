const db = require('../db')

const getAdmin = (req, res) => {
    if (req.query.id != null) {
        db.query('SELECT * FROM admin WHERE username = $1', [req.query.id], (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    } else if (req.query.quad != null) {
        db.query('SELECT *, title FROM users, admin WHERE users.quad = $1 AND users.net_id = admin.username', [req.query.quad], (error, results) => {
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
                res.status(201).send(`Admin added with ID: ${username}`)
            }
        })
}

const putAdmin = (req, res) => {
    const {
        username,
        title,
        email
    } = req.body

    db.query('UPDATE admin SET username = $2, title = $3, email = $4 WHERE username = $1',
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
                res.status(200).send(`Admin modified with ID: ${req.query.id}`)
            }
        })
}

const deleteAdmin = (req, res) => {
    db.query('DELETE FROM admin WHERE username = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).send(`Admin deleted with ID: ${req.query.id}`)
        }
    })
}

module.exports = {
    getAdmin,
    postAdmin,
    putAdmin,
    deleteAdmin
}