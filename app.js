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
const Karateka = require('./models/Karateka.js');
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

mongoose.connection.on('connected', ()=>{
  console.log(chalk.blue('Mongoose default connection open'));
});

mongoose.connection.on('error', (error)=>{
  console.log(chalk.red('Mongoose default connection error: ', error));
});

mongoose.connection.on('disconnected', ()=>{
  console.log(chalk.yellow('Mongoose default connection disconnected'));
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});



// STATIC FILES
app.use(express.static(__dirname + '/public'));

// DYNAMICS FILES
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// ROUTES
app.get('/', (req, res, next) => {

    res.render('index');
  });

app.get('/main', (req, res, next) => {
  res.render('main');
})
  
app.get('/city', (req, res, next) => {
  
  // CIVILIAN GENERATOR
 
  const randomCivilian = () =>{
    const randomGenre = () => {
      const genreList = ['male', 'female'];
      return genreList[Math.round(Math.random())];
    };

    const genreResult = randomGenre();
    
    const randomName = (genre) =>{
      const randomMaleName = () => {
        const nameList = ['Davian', 'Sterling', 'Turner', 'Felipe', 'Rodrik', 'Rick', 'Jacob', 'Danny', 'August', 'Keon', 'Cannon', 'Wyatt', 'Manuel', 'Troy', 'Darek', 'Riley', 'Jason', 'Jeff', 'Michael', 'Luciano'];
        return nameList[Math.round(Math.random() * (nameList.length))];
      };
      const randomFemaleName = () => {
        const nameList = ['Grace', 'Janiah', 'Angeline', 'Krystal', 'Anaya', 'Janet', 'Kristin', 'Scarlet', 'Macie', 'Simone', 'Anahi', 'Carly', 'Sophie', 'Amani', 'Camila', 'Gloria', 'Natty', 'Raegan', 'Valerie', 'Shyanne'];
        return nameList[Math.round(Math.random() * (nameList.length))];
      };
      if(genre == 'male'){
        return randomMaleName();
      }else {
        return randomFemaleName();
      }
    }

    const randomSolvency = () => {
      const solvencyList = ['insolvent', 'solvent', 'wealthy'];
      return solvencyList[Math.round(Math.random() * (solvencyList.length))];
    };

    const randomNature = () => {
      const natureList = ['peaceful', 'wroth'];
      return natureList[Math.round(Math.random())];
    };

    const randomUrl = (genre) => {
      const randomMaleImage = () => {
        const imageList = ['/images/male1.jpg', '/images/male2.jpg', '/images/male3.jpg', '/images/male4.jpg'];
        return imageList[Math.round(Math.random() * (imageList.length))];
      };
      const randomFemaleImage = () => {
        const imageList = ['/images/female1.jpg', '/images/female2.jpg', '/images/female3.jpg', '/images/female4.jpg'];
        return imageList[Math.round(Math.random() * (imageList.length))];
      };
      if(genre == 'male'){
        return randomMaleImage();
      }else {
        return randomFemaleImage();
      }
    }
    
    const newCiv = new Civilian({
      name: randomName(genreResult),
      genre: genreResult,
      solvency: randomSolvency(),
      nature: randomNature(),
      imageUrl: randomUrl(genreResult)
    })
    return newCiv;
  }
  /*
  Civilian.create(randomCivilian())
  .save()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  })
  */
  
  /*
  Civilian.find({name: 'Robin', genre: 'female', nature: 'peaceful', solvency: 'wealthy'})
    .then(civsFromDB =>{
      civsFromDB.forEach(civ => console.log(`--> civ: ${civ}`));
    })
    .catch(err =>{
      console.log(`Error occurred during getting civilians from Database: ${err}`);
    });
  */

  Civilian.countDocuments()
    .then((count) => {
      console.log(`There are ${count} debs`)
      res.render('city', {count});
    })
});

app.post('/city', (req, res, next) => {
  res.render('main');
})

// LISTENER
app.listen(process.env.PORT, () => {
  const PORT = process.env.PORT;
  console.log(chalk.green.inverse.bold(`Connected to port: ${PORT}`));
})