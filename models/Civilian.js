const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const civilianSchema = new Schema({
  name: {type: String}
});

const Civilian = mongoose.model('Civilian', civilianSchema);
module.exports = Civilian;