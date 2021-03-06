const db = require('../db')

const getUsers = (req, res) => {
    if (req.query.quad != null) {
        db.query('SELECT * FROM users WHERE quad = $1', [req.query.quad], (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    } else if (req.query.id != null) {
        db.query('SELECT * FROM users WHERE net_id = $1', [req.query.id], (error, results) => {
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

const getUsersByBirthday = (req, res) => {
    var birthday = req.params.birthday + "%"
    db.query('SELECT * FROM users WHERE birthday LIKE $1 AND quad = $2', 
        [
            birthday,
            req.query.quad
        ], 
        (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).json(results.rows)
        }
    })
}

const postUsers = (req, res) => {
    const {
        net_id,
        password,
        first_name,
        last_name,
        birthday,
        year,
        hometown,
        quad,
        degree,
        bio,
        insta,
        bday_cal,
        prof_pic
    } = req.body

    db.query('INSERT INTO users (net_id, password, first_name, last_name, birthday, year, hometown, quad, degree, bio, insta, bday_cal, prof_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [
            net_id,
            password,
            first_name,
            last_name,
            birthday,
            year,
            hometown,
            quad,
            degree,
            bio,
            insta,
            bday_cal,
            prof_pic
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(201).send(`User added with ID: ${net_id}`)
            }
        })
}

const putUsers = (req, res) => {
    const {
        password,
        first_name,
        last_name,
        birthday,
        year,
        hometown,
        quad,
        degree,
        bio,
        insta,
        bday_cal,
        prof_pic
    } = req.body

    db.query('UPDATE users SET password = $2, first_name = $3, last_name = $4, birthday = $5, year = $6, hometown = $7, quad = $8, degree = $9, bio = $10, insta = $11, bday_cal = $12, prof_pic = $13 WHERE net_id = $1',
        [
            req.query.id,
            password,
            first_name,
            last_name,
            birthday,
            year,
            hometown,
            quad,
            degree,
            bio,
            insta,
            bday_cal,
            prof_pic
        ],
        (error, results) => {
            if (error) {
                res.status(500).send("Error executing query: " + error)
            } else {
                res.status(200).send(`User modified with ID: ${req.query.id}`)
            }
        })
}

const deleteUsers = (req, res) => {
    db.query('DELETE FROM users WHERE net_id = $1', [req.query.id], (error, results) => {
        if (error) {
            res.status(500).send("Error executing query: " + error)
        } else {
            res.status(200).send(`User deleted with ID: ${req.query.id}`)
        }
    })
}

module.exports = {
    getUsers,
    getUsersByBirthday,
    postUsers,
    putUsers,
    deleteUsers
}