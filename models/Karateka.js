const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const karatekaSchema = new Schema({
  name: {type: String},
  genre: {type: String, enum: ['male', 'female']},
  solvency: {type: String, enum: ['insolvent', 'solvent', 'wealthy']},
  nature: {type: String, enum: ['peaceful', 'wroth']},
  level: {type: String, enum: ['white', 'yellow', 'orange', 'red', 'blue', 'green', 'brown', 'black'], default: 'white' },
  strength: {type: Number, min: 1, max: 5, default: 2},
  dexterity: {type: Number, min: 1, max: 5, default: 2},
  stamina: {type: Number, min: 1, max: 5, default: 2},
  mana: {type: Number, min: 1, max: 5, default: 2},
  standing: {type: Number, min: 0, max: 29, default: 0},
  imageUrl: {type: String},
  owner: {type: Schema.ObjectId, ref: 'User'}
});

const Karateka = mongoose.model('Karateka', karatekaSchema);
module.exports = Karateka;