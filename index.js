const express = require('express')
const app = express()

const test_connection = require('./setup_db')


app.get('/api', (req, res) => {
  try {
    test_connection('show tables;', (rows, fields) => {
      res.send(`Tested connection ${rows}`)
    })
  } catch (e) {
    res.send('Hello World!')
  }
})

app.listen(3000, () => {
  console.log('exampled app listening on 3000')
})
