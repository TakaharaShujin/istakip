// Gerekli modüller
const moment = require('moment')

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

  models[modelName].find(function (e, records) {
    return response.render('crud_list.html', {
      modelName: modelName,
      name: namings[modelName],
      user: request.session.user,
      records: records,
      moment: moment
    })
  })
}

/**
 * Yeni kayıt oluşturma
 */
crudController.new = function (request, response) {
  let modelName = request.params.model

  models.User.find(function (e, users) {
    models.JobType.find(function (e, jobtypes) {
      return response.render('crud_new.html', {
        modelName: modelName,
        name: namings[modelName],
        user: request.session.user,
        users: users,
        jobtypes: jobtypes
      })
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
    record[key] = request.body.form[key]
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

  models[modelName].findOne({
    _id: request.params.id
  }, function (e, record) {
    return response.render('crud_edit.html', {
      modelName: modelName,
      name: namings[modelName],
      user: request.session.user,
      record: record
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

    record.save(function (e, savedRecord) {
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
