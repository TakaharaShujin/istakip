'use strict'

// Dependencies
const express = require('express')
const middleware = require('./lib/middleware')

// Controllers
const authController = require('./controllers/auth')
const homeController = require('./controllers/home')
const myjobController = require('./controllers/myjob')
const adminJobController = require('./controllers/adminjob')

// Create new express application
const app = express()
app.get('/ilk-kullaniciyi-olustur', authController.createFirstUser)

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

// Route - sayfalar
const models = require('./lib/db')

app.get('/cikis', authController.logout)
app.get('/giris', authController.login)
app.post('/giris', authController.loginPost)


/**
 * Controllerlara gidecek tum requestlere count lari da eklemek icin middleware
 */
app.use(function (request, response, next) {
  request.counts = {}

  models.Job.count(function (e, JobCount) {
    request.counts.Job = JobCount

    models.User.count(function (e, UserCount) {
      request.counts.User = UserCount

      models.JobType.count(function (e, JobTypeCount) {
        request.counts.JobType = JobTypeCount

        models.Job.count({
          isOpened: false,
          assignedTo: request.session.user._id
        }, function (e, UnreadJobCount) {
          request.counts.UnreadJobCount = UnreadJobCount
        })

        models.Job.count({
          assignedTo: request.session.user._id
        }, function (e, MyJobCount) {
          request.counts.MyJobCount = MyJobCount

          next()
        })
      })
    })
  })
})

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

app.get('/isdetayi/:id', checkAdminRights, adminJobController.detail)

app.get('/islerim', myjobController.list)
app.get('/isdetayim/:id', myjobController.detail)

// AJAX API
const ajaxController = require('./controllers/ajax')
app.post('/ajax/changeJobTypeStatus', ajaxController.changeJobTypeStatus)
app.post('/ajax/comment', ajaxController.comment)

module.exports = app
