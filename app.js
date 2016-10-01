const express = require('express')

const app = express()

app.get('/', function (req, res) {
  res.end('obarey')
})

module.exports = app
