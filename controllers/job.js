// Gereki moduller
const moment = require('moment')
const Jobs = require('../lib/db').Job

// Moment olarak dil seciyoruz
moment.locale('tr')

// jobController nesnesini olusturuyoruz
const jobController = {}

jobController.list = function (request, response) {
  Jobs.find(function (e, jobs) {
    return response.render('jobs.html', {
      moment: moment,
      page: 'isler',
      user: request.session.user,
      jobs: jobs
    })
  })
}

jobController.edit = function (request, response) {
  Jobs.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    return response.render('jobDetail.html', {
      moment: moment,
      page: 'isler',
      user: request.session.user,
      selectedUser: selectedUser
    })
  })
}

jobController.editPost = function (request, response) {
  Jobs.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    selectedUser.name = request.body.name
    selectedUser.email = request.body.email
    selectedUser.password = request.body.password
    selectedUser.isAdministrator = request.body.isAdministrator

    selectedUser.save(function (e, savedUser) {
      request.flash('success', 'Kullanıcı bilgileri güncellendi.')

      if (request.session.job._id === (savedUser._id + '')) {
        request.session.job = savedUser
      }

      return response.redirect(request.url)
    })
  })
}

jobController.new = function (request, response) {
  return response.render('newJob.html', {
    moment: moment,
    page: 'isler',
    user: request.session.user
  })
}

jobController.newPost = function (request, response) {
  var newjob = new Jobs({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    isAdministrator: request.body.isAdministrator
  })
  newjob.save(function (e) {
    request.flash('success', 'Yeni kullanıcı eklendi!')
    return response.redirect('/kullanicilar')
  })
}

jobController.delete = function (request, response) {
  Jobs.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    selectedUser.remove()
    request.flash('warning', 'Kullanıcı silindi!')
    // @TODO login olan o kisiye ait sessionlari da sil
    return response.redirect('/kullanicilar')
  })
}

// jobController nesnesini module haline getiriyoruz
module.exports = jobController
