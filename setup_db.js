const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'watcher_game_calendar'
})

connection.connect()

connection.query('show tables;', (err, rows, fields) => {
  if (err) throw err
  console.log(rows)
})

connection.end()

module.exports = connection