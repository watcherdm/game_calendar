const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'watcher_game_calendar'
})

function test_connection(query, cb) {
    connection.connect()

    connection.query(query, (err, rows, fields) => {
      if (err) throw err
      cb(rows, fields)
    })

    connection.end()    
}

module.exports = test_connection