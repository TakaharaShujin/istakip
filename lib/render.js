const _ = require('lodash')
const md5 = require('md5')
const moment = require('moment')

/**
 * Tüm controllerların kullanabileceği ortak render fonksiyonu
 */
const render = function (request, response, template, controllerParams) {
  const sharedParams = {
    user: request.session.user,
    moment: moment,
    counts: request.counts,
    userEmailHash: md5(request.session.user.email)
  }

  const allParams = _.merge(sharedParams, controllerParams)

  return response.render(template, allParams)
}

// Modül haline getiriyoruz
module.exports = render
