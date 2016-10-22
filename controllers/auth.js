// Gereki moduller
const Users = require('../lib/db')

// authController nesnesini olusturuyoruz
const authController = {}

authController.createFirstUser = function (request, response) {
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
}

authController.login = function (request, response) {
  return response.render('giris.html')
}

authController.loginPost = function (request, response) {
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
}

authController.logout = function (request, response) {
  return request.session.destroy(function () {
    return response.redirect('/giris')
  })
}

// authController nesnesini module haline getiriyoruz
module.exports = authController
