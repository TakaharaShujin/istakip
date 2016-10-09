'use strict'

// Dependencies
const bodyParser = require('body-parser')
const connectRedis = require('connect-redis')
const cookieParser = require('cookie-parser')
const express = require('express')
const expressFlash = require('express-flash')
const expressSession = require('express-session')
const nunjucks = require('nunjucks')
const path = require('path')
const redisClient = require('./redisClient')

// Create new express application
const app = express()

// Create new redis connection
const RedisStore = connectRedis(expressSession)

// Veritabani modellerimizi tanimliyoruz
const UserClass = require('./db')

// Middleware

nunjucks.configure(path.join(__dirname, 'views'), {
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

// Ilk kullaniciyi olusturma giristen once olmasi lazim
// cunku veritabaninda kullanici olmadigi icin nereye giris yapacaklar
app.get('/ilk-kullaniciyi-olustur', function (request, response) {
  var newuser = new UserClass({
    name: 'Giray Yapici',
    email: 'giraydan@gmail.com',
    password: '123',
    isAdministrator: true
  })
  newuser.save(function (err) {
    if (err) {
      console.log(err)
      return response.end('Kullanici olusturulamadi')
    } else {
      request.flash('info', 'İlk kullanici olusturuldu!')
      return response.redirect('/anasayfa')
    }
  })
})

// Login değilse ve login gereken bir sayfaya erişiyorsa
// veya loginse ama login olmaması gereken bir sayfaya erişiyorsa
// ilgili yönlendirmeleri yapıyor
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
  return response.render('anasayfa.html', {
    user: request.session.user
  })
})

app.get('/cikis', function (request, response) {
  return request.session.destroy(function () {
    return response.redirect('/giris')
  })
})

app.get('/giris', function (request, response) {
  return response.render('giris.html')
})

app.post('/giris', function (request, response) {
  let email = request.body.email
  let password = request.body.password

  UserClass.findOne({
    email: email,
    password: password
  }, function (err, user) {
    if (err || !user) {
      request.flash('error', 'Yanlış kullanıcı adı veya şifre')
      return response.redirect('/giris')
    }

    request.session.girisYapti = true
    request.session.user = user
    return response.redirect('/anasayfa')
  })
})

module.exports = app
