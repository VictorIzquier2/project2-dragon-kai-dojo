const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const senseiSchema = new Schema({
  name: {type: String, default: 'Robin'},
  genre: {type: String, enum: ['male', 'female'], default: 'male'},
  solvency: {type: String, enum: ['insolvent', 'solvent', 'wealthy'], default: 'solvent'},
  nature: {type: String, enum: ['peaceful', 'wroth'], default: 'peaceful'},
  level: {type: String, enum: ['white', 'yellow', 'orange', 'red', 'blue', 'green', 'brown', 'black'], default: 'red' },
  strength: {type: Number, min: 1, max: 5, default: 2},
  dexterity: {type: Number, min: 1, max: 5, default: 2},
  stamina: {type: Number, min: 1, max: 5, default: 2},
  mana: {type: Number, min: 1, max: 10, default: 2},
  standing: {type: Number, min: 30, max: 100, default: 30},
  imageUrl: {type: String, default: '/images/male1.jpg'},
  owner: {type: Schema.ObjectId, ref: 'User'}
});

const Sensei = mongoose.model('Sensei', senseiSchema);
module.exports = Sensei;