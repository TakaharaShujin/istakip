const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const expressFlash = require('express-flash')
const expressSession = require('express-session')
const nunjucks = require('nunjucks')
const path = require('path')

const app = express()

// Middleware

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: false,
  express: app,
  noCache: true
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser('asdmaskdamk2kd2mkdn3jf'))

app.use(expressSession({
  secret: 'asjdasnjdansdjasnj3',
  resave: false,
  saveUninitialized: true
}))

app.use(expressFlash())

app.use(function (request, response, next) {
  if (!request.session.girisYapti && request.url !== '/giris') {
    request.flash('error', 'Sistemi kullanbilmek icin giris yapmaniz lazimdir')
    return response.redirect('/giris')
  } else {
    if (request.session.girisYapti && request.url === '/giris') {
      return response.redirect('/anasayfa')
    } else {
      next()
    }
  }
})

// Route - sayfalar

app.get('/anasayfa', function (request, response) {
  response.render('anasayfa.html')
})

app.get('/cikis', function (request, response) {
  request.session.destroy(function () {
    return response.redirect('/giris')
  })
})

app.get('/giris', function (request, response) {
  response.render('giris.html')
})

app.post('/giris', function (request, response) {
  let email = request.body.email
  let password = request.body.password

  if (email === 'a@abc.com' && password === '123') {
    request.session.girisYapti = true
    response.redirect('/anasayfa')
  } else {
    request.flash('error', 'Yanlış kullanıcı adı veya şifre')
    response.redirect('/giris')
  }
})

module.exports = app
