// homeController nesnesini olusturuyoruz
const homeController = {}

homeController.home = function (request, response) {
  return response.render('anasayfa.html', {
    page: 'anasayfa',
    user: request.session.user
  })
}

// homeController nesnesini module haline getiriyoruz
module.exports = homeController
