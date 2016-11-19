// Bağımlılıkları yükle
const _ = require('lodash')
const models = require('../lib/db')
const mongoose = require('mongoose')

// Init
const ajaxController = {}

/**
 * İşe yorum yazma
 */
ajaxController.comment = function (request, response) {
  // DB den işi bul
  models.Job.findOne({
    _id: request.body.JobId
  }, function (err, job) {
    if (err) {
      return response.end(JSON.stringify(err))
    }

    // Job'ın history'sine comment history'si ekle
    job.history.push({
      historyType: 'Commented',
      user: request.session.user._id,
      comment: request.body.comment
    })

    // Job ı güncelle
    job.save(function (err, record) {
      if (err) {
        return response.end(JSON.stringify(err))
      }

      return response.end('OK')
    })
  })
}

/**
 * İş durumunu güncelleme
 */
ajaxController.changeJobTypeStatus = function (request, response) {
  // DB den işi bul
  models.Job.findOne({
    _id: request.body.JobId
  }, function (err, job) {
    if (err) {
      return response.end(JSON.stringify(err))
    }

    // JobType ı bul
    let newJobType = _.find(job.jobTypes, ['jobtypeId', mongoose.Types.ObjectId(request.body.JobTypeId)])

    // Jobtype statüsünü değiştir
    newJobType.status = request.body.action

    // Eski job type ı sil
    job.jobTypes.pull({ _id: newJobType._id })

    // Yeni job type ı ekle
    job.jobTypes.push(newJobType) // added

    // History e bu islemi yaz (yorum vs)
    job.history.push({
      historyType: request.body.action === 'Closed' ? 'JobTypeClosed' : 'JobTypeReOpened',
      user: request.session.user._id,
      comment: request.body.comment,
      jobType: request.body.JobTypeId
    })

    // Job ı güncelle
    job.save(function (err, record) {
      if (err) {
        return response.end(JSON.stringify(err))
      }

      return response.end('OK')
    })
  })
}

module.exports = ajaxController
