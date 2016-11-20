// Gerekli modüller
const _ = require('lodash')
const moment = require('moment')

// Render metodumuz
const render = require('../lib/render')

// Modelleri alıyoruz
const models = require('../lib/db')

// Modeller için isimlendirmeler
const namings = {
  Job: 'İş',
  JobType: 'İş Türü',
  User: 'Kullanıcı'
}

// CRUD controller ı tanımlıyoruz
const crudController = {}

/**
 * Listeleme işlemi
 */
crudController.list = function (request, response) {
  let modelName = request.params.model
  let Model = models[modelName]

  let getter = Model.find()

  if (Model.schema.paths.createdBy) {
    getter.populate('createdBy')
  }

  if (Model.schema.paths.assignedTo) {
    getter.populate('assignedTo')
  }

  getter.exec(function (e, records) {
    const params = {
      modelName: modelName,
      name: namings[modelName],
      records: records
    }

    return render(request, response, 'crud_list.html', params)
  })
}

/**
 * Yeni kayıt oluşturma
 */
crudController.new = function (request, response) {
  let modelName = request.params.model

  models.User.find({
    isAdministrator: false
  },
  function (e, users) {
    models.JobType.find(function (e, jobtypes) {
      const params = {
        modelName: modelName,
        name: namings[modelName],
        users: users,
        jobtypes: jobtypes
      }

      return render(request, response, 'crud_new.html', params)
    })
  })
}

/**
 * Yeni kayıt oluşturma POST
 */
crudController.newPost = function (request, response) {
  let modelName = request.params.model
  let Model = models[modelName]

  var record = new Model()

  for (let key in request.body.form) {
    let value = request.body.form[key]

    if (key === 'jobTypes') {
      record[key] = _.map(value, function (obj) {
        return {
          jobtypeId: obj
        }
      })
    } else if (value) {
      record[key] = value
    }
  }

  if (Model.schema.paths.createdBy) {
    record.createdBy = request.session.user._id
  }

  record.save(function (err) {
    if (err) {
      throw new Error(err)
    }

    request.flash('success', 'Yeni kayıt eklendi!')

    return response.redirect('/list/' + modelName)
  })
}

/**
 * Kayıt düzenleme
 */
crudController.edit = function (request, response) {
  let modelName = request.params.model

  models.User.find({
    isAdministrator: false
  }, function (e, users) {
    models.JobType.find(function (e, jobtypes) {
      models[modelName].findOne({
        _id: request.params.id
      }, function (e, record) {
        const params = {
          modelName: modelName,
          name: namings[modelName],
          record: record,
          users: users,
          jobtypes: jobtypes
        }

        return render(request, response, 'crud_edit.html', params)
      })
    })
  })
}

/**
 * Kayıt düzenleme POST
 */
crudController.editPost = function (request, response) {
  let modelName = request.params.model

  models[modelName].findOne({
    _id: request.params.id
  }, function (e, record) {
    for (let key in request.body.form) {
      record[key] = request.body.form[key]
    }

    record.save(function (err, savedRecord) {
      if (err) {
        throw new Error(err)
      }

      request.flash('success', namings[modelName] + ' kaydı güncellendi.')

      return response.redirect('/list/' + modelName)
    })
  })
}

/**
 * Silme işlemi
 */
crudController.delete = function (request, response) {
  let modelName = request.params.model

  models[modelName].findOne({
    _id: request.params.id
  }, function (e, record) {
    record.remove()

    request.flash('warning', 'Kayıt silindi!')

    return response.redirect('/list/' + modelName)
  })
}

// CRUD controller ı modül haline getiriyoruz
module.exports = crudController
