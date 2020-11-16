const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const civilianSchema = new Schema({
  name: {type: String, default: 'Robin'},
  genre: {type: String, enum: ['male', 'female'], default: 'male'},
  solvency: {type: String, enum: ['insolvent', 'solvent', 'wealthy'], default: 'solvent'},
  nature: {type: String, enum: ['peaceful', 'wroth'], default: 'peaceful'},
  imageUrl: {type: String, default: '/images/male.jpg'}
});

const Civilian = mongoose.model('Civilian', civilianSchema);
module.exports = Civilian;