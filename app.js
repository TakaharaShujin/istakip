'use strict'

// Dependencies
const bodyParser = require('body-parser')
const connectRedis = require('connect-redis')
const cookieParser = require('cookie-parser')
const express = require('express')
const expressFlash = require('express-flash')
const expressSession = require('express-session')
const moment = require('moment')
const nunjucks = require('nunjucks')
const path = require('path')
const redisClient = require('./redisClient')

// Create new express application
const app = express()

// Moment olarak dil seciyoruz
moment.locale('tr')

// Create new redis connection
const RedisStore = connectRedis(expressSession)

// Veritabani modellerimizi tanimliyoruz
const Users = require('./db')

// Middleware

// Bower'la yüklediğimiz dosyaların bulunduğu bower_components i yayınlıyoruz
app.use('/bower', express.static('./bower_components'))

// Kendi static dosyalarımızı yayınlamak için
app.use('/static', express.static('./static'))

// template engine - html render etmek için
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
  var newuser = new Users({
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
      return response.redirect('/')
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
      return response.redirect('/')
    } else {
      next()
    }
  }
})

// Route - sayfalar

app.get('/', function (request, response) {
  return response.render('anasayfa.html', {
    page: 'anasayfa',
    user: request.session.user
  })
})

app.get('/islerim', function (request, response) {
  return response.render('islerim.html', {
    page: 'islerim',
    user: request.session.user
  })
})

function checkAdminRights (request, response, next) {
  if (!request.session.user.isAdministrator) {
    request.flash('error', 'Erişmeye çalıştığınız sayfaya yetkiniz yok!')
    return response.redirect('/')
  }
  next()
}

app.get('/kullanicilar', checkAdminRights, function (request, response) {
  Users.find(function (e, users) {
    return response.render('kullanicilar.html', {
      moment: moment,
      page: 'kullanicilar',
      user: request.session.user,
      users: users
    })
  })
})

app.get('/kullanici-sil/:id', checkAdminRights, function (request, response) {
  Users.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    selectedUser.remove()
    request.flash('warning', 'Kullanıcı silindi!')
    // @TODO login olan o kisiye ait sessionlari da sil
    return response.redirect('/kullanicilar')
  })
})

app.get('/kullanici/:id', checkAdminRights, function (request, response) {
  Users.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    return response.render('kullanici.html', {
      moment: moment,
      page: 'kullanicilar',
      user: request.session.user,
      selectedUser: selectedUser
    })
  })
})

app.get('/yeni-kullanici', checkAdminRights, function (request, response) {
  return response.render('yenikullanici.html', {
    moment: moment,
    page: 'kullanicilar',
    user: request.session.user
  })
})

app.post('/yeni-kullanici', checkAdminRights, function (request, response) {
  var newuser = new Users({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    isAdministrator: request.body.isAdministrator
  })
  newuser.save(function (e) {
    request.flash('success', 'Yeni kullanıcı eklendi!')
    return response.redirect('/kullanicilar')
  })
})
  
app.post('/kullanici/:id', checkAdminRights, function (request, response) {
  Users.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    selectedUser.name = request.body.name
    selectedUser.email = request.body.email
    selectedUser.password = request.body.password
    selectedUser.isAdministrator = request.body.isAdministrator

    selectedUser.save(function (err, savedUser) {
      request.flash('success', 'Kullanıcı bilgileri güncellendi.')

      if (request.session.user._id === (savedUser._id + '')) {
        request.session.user = savedUser
      }

      return response.redirect(request.url)
    })
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

  Users.findOne({
    email: email,
    password: password
  }, function (err, user) {
    if (err || !user) {
      request.flash('error', 'Yanlış kullanıcı adı veya şifre')
      return response.redirect('/giris')
    }

    request.session.girisYapti = true
    request.session.user = user
    return response.redirect('/')
  })
})

module.exports = app
