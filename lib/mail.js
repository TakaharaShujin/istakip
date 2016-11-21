// Bağımlılıklar
const nodemailer = require('nodemailer')
const model = require('./db')

// Mail gönderici (transporter)
var transporter = nodemailer.createTransport({
  host: process.env.MAIL_SRVR,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ADDR,
    pass: process.env.MAIL_PASS
  }
})

// Module init
const mail = {}

/**
 * Generic sender
 */
mail.send = function (params) {
  let fromMail = process.env.MAIL_ADDR

  var mailOptions = {
    from: `"İş Takip" <${fromMail}>`,
    to: params.to,
    subject: params.subject,
    text: params.body
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error)
    } else {
      console.log('MAILINFO: ' + JSON.stringify(info))
    }
  })
}

/**
 * Sends test mail
 */
mail.sendToAssigned = function (jobId) {
  model.Job
  .findOne({
    _id: jobId
  })
  .populate('assignedTo')
  .exec(function (e, job) {
    mail.send({
      to: job.assignedTo.email,
      subject: `[İşTakip] Yeni iş ataması: ${job.title}`,
      body: `Sayın ${job.assignedTo.name}\n` +
        `"${job.title}" adlı iş size atanmıştır.\n\n` +
        `https://istakip.herokuapp.com/isdetayim/${job._id} adresine giderek iş detayına erişebilirsiniz.\n\n` +
        'İş Takip Sistemi\n' +
        'htps://istakip.herokuapp.com'
    })
  })
}

// Export
module.exports = mail
