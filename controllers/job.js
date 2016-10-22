// jobController nesnesini olusturuyoruz
const jobController = {}

jobController.myJobs = function (request, response) {
  return response.render('islerim.html', {
    page: 'islerim',
    user: request.session.user
  })
}

// jobController nesnesini module haline getiriyoruz
module.exports = jobController
