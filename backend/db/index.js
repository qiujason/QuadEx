const { Pool } = require('pg')
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'quadex',
  password: 'cs316',
  port: 5432,
})

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      if (err) {
        console.log('error thrown when executing query', { text })
      } else {
        const duration = Date.now() - start
        console.log('executed query', { text, duration, rows: res.rowCount })
      }
      callback(err, res)
    })
  },
}