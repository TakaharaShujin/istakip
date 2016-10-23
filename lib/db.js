// Modulu yukledik
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Mongodaki veritabanimiza baglandik
mongoose.connect('mongodb://localhost/istakip')

/**
 * Tüm modellerde kullancağımız ortak özellikler/alanlar
 */
const modelInfo = {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
}

/**
 * Kullanici şeması
 */
const UserSchema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdministrator: {
    type: Boolean,
    default: false,
    required: true
  }
}, modelInfo)

/**
 * İş türleri
 */
const JobTypeSchema = Schema({
  name: {
    type: String,
    required: true
  }
}, modelInfo)

/**
 * İş şeması
 */
const JobSchema = Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  plannedStart: {
    type: Date,
    required: true
  },
  plannedEnd: {
    type: Date,
    required: true
  },
  jobStart: {
    type: Date,
    required: true
  },
  jobFinish: {
    type: Date,
    required: true
  },
  jobVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  createdBy: {
    type: Number,
    required: true,
    ref: 'UserSchema'
  },
  assignedTo: {
    type: Number,
    required: false,
    ref: 'UserSchema'
  },
  isOpened: {
    type: Boolean,
    required: false,
    default: false
  },
  comments: {
    type: Array
  }
}, modelInfo)

/**
 * Modül haline getiriyoruz
 */
module.exports.User = mongoose.model('User', UserSchema)
module.exports.Job = mongoose.model('Job', JobSchema)
module.exports.JobType = mongoose.model('JobType', JobTypeSchema)
