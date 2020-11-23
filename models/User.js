const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  username: {type: String, required: true},
  karatekas: [{type: Schema.ObjectId, ref: 'Karateka'}],
  sensei: {type: Schema.ObjectId, ref: 'Sensei'},
  expire: {type: Number}
})

const User = mongoose.model('User', userSchema)

module.exports = User