'use strict'

// Dependencies
const express = require('express')
const middleware = require('./lib/middleware')

// Controllers
const authController = require('./controllers/auth')
const homeController = require('./controllers/home')
const jobController = require('./controllers/job')
const userController = require('./controllers/user')

// Create new express application
const app = express()

// Middleware
middleware.load(app)

function checkAdminRights (request, response, next) {
  if (!request.session.user.isAdministrator) {
    request.flash('error', 'Erişmeye çalıştığınız sayfaya yetkiniz yok!')
    return response.redirect('/')
  }
  next()
}

// Ilk kullaniciyi olusturma giristen once olmasi lazim
// cunku veritabaninda kullanici olmadigi icin nereye giris yapacaklar
app.get('/ilk-kullaniciyi-olustur', authController.createFirstUser)

// Route - sayfalar

app.get('/', homeController.home)

// app.get('/islerim', jobController.myJobs)

app.get('/isler', checkAdminRights, jobController.list)
app.get('/is/:id', checkAdminRights, jobController.edit)
app.post('/is/:id', checkAdminRights, jobController.editPost)
app.get('/yeni-is', checkAdminRights, jobController.new)
app.post('/yeni-is', checkAdminRights, jobController.newPost)
app.get('/is-sil/:id', checkAdminRights, jobController.delete)

app.get('/kullanicilar', checkAdminRights, userController.list)
app.get('/kullanici/:id', checkAdminRights, userController.edit)
app.post('/kullanici/:id', checkAdminRights, userController.editPost)
app.get('/yeni-kullanici', checkAdminRights, userController.new)
app.post('/yeni-kullanici', checkAdminRights, userController.newPost)
app.get('/kullanici-sil/:id', checkAdminRights, userController.delete)

app.get('/cikis', authController.logout)
app.get('/giris', authController.login)
app.post('/giris', authController.loginPost)

module.exports = app
