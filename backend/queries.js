const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'quadex',
  password: 'cs316',
  port: 5432,
})

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users WHERE netid = $1', [req.query.id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }

const postUsers = (req, res) => {
    const {
        netID,
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
        bday_cal
    } = req.body

    pool.query('INSERT INTO users (netID, password, first_name, last_name, birthday, year, hometown, quad, degree, bio, insta, bday_cal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', 
        [
            netID,
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
            bday_cal
        ], 
        (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`User added with ID: ${netID}`)
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
        bday_cal
    } = req.body

    pool.query('UPDATE users SET password = $2, first_name = $3, last_name = $4, birthday = $5, year = $6, hometown = $7, quad = $8, degree = $9, bio = $10, insta = $11, bday_cal = $12 WHERE netid = $1', 
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
            bday_cal
        ], 
        (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User modified with ID: ${req.query.id}`)
    })
}

const deleteUsers = (req, res) => {
    pool.query('DELETE FROM users WHERE netid = $1', [req.query.id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User deleted with ID: ${req.query.id}`)
    })
}

module.exports = {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers
}