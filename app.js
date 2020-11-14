// REQUIRES
const chalk = require('chalk');
const dotenv = require('dotenv');
const express = require('express');


// CONSTANTS
const app = express();

// .env CONFIG
dotenv.config();

console.log(chalk.blue('Hello there! Node is installed!'));

// LISTENER
app.listen(process.env.PORT, () => {
  const PORT = process.env.PORT;
  console.log(chalk.green.inverse.bold(`Connected to port: ${PORT}`));
})