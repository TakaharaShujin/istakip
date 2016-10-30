// Gerekli modüller
const models = require('../lib/db')
const moment = require('moment')

// Zaman formatı türkçe
moment.locale('tr')

// Controller ı tanımlıyoruz
const adminJobController = {}

/**
 * İş detayı
 */
adminJobController.detail = function (request, response) {
  models.Job
  .findOne({
    _id: request.params.id
  })
  .populate('createdBy')
  .populate('assignedTo')
  .populate('jobTypes.jobtypeId')
  .populate('history.user')
  .populate('history.assignedTo')
  .exec(function (e, record) {
    response.render('myjobs_detail.html', {
      user: request.session.user,
      record: record,
      moment: moment,
      modelName: 'Job'
    })
  })
}

// Modül haline getiriyoruz
module.exports = adminJobController
