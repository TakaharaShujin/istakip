// Gereki moduller
const moment = require('moment')
const Users = require('../lib/db')

// Moment olarak dil seciyoruz
moment.locale('tr')

// userController nesnesini olusturuyoruz
const userController = {}

userController.list = function (request, response) {
  Users.find(function (e, users) {
    return response.render('kullanicilar.html', {
      moment: moment,
      page: 'kullanicilar',
      user: request.session.user,
      users: users
    })
  })
}

userController.edit = function (request, response) {
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
}

userController.editPost = function (request, response) {
  Users.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    selectedUser.name = request.body.name
    selectedUser.email = request.body.email
    selectedUser.password = request.body.password
    selectedUser.isAdministrator = request.body.isAdministrator

    selectedUser.save(function (e, savedUser) {
      request.flash('success', 'Kullanıcı bilgileri güncellendi.')

      if (request.session.user._id === (savedUser._id + '')) {
        request.session.user = savedUser
      }

      return response.redirect(request.url)
    })
  })
}

userController.new = function (request, response) {
  return response.render('yenikullanici.html', {
    moment: moment,
    page: 'kullanicilar',
    user: request.session.user
  })
}

userController.newPost = function (request, response) {
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
}

userController.delete = function (request, response) {
  Users.findOne({
    _id: request.params.id
  }, function (e, selectedUser) {
    selectedUser.remove()
    request.flash('warning', 'Kullanıcı silindi!')
    // @TODO login olan o kisiye ait sessionlari da sil
    return response.redirect('/kullanicilar')
  })
}

// userController nesnesini module haline getiriyoruz
module.exports = userController
