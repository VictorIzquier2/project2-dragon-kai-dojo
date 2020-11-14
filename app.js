// REQUIRES
const chalk = require('chalk');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');


// CONSTANTS
const app = express();

// .env CONFIG
dotenv.config();

console.log(chalk.blue('Hello there! Node is installed!'));

// bodyParser CONFIG
app.use(bodyParser.urlencoded({extended: true}));

// STATIC FILES
app.use(express.static(__dirname + '/public'));

// .hbs CONFIG
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// ROUTES
app.get('/', (req, res, next) => {
  let data = {
    name: 'Ironhacker',
    bootcamp: 'Ironhack web dev'
  };
  res.render('index', data);
});

// LISTENER
app.listen(process.env.PORT, () => {
  const PORT = process.env.PORT;
  console.log(chalk.green.inverse.bold(`Connected to port: ${PORT}`));
})