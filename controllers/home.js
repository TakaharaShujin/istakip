// Render metodumuz
const render = require('../lib/render')

// homeController nesnesini olusturuyoruz
const homeController = {}

homeController.home = function (request, response) {
  const params = {
    page: 'anasayfa'
  }

  return render(request, response, 'anasayfa.html', params)
}

// homeController nesnesini module haline getiriyoruz
module.exports = homeController
