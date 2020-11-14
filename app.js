// REQUIRES
const chalk = require('chalk');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');


// CONSTANTS
const app = express();

// MODELS
const Civilian = require('./models/Civilian.js');
// .env CONFIG
dotenv.config();

// bodyParser CONFIG
app.use(bodyParser.urlencoded({extended: true}));

// mongoose CONFIG
mongoose
  .connect(`mongodb://localhost/${process.env.DATABASE}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then((result) => {
    console.log(chalk.white.bgBlue('Connected to Mongodb. Database name: ', result.connections[0].name));
  })
  .catch((err) => {
    console.log(chalk.red('There has been an error: ', err));
  });

// STATIC FILES
app.use(express.static(__dirname + '/public'));

// DYNAMICS FILES
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// ROUTES
app.get('/', (req, res, next) => {

  /*
  let robin = new Civilian({name: 'Robin'});
  robin
    .save()
    .then(newCivilian => {
      console.log(`A new civilian is created: ${newCivilian}`);
    })
    .catch(err =>{
      console.log(`Error while creating a new civilian: ${err}`);
    })
  res.render('index', robin);
  */

  Civilian.find()
    .then(civsFromDB =>{
      civsFromDB.forEach(civ => console.log(`--> civ: ${civ.name}`));
    })
    .catch(err =>{
      console.log(`Error occurred during getting civilians from Database: ${err}`);
    });
});

// LISTENER
app.listen(process.env.PORT, () => {
  const PORT = process.env.PORT;
  console.log(chalk.green.inverse.bold(`Connected to port: ${PORT}`));
})