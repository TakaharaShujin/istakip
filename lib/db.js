// Modulu yukledik
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Mongodaki veritabanimiza baglandik
mongoose.connect('mongodb://localhost/istakip')

// Schema larimizi tanimliyoruz (mongoose daki diger adi Model)
// SQL de otomatik 1,2,3 diye uretilen 'id' nin MongoDb deki karşılığı '_id' ve örneği nnnjj33dh83dh838dh diye üretliyor
// Mongoose aksi belirtilmedikçe otomatik olarak _id, created_at ve updated_at kolonlarını da ekliyor
// Schema türleri: http://mongoosejs.com/docs/schematypes.html
const UserClass = mongoose.model('User', new Schema(
  {
    name: {
      type: String,
      unique: true
    },
    email: String,
    password: String,
    isAdministrator: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
))

module.exports = UserClass
