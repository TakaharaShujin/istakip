// Gerekli modüller
const models = require('../lib/db')
const moment = require('moment')

// Render metodumuz
const render = require('../lib/render')

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
    const params = {
      record: record,
      tab: request.query.tab || 'isdetayi',
      modelName: 'Job'
    }

    return render(request, response, 'myjobs_detail.html', params)
  })
}

// Modül haline getiriyoruz
module.exports = adminJobController
