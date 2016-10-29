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
    type: String,
    required: true
  },
  plannedEnd: {
    type: String,
    required: true
  },
  jobStart: {
    type: String,
    required: false
  },
  jobFinish: {
    type: String,
    required: false
  },
  jobVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  },
  isOpened: {
    type: Boolean,
    required: false,
    default: false
  },
  comments: {
    type: Array
  },
  jobTypes: {
    type: Array,
    required: true
  }
}, modelInfo)

/**
 * Modül haline getiriyoruz
 */
module.exports.User = mongoose.model('User', UserSchema)
module.exports.Job = mongoose.model('Job', JobSchema)
module.exports.JobType = mongoose.model('JobType', JobTypeSchema)
