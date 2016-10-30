// Gerekli modüller
const moment = require('moment')

// Zaman formatı türkçe
moment.locale('tr')

// Modelleri alıyoruz
const models = require('../lib/db')

// Controller ı tanımlıyoruz
const myjobController = {}

/**
 * Listeleme
 */
myjobController.list = function (request, response) {
  models.Job
  .find({
    assignedTo: request.session.user._id
  })
 // .populate()
  .exec(function (e, records) {
    response.render('myjobs_list.html', {
      user: request.session.user,
      records: records,
      moment: moment,
      page: 'islerim'
    })
  })
}

/**
 * İş detayım
 */
myjobController.detail = function (request, response) {
  models.Job
  .findOne({
    _id: request.params.id,
    assignedTo: request.session.user._id
  })
  .populate('createdBy')
  .populate('assignedTo')
  .populate('jobTypes.jobtypeId')
  .populate('history.user')
  .populate('history.historyAssignedTo')
  .populate('history.jobType')
  .exec(function (e, record) {
    response.render('myjobs_detail.html', {
      user: request.session.user,
      record: record,
      moment: moment,
      page: 'islerim'
    })
  })
}

// Modül haline getiriyoruz
module.exports = myjobController
