const express = require('express')
const app = express()
const fs = require('fs')

const make_query = require('./setup_db')

app.use(express.json())

app.get('/api', (req, res) => {
  res.json({
    roles: {
      path: '/roles',
      methods: ['GET', 'POST']
    }
  })
})

app.post('/api/roles', (req, res) => {
  const {name} = req.body
  make_query(`INSERT INTO roles (id, name) (null, ${name});`, (rows) => {
    res.json(rows)
  })
})

app.listen(3000, () => {
  console.log('exampled app listening on 3000')
})
