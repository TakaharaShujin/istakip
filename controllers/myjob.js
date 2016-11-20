// Gerekli modüller
const moment = require('moment')

// Zaman formatı türkçe
moment.locale('tr')

// Modelleri alıyoruz
const models = require('../lib/db')

// Render metodumuz
const render = require('../lib/render')

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
  .populate('createdBy')
  .exec(function (e, records) {
    const params = {
      page: 'islerim',
      records: records
    }

    return render(request, response, 'myjobs_list.html', params)
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
    if (!record.isOpened) {
      record.isOpened = true
      record.save()
      request.counts.UnreadJobCount--
    }

    const params = {
      page: 'islerim',
      record: record,
      tab: request.query.tab || 'isdetayi'
    }

    return render(request, response, 'myjobs_detail.html', params)
  })
}

// Modül haline getiriyoruz
module.exports = myjobController
