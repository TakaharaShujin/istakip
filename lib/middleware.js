// Modules
const bodyParser = require('body-parser')
const connectRedis = require('connect-redis')
const cookieParser = require('cookie-parser')
const express = require('express')
const expressFlash = require('express-flash')
const expressSession = require('express-session')
const nunjucks = require('nunjucks')
const path = require('path')
const redisClient = require('./redisClient')

// Create new redis connection
const RedisStore = connectRedis(expressSession)

// Init
const middleware = {}

middleware.load = function (app) {
  // Bower'la yüklediğimiz dosyaların bulunduğu bower_components i yayınlıyoruz
  app.use('/bower', express.static('./bower_components'))

  // Kendi static dosyalarımızı yayınlamak için
  app.use('/static', express.static('./static'))

  // template engine - html render etmek için
  nunjucks.configure(path.join(__dirname, '../views'), {
    autoescape: false,
    express: app,
    noCache: true
  })

  // Post yapılan formlardan gelen değerleri kullanabilmemiz için
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Cookie desteği eklemek için
  app.use(cookieParser('asdmaskdamk2kd2mkdn3jf'))

  // Session desteği eklemek için
  app.use(expressSession({
    store: new RedisStore({ // sessionları rediste tutmak için
      client: redisClient
    }),
    secret: 'asjdasnjdansdjasnj3',
    resave: false,
    saveUninitialized: true
  }))

  // Sadece bir kere gösterilecek uyarı/mesaj/hataları kullanabilmek için
  app.use(expressFlash())

  // Login değilse ve login gereken bir sayfaya erişiyorsa
  // veya loginse ama login olmaması gereken bir sayfaya erişiyorsa
  // ilgili yönlendirmeleri yapıyor
  app.use(function (request, response, next) {
    if (!request.session.girisYapti && request.url !== '/giris') {
      request.flash('error', 'Sistemi kullanbilmek icin giris yapmaniz lazimdir')
      return response.redirect('/giris')
    } else {
      if (request.session.girisYapti && request.url === '/giris') {
        return response.redirect('/')
      } else {
        next()
      }
    }
  })
}

module.exports = middleware
