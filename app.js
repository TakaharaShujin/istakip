'use strict'

// Dependencies
const express = require('express')
const middleware = require('./lib/middleware')

// Controllers
const authController = require('./controllers/auth')
const homeController = require('./controllers/home')

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

/**
 * Tüm CRUD işlemleri burada olacak
 */
const crudController = require('./controllers/crud')

app.get('/list/:model', checkAdminRights, crudController.list)

app.get('/new/:model', checkAdminRights, crudController.new)
app.post('/new/:model', checkAdminRights, crudController.newPost)

app.get('/edit/:model/:id', checkAdminRights, crudController.edit)
app.post('/edit/:model/:id', checkAdminRights, crudController.editPost)

app.get('/delete/:model/:id', checkAdminRights, crudController.delete)

app.get('/cikis', authController.logout)
app.get('/giris', authController.login)
app.post('/giris', authController.loginPost)

module.exports = app
