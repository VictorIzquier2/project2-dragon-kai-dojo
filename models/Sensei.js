const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const senseiSchema = new Schema({
  name: {type: String},
  genre: {type: String, enum: ['male', 'female']},
  solvency: {type: String, enum: ['insolvent', 'solvent', 'wealthy']},
  nature: {type: String, enum: ['peaceful', 'wroth']},
  level: {type: String, enum: ['white', 'yellow', 'orange', 'red', 'blue', 'green', 'brown', 'black'], default: 'white' },
  strength: {type: Number, min: 1, max: 5, default: 2},
  dexterity: {type: Number, min: 1, max: 5, default: 2},
  stamina: {type: Number, min: 1, max: 5, default: 2},
  mana: {type: Number, min: 1, max: 10, default: 2},
  standing: {type: Number, min: 5, max: 100},
  imageUrl: {type: String}
});

const Sensei = mongoose.model('Sensei', senseiSchema);
module.exports = Sensei;