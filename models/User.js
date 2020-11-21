const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  karatekas: [{type: Schema.ObjectId, ref: 'Karateka'}],
  sensei: {type: Schema.ObjectId, ref: 'Sensei'}
})

const User = mongoose.model('User', userSchema)

module.exports = User