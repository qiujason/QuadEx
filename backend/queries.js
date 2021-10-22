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

module.exports = {
    getUsers
}