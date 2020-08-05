const express = require('express')
const app = express()

const setup = require('./setup_db')


app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('exampled app listening on 3000')
})
