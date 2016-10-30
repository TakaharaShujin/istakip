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
  finished: {
    type: String,
    required: false
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
  history: [
    {
      // Required
      historyType: {
        type: String,
        required: true,
        enum: ['JobStarted', 'Assigned', 'JobTypeClosed', 'JobTypeReOpened', 'Commented']
      },
      date: {
        type: Date,
        required: true,
        default: Date.now
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      // Non-required
      comment: {
        type: String,
        required: false
      },
      historyAssignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
      },
      jobType: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'JobType'
      }
    }
  ],
  jobTypes: {
    type: Array,
    required: true
  }
}, modelInfo)

JobSchema.pre('save', function (next) {
  if (this.isNew) {
    this.history.push({
      m: 'JobStarted',
      user: this.createdBy
    })

    if (this.assignedTo) {
      this.history.push({
        type: 'Assigned',
        user: this.createdBy,
        assignedTo: this.assignedTo
      })
    }

  }
  next()
})

/**
 * Modül haline getiriyoruz
 */
module.exports.User = mongoose.model('User', UserSchema)
module.exports.Job = mongoose.model('Job', JobSchema)
module.exports.JobType = mongoose.model('JobType', JobTypeSchema)
