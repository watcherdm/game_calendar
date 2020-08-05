const express = require('express')
const app = express()

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, () => {
  console.log('exampled app listening on 3000')
})
