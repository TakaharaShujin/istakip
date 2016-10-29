'use strict'

process.on('uncaughtException', function (err) {
  console.error(err.stack || err)
})

const app = require('./app')

const http = require('http')

const server = http.createServer(app)

const port = process.env.PORT || 8080

server.listen(port, function () {
  console.log(`${port} portunda uygulama hazir.`)
})
