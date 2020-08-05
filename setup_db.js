const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'watcher_game_calendar'
})

function make_query(query, cb) {
    connection.connect()

    connection.query(query, (err, rows, fields) => {
      if (err) throw err
      connection.end()
      cb(rows, fields)
    })

}

module.exports = make_query