// REQUIRES
const dotenv     = require('dotenv');
const express    = require('express');
const chalk      = require('chalk');
const bodyParser = require('body-parser');
const hbs        = require('hbs');
const mongoose   = require('mongoose');
const bcrypt     = require('bcrypt');
const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);
const axios      = require('axios').default;

// CONSTANTS
const app = express();
const salt = bcrypt.genSaltSync(process.env.SALTROUNDS);

// MODELS
const Civilian = require('./models/Civilian.js');
const Karateka = require('./models/Karateka.js');
const Master = require('./models/Master.js');
const Sensei = require('./models/Sensei.js');
const User = require('./models/User.js');
const { level } = require('chalk');
const { findOneAndUpdate, find } = require('./models/Civilian.js');

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

// cookies CONFIG
app.use(session({
  secret: "basic-auth-secret",
  //cookie: { maxAge: 86400 },
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// -- ROUTES -- 
app.get('/', (req, res, next) => {
    res.render('index');
  });


// USER

app.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

app.post('/sign-up', (req, res, next) => {
  const {email, password, username} = req.body;
  User.findOne({username: username})
    .then((result)=> {
      if(!result){
        User.findOne({email: email})
          .then((result) => {
            if(!result){
              bcrypt.genSalt(10)
                .then((salt) => {
                  bcrypt.hash(password, salt)
                    .then((hashedPassword)=> {
                      const hashedUser = {email: email, username: username, password: hashedPassword}
                      User.create(hashedUser)
                        .then(() => {
                          const randomMaster = () =>{
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
      
                            
                            const randomLevel = () => {
                              const levelList = ['red', 'blue', 'green', 'brown', 'black'];
                              return levelList[Math.round(Math.random() * (levelList.length))];
                            }
                            const randomSkill = () => {
                              return Math.ceil(Math.random() * 5);
                            }
                            const randomMana = () => {
                              return Math.ceil(Math.random() * 10);
                            }
                            const randomStanding = () => {
                              return Math.floor(Math.random() * (81 - 30 ) + 30);
                            }
                            
                            const randomUrl = (genre) => {
                              if(genre == 'male'){
                                const maleUrlList = ['/images/male1.jpg', '/images/male2.jpg', '/images/male3.jpg', '/images/male4.jpg']
                                return maleUrlList[Math.round(Math.random() * (maleUrlList.length))];
                              }else {
                                const femaleUrlList = ['/images/female1.jpg', '/images/female2.jpg', '/images/female3.jpg', '/images/female4.jpg']
                                return femaleUrlList[Math.round(Math.random() * (femaleUrlList.length))];
                              }
                            }
      
                            const newMaster = new Master({
                              name: randomName(genreResult),
                              genre: genreResult,
                              solvency: randomSolvency(),
                              nature: randomNature(),
                              level: randomLevel(),
                              strength: randomSkill(),
                              dexterity: randomSkill(),
                              stamina: randomSkill(),
                              mana: randomMana(),
                              standing: randomStanding(),
                              imageUrl: randomUrl(genreResult)
                            })
                            return newMaster;
                          }
                          Master.create(randomMaster())
                            .then(()=> {
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
                                  if(genre == 'male'){
                                    return '/images/male.jpg';
                                  }else {
                                    return '/images/female.jpg';
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
                              const civAtStart = () => Civilian.create(randomCivilian());
                              Promise.all([civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart(), civAtStart()])
                                .then(() => {
                                  res.redirect('/main');
                                })
                                .catch((err) => {
                                  console.log(err);
                                  res.send("Error al crear nuevos ciudadanos")
                                })
                            })
                            .catch((err) => {
                              console.log(err);
                              res.send("Error al crear un nuevo maestro");
                            })
                        })
                        .catch((err) => {
                          console.log(err);
                          res.send("Error al crear el nuevo usuario");
                        })
                    })
                    .catch((err) => {
                      console.log(err);
                      res.send("Error al hashear la contraseña");
                    })
                })
                .catch((err) => {
                  console.log(err);
                  res.send("Error al encriptar la contraseña");
                })
            }else {
              res.render('log-in', {errorMessage: 'El email ya existe. Prueba a hacer log-in'})
            }
          })
      }else {
        res.render('log-in', {errorMessage: 'Ese nombre de usuario ya existe. Pon otro.'})
      }

    })
})

app.get('/log-in', (req, res, next) => {
  res.render('log-in');
})

app.post('/log-in', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const expire = Date.now;
  User.findOne({email: email})
    .then((result) => {
      if(!result){
        res.render('log-in', {errorMessage: 'Usuario no encontrado'})
      }else {
        bcrypt.compare(password, result.password)
          .then((resultFromBcrypt) => {
            if(resultFromBcrypt){
              req.session.currentUser = email;
           
                  console.log(req.session);
                  res.redirect('/main');               
            }else{
              res.render('log-in', {errorMessage: 'La contraseña es incorrecta. Vuelve a intentarlo'})
            }
          })
      }
    })
})

app.get('/log-out', (req, res, next) => {
  req.session.destroy()
  res.redirect('/');
})

app.use((req, res, next) => {
  if(req.session.currentUser){
    next();
  } else {
    res.redirect('/log-in');
  }
})

// MAIN

app.get('/main', (req, res, next) => {
  User.findOne({email: req.session.currentUser})
    .then((user)=>{
      Karateka.find({owner: user._id})
      .then((trainees) => {
        const traineesNumb = trainees.length;
        Civilian.countDocuments()
        .then((debs) => {
          Master.countDocuments()
          .then((masters) => {
                res.render('main', {session: req.session.currentUser, traineesNumb, debs, masters});
                })
            })
        })
    })
});

app.post('/main', (req, res, next) => {
  User.findOne({email: req.session.currentUser})
  .then((user)=> {
    Sensei.findOne({owner: user._id})
      .then((result)=> {
        if(!result){
          const masterId = req.params;
          const master = Master
            .findOne(masterId)
            .then((master)=>{
              const sensei = () => {
        
                const senseiName = () => master.name;
                const senseiGenre = () => master.genre;
                const senseiSolvency = () => master.solvency;
                const senseiNature = () => master.nature;
                const senseiLevel = () => master.level;
                const senseiStrength = () => master.strength;
                const senseiDexterity = () => master.dexterity;
                const senseiStamina = () => master.stamina;
                const senseiMana = () => master.mana;
                const senseiStanding = () => master.standing;
                const senseiImageUrl = () => master.imageUrl;
        
                const newSensei = new Sensei({
                  name: senseiName(),
                  genre: senseiGenre(),
                  solvency: senseiSolvency(),
                  nature: senseiNature(),
                  level: senseiLevel(),
                  strength: senseiStrength(),
                  dexterity: senseiDexterity(),
                  stamina: senseiStamina(),
                  mana: senseiMana(),
                  standing: senseiStanding(),
                  imageUrl: senseiImageUrl(),
                  owner: user._id
                })
                return newSensei;
              }
              Sensei.create(sensei())
                .then((createdSensei) => {
                  User.updateOne({email: req.session.currentUser}, {$push: {sensei: createdSensei._id}})
                    .then(() => {
                      Master.deleteOne(masterId)
                        .then(()=>{
                          Master.countDocuments()
                            .then((count) => {
                              res.render('main', {count});
                            })
                            .catch((err) => {
                              console.log(err);
                              res.send("Error a contabilizar a los maestros");
                            })
                        })
                        .catch((err)=>{
                          console.log(err);
                          res.send("Error al eliminar al maestro disponible de la lista de maestros");
                        })  
                    })
                    .catch((err) => {
                      console.log(err);
                      res.send("Error al pushear al nuevo sensei dentro del usuario");
                    })
                })
                .catch((err) => {
                  console.log(err);
                  res.send("Error creando al nuevo sensei");
                })
            })
            .catch((err)=> {
              console.log(err);
              res.send("Error localizando al maestro");
            });
        }else {
          res.render('main', {errorMessage: 'Solo puedes tomar un sensei'});
        }
      })
      .catch((err) => {
        console.log(err);
        res.send("Error localizando al sensei")
      })
  })
})

// CLASSES

app.get('/classes', (req, res, next) => {
  
  User.findOne({email: req.session.currentUser})
    .then((user)=>{
      Sensei.find({owner: user._id}, {name: 1, imageUrl: 1, level: 1, standing: 1})
        .then((senseis)=> {
          Karateka.find({owner: user._id}, {name: 1, imageUrl: 1, level: 1, standing: 1})
            .then((karatekas) => {
              res.render('classes', {senseis, karatekas});
            })
            .catch((err)=> {
              console.log(err);
            })
        })
    })
});



app.post('/classes/train', (req, res, next) => {

  const levelUpStrength = (trainee) => {
    let levelUp = 0;
    let numberOfDices = trainee.dexterity + trainee.strength;
    let diceRoll = numberOfDices * Math.floor(Math.random() * (11-2)) + 1;
    if (numberOfDices == 2 && trainee.strength < 5){
      diceRoll > 17 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 3){
      diceRoll > 25 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 4){
      diceRoll > 33 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 5){
      diceRoll > 41 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 6){
      diceRoll > 49 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 7){
      diceRoll > 57 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 8){
      diceRoll > 65 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 9){
      diceRoll > 73 ? levelUp = 1 : levelUp = 0;
    }
    return levelUp;    
  }
  
  const levelUpDexterity = (trainee) => {
    let levelUp = 0;
    let numberOfDices = trainee.dexterity + trainee.dexterity - Math.round(trainee.dexterity/2);
    let diceRoll = numberOfDices * Math.floor(Math.random() * (11-2)) + 1;
    if(numberOfDices == 1 < trainee.dexterity < 5){  
      diceRoll > 8 ? levelUp = 1 : levelUp = 0;
    }else if (numberOfDices == 2){
      diceRoll > 17 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 3){
      diceRoll > 25 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 4){
      diceRoll > 33 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 5){
      diceRoll > 41 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 6){
      diceRoll > 49 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 7){
      diceRoll > 57 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 8){
      diceRoll > 65 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 9){
      diceRoll > 73 ? levelUp = 1 : levelUp = 0;
    }
    return levelUp;
  }

  const levelUpStamina = (trainee) => {
    let levelUp = 0;
    let numberOfDices = trainee.dexterity + trainee.stamina;
    let diceRoll = numberOfDices * Math.floor(Math.random() * (11-2)) + 1;
    if (numberOfDices == 2 && trainee.stamina < 5){
      diceRoll > 17 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 3){
      diceRoll > 25 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 4){
      diceRoll > 33 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 5){
      diceRoll > 41 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 6){
      diceRoll > 49 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 7){
      diceRoll > 57 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 8){
      diceRoll > 65 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 9){
      diceRoll > 73 ? levelUp = 1 : levelUp = 0;
    }  
    return levelUp;   
  }

  const levelUpMana = (trainee) => {
    let levelUp = 0;
    let numberOfDices = trainee.dexterity + trainee.mana;
    let diceRoll = numberOfDices * Math.floor(Math.random() * (11-2)) + 1;
    if (numberOfDices == 2 && trainee.mana < 5){
      diceRoll > 17 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 3){
      diceRoll > 25 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 4){
      diceRoll > 33 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 5){
      diceRoll > 41 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 6){
      diceRoll > 49 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 7){
      diceRoll > 57 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 8){
      diceRoll > 65 ? levelUp = 1 : levelUp = 0;
    }else if(numberOfDices == 9){
      diceRoll > 73 ? levelUp = 1 : levelUp = 0;
    }  
    return levelUp;   
  }

  User.findOne({email: req.session.currentUser})
    .then((usuary)=> {    
      console.log(usuary.expire)   
      if(usuary.expire < (Date.now() - 86400000) || typeof usuary.expire == "undefined"){
        User.updateOne({email: req.session.currentUser}, {expire: Date.now()})
            .then(() => {
              Karateka.find({owner: usuary._id}, {name: 1, imageUrl: 1, strength: 1, dexterity: 1, stamina: 1, mana: 1, _id: 1}).sort({strength: -1, dexterity: -1, stamina: -1, mana: -1})
                .then((trainees) => {
                  trainees.forEach((trainee)=>{
                    const id = trainee._id;
                    const newStrength = trainee.strength += levelUpStrength(trainee);
                    const newDexterity = trainee.dexterity += levelUpDexterity(trainee);
                    const newStamina = trainee.stamina += levelUpStamina(trainee);
                    const newMana = trainee.mana += levelUpMana(trainee);
                    Karateka.findByIdAndUpdate(id, {strength: newStrength, dexterity: newDexterity, stamina: newStamina, mana: newMana})
                  })
                  res.render('classes/train', {trainees})
          
                })
                .catch((err)=> {
                  console.log(err);
                })
            })
      }else {
         Sensei.find({owner: usuary._id}, {name: 1, imageUrl: 1, level: 1, standing: 1})
          .then((senseis)=> {
            Karateka.find({owner: usuary._id}, {name: 1, imageUrl: 1, level: 1, standing: 1})
              .then((karatekas) => {
                res.render('classes', {senseis, karatekas, trainErrorMessage: 'No puedes volver a entrenar en 24h'});
              })
              .catch((err)=> {
                console.log(err);
              })
          })
      }
    })
});

app.get('/classes/battle', (req, res, next) => {
  User.findOne({email: req.session.currentUser})
    .then((user) => {
      Karateka.find({owner: user._id}, {name: 1, imageUrl: 1, strength: 1, dexterity: 1, stamina: 1, level: 1, nature: 1, mana: 1, standing: 1, _id: 1}).sort({strength: -1, dexterity: -1, stamina: -1})
          .then((opponents) => {
            res.render('classes/battle', ({opponents}))
          })
          .catch((err)=> {
            console.log(err);
          })
    })
});

app.post('/classes/battle/', (req, res, next) => {
    const findFirstOne = () => {
      return Karateka.findById(req.body._id[0])
    }
  
    const findSecondOne = () => {
      return Karateka.findById(req.body._id[1])
    }
    Promise.all([findFirstOne(), findSecondOne()])
      .then((result) => {
        const firstStrike = (aggressor, defensor) => {
          let aggNumberOfDices = aggressor.dexterity + aggressor.strength;
          let aggDiceRoll = aggNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          let defNumberOfDices = defensor.dexterity + defensor.stamina;
          let defDiceRoll = defNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          aggDiceRoll < defDiceRoll ?  defensor.mana  : defensor.mana -= 1;
        };

        const strikes = (fighter1, fighter2) => {
          let fighter1Luky = fighter1.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          let fighter2Luky = fighter2.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          fighter1Luky > fighter2Luky ? firstStrike(fighter1, fighter2) : firstStrike(fighter2, fighter1);
        };

        let winner = [];
        let loser = [];

        // The most aggressive strikes first
        result[0].nature == 'wroth' ? firstStrike(result[0], result[1]) : firstStrike(result[1], result[0]);

        // Rest of combat
        do {strikes(result[0], result[1])} while(result[0].mana > 0 && result[1].mana > 0);

        // Check Winner
        result.forEach((opp)=> {
          if(opp.mana > 0 ){
            winner.push(opp);
          }else {
            loser.push(opp);
          }
        })
        loser.forEach((opp)=>{
          let oppId = opp._id;
          const standingMinus = (opp) => opp.standing > 7 ? opp.standing -1 : opp.standing;
          Karateka.findByIdAndUpdate(oppId, {standing : standingMinus(opp)})
            .then(()=>{
              winner.forEach((opp)=>{
                let oppWId = opp._id;
                const standingPlus = (opp) => {
                  if(opp.standing < 99){
                    opp.standing++;
                  }else{
                    opp.standing;
                  }
                  return opp.standing;
                }
                const levelPlus = (x) => {
                  if(x.standing > 68) 
                    x.level = "black"
                  else if(x.standing > 58)
                    x.level = "brown"
                  else if(x.standing > 48)
                    x.level = "green"
                  else if(x.standing > 38)
                    x.level = "blue"
                  else if(x.standing > 28)
                    x.level = "red"
                  else if(x.standing > 18)
                    x.level = "orange"
                  else if(x.standing > 8)
                    x.level = "yellow"
                  else{
                    x.level = "white"
                  }
                  return x.level;
                }
                
                Karateka.findByIdAndUpdate(oppWId, {standing: standingPlus(opp), level: levelPlus(opp)})
                  .then(()=> {
                    // Hide BattleBtn and Choose Opponents
                    let hide = "display: none"; 
                    // Render Winner
                    res.render('classes/battle', {winner, hide});
                  })
              })
          })
        })
        
      })
      .catch((err)=> {
        console.log(err);
        res.send("Error al renderizar la pelea")
      })

})

app.get('/classes/tourney', (req, res, next) => {
  User.findOne({email: req.session.currentUser})
    .then((user) => {
      Karateka.find({owner: user._id}, {name: 1, imageUrl: 1, level: 1, standing: 1})
        .then((opponents) => {
          res.render('classes/tourney', {opponents});
        })
        .catch((err)=> {
          console.log(err);
    
        });
    })
});

app.post('/classes/tourney', (req, res, next) => {
  const firstOne = () => Karateka.findById(req.body._id[0])
  const secondOne = () => Karateka.findById(req.body._id[1])
  const thirdthOne = () => Karateka.findById(req.body._id[2]);
  const fourthOne = () => Karateka.findById(req.body._id[3]);
  const fifthOne = () => Karateka.findById(req.body._id[4]);
  const sixthOne = () => Karateka.findById(req.body._id[5]);
  const seventhOne = () => Karateka.findById(req.body._id[6]);
  const eighthOne = () => Karateka.findById(req.body._id[7]);
  const ninethOne = () => Karateka.findById(req.body._id[8]);
  const tenthOne = () => Karateka.findById(req.body._id[9]);
  const eleventhOne = () => Karateka.findById(req.body._id[10]);
  const twelvethOne = () => Karateka.findById(req.body._id[11]);
  const thirteenthOne = () => Karateka.findById(req.body._id[12]);
  const fourteenthOne = () => Karateka.findById(req.body._id[13]);
  const fifteenthOne = () => Karateka.findById(req.body._id[14]);
  const sixteenthOne = () => Karateka.findById(req.body._id[15]);
    
    Promise.all([firstOne(), secondOne(), thirdthOne(), fourthOne(), fifthOne(), sixthOne(), seventhOne(), eighthOne(), ninethOne(), tenthOne(), eleventhOne(), twelvethOne(), thirteenthOne(), fourteenthOne(), fifteenthOne(), sixteenthOne()])
      .then((result)=>{
        
        const firstknock = (aggressor, defensor) => {
          let aggNumberOfDices = aggressor.dexterity + aggressor.strength;
          let aggDiceRoll = aggNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          let defNumberOfDices = defensor.dexterity + defensor.stamina;
          let defDiceRoll = defNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          aggDiceRoll < defDiceRoll ?  defensor.mana  : defensor.mana -= 1;
        };

        const combat = (fighter1, fighter2) => {
          let fighter1Luky = fighter1.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          let fighter2Luky = fighter2.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          fighter1Luky > fighter2Luky ? firstknock(fighter1, fighter2) : firstknock(fighter2, fighter1);
        };

        let vencedores = [];
        let perdedores = [];

        // The most aggressive strikes first
        result[0].nature == 'wroth' ? firstknock(result[0], result[8]) : firstknock(result[8], result[0]);
        // Rest of combat
        do {combat(result[0], result[8])} while(result[0].mana > 0 && result[8].mana > 0);

        // The most aggressive strikes first
        result[1].nature == 'wroth' ? firstknock(result[1], result[9]) : firstknock(result[9], result[1]);
        // Rest of combat
        do {combat(result[1], result[9])} while(result[1].mana > 0 && result[9].mana > 0);

        // The most aggressive strikes first
        result[2].nature == 'wroth' ? firstknock(result[2], result[10]) : firstknock(result[10], result[2]);
        // Rest of combat
        do {combat(result[2], result[10])} while(result[2].mana > 0 && result[10].mana > 0);

        // The most aggressive strikes first
        result[3].nature == 'wroth' ? firstknock(result[3], result[11]) : firstknock(result[11], result[3]);
        // Rest of combat
        do {combat(result[3], result[11])} while(result[3].mana > 0 && result[11].mana > 0);

        // The most aggressive strikes first
        result[4].nature == 'wroth' ? firstknock(result[4], result[12]) : firstknock(result[12], result[4]);
        // Rest of combat
        do {combat(result[4], result[12])} while(result[4].mana > 0 && result[12].mana > 0);

        // The most aggressive strikes first
        result[5].nature == 'wroth' ? firstknock(result[5], result[13]) : firstknock(result[13], result[5]);
        // Rest of combat
        do {combat(result[5], result[13])} while(result[5].mana > 0 && result[13].mana > 0);

        // The most aggressive strikes first
        result[6].nature == 'wroth' ? firstknock(result[6], result[14]) : firstknock(result[14], result[6]);
        // Rest of combat
        do {combat(result[6], result[14])} while(result[6].mana > 0 && result[14].mana > 0);

        // The most aggressive strikes first
        result[7].nature == 'wroth' ? firstknock(result[7], result[15]) : firstknock(result[15], result[7]);
        // Rest of combat
        do {combat(result[7], result[15])} while(result[7].mana > 0 && result[15].mana > 0);

        result.forEach((player)=> {
          if(player.mana > 0){
            vencedores.push(player);
          }else{
            perdedores.push(player)
          }
        })

        if(vencedores.length == 7){
          vencedores.push(perdedores[0]);
        }else if(vencedores.length == 6){
          vencedores.push(perdedores[0], perdedores[1])
        }else if(vencedores.length == 5){
          vencedores.push(perdedores[0],perdedores[1], perdedores[2], )
        }else if(vencedores.length == 4){
          vencedores.push(perdedores[0], perdedores[1], perdedores[2], perdedores[3], )
        }else if(vencedores.length == 3){
          vencedores.push(perdedores[0],perdedores[1], perdedores[2], perdedores[3], perdedores[4], )
        }else if(vencedores.length == 2){
          vencedores.push(perdedores[0], perdedores[1], perdedores[2], perdedores[3], perdedores[4], perdedores[5], )
        }else if(vencedores.length == 1){
          vencedores.push(perdedores[0], perdedores[1], perdedores[2], perdedores[3], perdedores[4], perdedores[5], perdedores[6], )
        }else if(vencedores.length == 0){
          vencedores.push(perdedores[0], perdedores[1], perdedores[2], perdedores[3], perdedores[4], perdedores[5], perdedores[6], perdedores[7])
        }
       
        res.render('classes/tourney/firstRound', {vencedores});
      })
})

app.post('/classes/tourney/firstRound', (req, res, next) => {

  const firstOne = () => Karateka.findById(req.body._id[0])
  const secondOne = () => Karateka.findById(req.body._id[1])
  const thirdthOne = () => Karateka.findById(req.body._id[2]);
  const fourthOne = () => Karateka.findById(req.body._id[3]);
  const fifthOne = () => Karateka.findById(req.body._id[4]);
  const sixthOne = () => Karateka.findById(req.body._id[5]);
  const seventhOne = () => Karateka.findById(req.body._id[6]);
  const eighthOne = () => Karateka.findById(req.body._id[7]);
    Promise.all([firstOne(), secondOne(), thirdthOne(), fourthOne(), fifthOne(), sixthOne(), seventhOne(), eighthOne()])
      .then((result)=>{
        
        const firstknock = (aggressor, defensor) => {
          let aggNumberOfDices = aggressor.dexterity + aggressor.strength;
          let aggDiceRoll = aggNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          let defNumberOfDices = defensor.dexterity + defensor.stamina;
          let defDiceRoll = defNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          aggDiceRoll < defDiceRoll ?  defensor.mana  : defensor.mana -= 1;
        };

        const combat = (fighter1, fighter2) => {
          let fighter1Luky = fighter1.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          let fighter2Luky = fighter2.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          fighter1Luky > fighter2Luky ? firstknock(fighter1, fighter2) : firstknock(fighter2, fighter1);
        };

        let vencedores = [];
        let perdedores = [];

        // The most aggressive strikes first
        result[0].nature == 'wroth' ? firstknock(result[0], result[4]) : firstknock(result[4], result[0]);
        // Rest of combat
        do {combat(result[0], result[4])} while(result[0].mana > 0 && result[4].mana > 0);

        // The most aggressive strikes first
        result[1].nature == 'wroth' ? firstknock(result[1], result[5]) : firstknock(result[5], result[1]);
        // Rest of combat
        do {combat(result[1], result[5])} while(result[1].mana > 0 && result[5].mana > 0);

        // The most aggressive strikes first
        result[2].nature == 'wroth' ? firstknock(result[2], result[6]) : firstknock(result[6], result[2]);
        // Rest of combat
        do {combat(result[2], result[6])} while(result[2].mana > 0 && result[6].mana > 0);

        // The most aggressive strikes first
        result[3].nature == 'wroth' ? firstknock(result[3], result[7]) : firstknock(result[7], result[3]);
        // Rest of combat
        do {combat(result[3], result[7])} while(result[3].mana > 0 && result[7].mana > 0);

        result.forEach((player)=> {
          if(player.mana > 0){
            vencedores.push(player);
          }else{
            perdedores.push(player);
          }
        })
        if(vencedores.length == 3){
          vencedores.push(perdedores[0])
        }else if(vencedores.length == 2 ){
          vencedores.push(perdedores[0], perdedores[1], )
        }else if(vencedores.length == 1){
          vencedores.push(perdedores[0], perdedores[1], perdedores[2], )
        }
        else if(vencedores.length == 0){
          vencedores.push(perdedores[0], perdedores[1], perdedores[2], perdedores[3])
        }        
        res.render('classes/tourney/secondRound', {vencedores});
      })
})

app.post('/classes/tourney/secondRound', (req, res, next) => {

  const firstOne = () => Karateka.findById(req.body._id[0])
  const secondOne = () => Karateka.findById(req.body._id[1])
  const thirdthOne = () => Karateka.findById(req.body._id[2]);
  const fourthOne = () => Karateka.findById(req.body._id[3]);
    Promise.all([firstOne(), secondOne(), thirdthOne(), fourthOne()])
      .then((result)=>{
        
        const firstknock = (aggressor, defensor) => {
          let aggNumberOfDices = aggressor.dexterity + aggressor.strength;
          let aggDiceRoll = aggNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          let defNumberOfDices = defensor.dexterity + defensor.stamina;
          let defDiceRoll = defNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          aggDiceRoll < defDiceRoll ?  defensor.mana  : defensor.mana -= 1;
        };

        const combat = (fighter1, fighter2) => {
          let fighter1Luky = fighter1.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          let fighter2Luky = fighter2.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          fighter1Luky > fighter2Luky ? firstknock(fighter1, fighter2) : firstknock(fighter2, fighter1);
        };

        let vencedores = [];
        let perdedores = [];

        // The most aggressive strikes first
        result[0].nature == 'wroth' ? firstknock(result[0], result[2]) : firstknock(result[2], result[0]);
        // Rest of combat
        do {combat(result[0], result[2])} while(result[0].mana > 0 && result[2].mana > 0);

        // The most aggressive strikes first
        result[1].nature == 'wroth' ? firstknock(result[1], result[3]) : firstknock(result[3], result[1]);
        // Rest of combat
        do {combat(result[1], result[3])} while(result[1].mana > 0 && result[3].mana > 0);

        result.forEach((player)=> {
          if(player.mana > 0){
            vencedores.push(player);
          }else {
            perdedores.push(player);
          }
        })
        if(vencedores.length == 1){
          vencedores.push(perdedores[0]);
        }else if(vencedores.length == 0){
          vencedores.push(perdedores[0], perdedores[1])
        }
        res.render('classes/tourney/semiFinal', {vencedores});
      })
})

app.post('/classes/tourney/semiFinal', (req, res, next) => {

  const firstOne = () => Karateka.findById(req.body._id[0])
  const secondOne = () => Karateka.findById(req.body._id[1])
    Promise.all([firstOne(), secondOne()])
      .then((result)=>{
        
        const firstknock = (aggressor, defensor) => {
          let aggNumberOfDices = aggressor.dexterity + aggressor.strength;
          let aggDiceRoll = aggNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          let defNumberOfDices = defensor.dexterity + defensor.stamina;
          let defDiceRoll = defNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
          aggDiceRoll < defDiceRoll ?  defensor.mana  : defensor.mana -= 1;
        };

        const combat = (fighter1, fighter2) => {
          let fighter1Luky = fighter1.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          let fighter2Luky = fighter2.dexterity * Math.floor(Math.random() * (11-2)) + 1;
          fighter1Luky > fighter2Luky ? firstknock(fighter1, fighter2) : firstknock(fighter2, fighter1);
        };

        let vencedores = [];
        let perdedores = [];

        // The most aggressive strikes first
        result[0].nature == 'wroth' ? firstknock(result[0], result[1]) : firstknock(result[1], result[0]);
        // Rest of combat
        do {combat(result[0], result[1])} while(result[0].mana > 0 && result[1].mana > 0);

        result.forEach((player)=> {
          if(player.mana > 0){
            vencedores.push(player);
          }else {
            perdedores.push(player);
          }
        })
        if(vencedores.length == 0){
          vencedores.push(perdedores[0]);
        }        
        vencedores.forEach((vencedor)=> {
          let vencedorId = vencedor._id;
          const standingAumen = (x) => {
            if(x.standing > 0)
              x.standing ++;
            else{
              x.standing;
            }
            return x.standing;
          }
          const levelPlus = (x) => {
            if(x.standing > 68) 
              x.level = "black"
            else if(x.standing > 58)
              x.level = "brown"
            else if(x.standing > 48)
              x.level = "green"
            else if(x.standing > 38)
              x.level = "blue"
            else if(x.standing > 28)
              x.level = "red"
            else if(x.standing > 18)
              x.level = "orange"
            else if(x.standing > 8)
              x.level = "yellow"
            else{
              x.level = "white"
            }
            return x.level;
          }

          Karateka.findByIdAndUpdate(vencedorId, {level: levelPlus(vencedor), standing: standingAumen(vencedor)})
          })
        res.render('classes/tourney/final', {vencedores});
      })
})

app.post('/classes/tourney/final', (req, res, next) => {
  Karateka.find({})
  .then((result)=>{
    console.log(result);
    result.forEach((aspirant)=>{
      if(aspirant.standing > 29){
        const genre = aspirant.genre;

        const masterName = () => aspirant.name;
        const masterGenre = () => genre;
        const masterSolvency = () => aspirant.solvency;
        const masterNature = () => aspirant.nature;
        const masterLevel = () => aspirant.level;
        const masterStrength = () => aspirant.strength;
        const masterDexterity = () => aspirant.dexterity;
        const masterStamina = () => aspirant.stamina;
        const masterMana = () => aspirant.mana;
        const masterStanding = () => aspirant.standing;
        const masterImageUrl = (genre) => {
          if(genre == 'male'){
            const maleUrlList = ['/images/male1.jpg', '/images/male2.jpg', '/images/male3.jpg', '/images/male4.jpg']
            return maleUrlList[Math.round(Math.random() * (maleUrlList.length))];
          }else {
            const femaleUrlList = ['/images/female1.jpg', '/images/female2.jpg', '/images/female3.jpg', '/images/female4.jpg']
            return femaleUrlList[Math.round(Math.random() * (femaleUrlList.length))];
          }
        }
        
        const newMaster = new Master({
          name: masterName(),
          genre: masterGenre(),
          solvency: masterSolvency(),
          nature: masterNature(),
          level: masterLevel(),
          strength: masterStrength(),
          dexterity: masterDexterity(),
          stamina: masterStamina(),
          mana: masterMana(),
          standing: masterStanding(),
          imageUrl: masterImageUrl(genre)
        })
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
            if(genre == 'male'){
              return '/images/male.jpg';
            }else {
              return '/images/female.jpg';
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

        Master.create(newMaster);
        Master.findOneAndDelete({standing: {$lte: 80}})
        Karateka.findByIdAndDelete(aspirant._id);        
        Civilian.create(randomCivilian())
      }else if(aspirant.standing > 19){
        Karateka.findByIdAndUpdate(aspirant._id, {level: 'orange'})      
      }else if(aspirant.standing > 9){
        Karateka.findByIdAndUpdate(aspirant._id, {level: 'yellow'})
      }
    })
    res.redirect('../');
  })
  .catch((err)=> {
    console.log(err);
    res.send(err);
  })
});

// CITY

app.get('/city', (req, res, next) => {
  
  Civilian.countDocuments()
    .then((count) => {
      console.log(`There are ${count} debs`)
      res.render('city', {count});
    })
});

app.post('/city', (req, res, next) => {
  User.findOne({email: req.session.currentUser})
    .then((user) => {
      Karateka.find({owner: user._id})
        .then((result)=>{
          if(result.length < 16){
            const civId = req.params;
            const civilian = Civilian
              .findOne(civId)
              .then((civilian)=>{
                console.log(civilian);
          
                const trainee = () => {
          
                  const karatekaName = () => {
                    return civilian.name;
                  }
                  const karatekaGenre = () => {
                    return civilian.genre;
                  }
                  const karatekaSolvency = () => {
                    return civilian.solvency;
                  }
                  const karatekaNature = () => {
                    return civilian.nature;
                  }
                  const karatekaImageUrl = () => {
                    return civilian.imageUrl;
                  }
          
                    const newKarateka = new Karateka({
                    name: karatekaName(),
                    genre: karatekaGenre(),
                    solvency: karatekaSolvency(),
                    nature: karatekaNature(),
                    level: 'white',
                    strength: 1,
                    dexterity: 1,
                    stamina: 1,
                    mana: 1,
                    standing: 0,
                    imageUrl: karatekaImageUrl(),
                    owner: user._id
                  })
                  return newKarateka;
                }
          
                Karateka.create(trainee())
                  .then((trainee) => {
                    User.updateOne({email: req.session.currentUser}, {$push: {karatekas: trainee._id}})
                      .then(()=> {
                        Civilian.deleteOne(civId)
                          .then(() => {
                            res.redirect('/city');
                          })
                          .catch((err)=>{
                            console.log(err);
                            res.send("Error al borrar al antiguo ciudadano");
                          })
                      })
                  })
                  .catch((err) => {
                    console.log(err);
                    res.send("Error creando al nuevo alumno");
                  })
              })
              .catch((err)=> {
                console.log(err);
                res.send("Error buscando al ciudadano");
              });
          }else{
            res.render('city', {errorMessage: 'Solo se permiten 16 alumnos'});
          }
        })
    })
})

// FIGHT

app.get('/fight', (req, res, next) => {
  User.findOne({email: req.session.currentUser})
    .then((user) => {
      Sensei.find({owner: user._id})
        .then((player) => {
          Master.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1})
            .then((masters) => {
              Sensei.find({owner: {$ne: user._id}}, {name: 1, imageUrl: 1, level: 1, standing: 1})
                .then((senseis) => {
                  res.render('fight', {player, masters, senseis});
                })
                .catch((err) => {
                  console.log(err);
                })
            })
            .catch((err)=> {
              console.log(err);
            })
        })
        .catch((err)=> {
          console.log(err);
        })
    })
});

app.post('/fight', (req, res, next) => {
  const findPlayer = () => Sensei.findById(req.body._id[0]);  
  const findFighter = () => Sensei.findById(req.body._id[1]);
  Promise.all([findPlayer(), findFighter()])
    .then((result) => {
      const firstStrike = (aggressor, defensor) => {
        let aggNumberOfDices = aggressor.dexterity + aggressor.strength;
        let aggDiceRoll = aggNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
        let defNumberOfDices = defensor.dexterity + defensor.stamina;
        let defDiceRoll = defNumberOfDices * Math.floor(Math.random() * (11-2)) + 1;
        aggDiceRoll < defDiceRoll ?  defensor.mana  : defensor.mana -= 1;
      };

      const strikes = (fighter1, fighter2) => {
        let fighter1Luky = fighter1.dexterity * Math.floor(Math.random() * (11-2)) + 1;
        let fighter2Luky = fighter2.dexterity * Math.floor(Math.random() * (11-2)) + 1;
        fighter1Luky > fighter2Luky ? firstStrike(fighter1, fighter2) : firstStrike(fighter2, fighter1);
      };

      let winner = [];
      let loser = [];

      // The most aggressive strikes first
      result[0].nature == 'wroth' ? firstStrike(result[0], result[1]) : firstStrike(result[1], result[0]);

      // Rest of combat
      do {strikes(result[0], result[1])} while(result[0].mana > 0 && result[1].mana > 0);

      // Check Winner
        result.forEach((opp)=> {
          if(opp.mana > 0 ){
            winner.push(opp);
          }else {
            loser.push(opp);
          }
        })
        loser.forEach((opp)=>{
          let oppId = opp._id;
          const standingMinus = (opp) => {
            if(opp.standing > 7)
              opp.standing--;
            else{
              opp.standing;
            }
            return opp.standing;
          }
          Sensei.findByIdAndUpdate(oppId, {standing : standingMinus(opp)})
            .then(()=>{
              winner.forEach((opp)=>{
                let oppWId = opp._id;
                const standingPlus = (opp) => {
                  if(opp.standing > 0)
                    opp.standing ++;
                  else{
                    opp.standing;
                  }
                  return opp.standing;
                }
                const levelPlus = (x) => {
                  if(x.standing > 68) 
                    x.level = "black"
                  else if(x.standing > 58)
                    x.level = "brown"
                  else if(x.standing > 48)
                    x.level = "green"
                  else if(x.standing > 38)
                    x.level = "blue"
                  else if(x.standing > 28)
                    x.level = "red"
                  else if(x.standing > 18)
                    x.level = "orange"
                  else if(x.standing > 8)
                    x.level = "yellow"
                  else{
                    x.level = "white"
                  }
                  return x.level;
                }
                
                Sensei.findByIdAndUpdate(oppWId, {standing: standingPlus(opp), level: levelPlus(opp)})
                  .then(()=> {
                    // Hide BattleBtn and Choose Opponents
                    let hide = "display: none"; 
                    // Render Winner
                    res.render('fight', {winner, hide});
                  })
              })
          })
        })
      
    })
    .catch((err)=> {
      console.log(err);
      res.send("Error al renderizar la pelea")
    })
})

app.get('/ranking', (req, res, next) => {
  Sensei.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1, owner: 1}).sort({standing: -1,level: -1})
    .populate('owner')
    .then((dbSensei) => {
      res.render('ranking', {sensei: dbSensei});
    })
})



// ADMIN

app.use((req, res, next) => {
  if(req.session.currentUser == 'victor.izquierdo1985@gmail.com'){
    next();
  } else {
    res.redirect('/log-in');
  }
})

app.get('/admin', (req, res, next) => {

  Civilian.countDocuments()
    .then((civilians) => {
      Karateka.countDocuments()
        .then((karatekas) => {
          Master.countDocuments()
            .then((masters) => {
              Sensei.find({}, {name: 1, level: 1, standing: 1, imageUrl: 1})
                .then((senseis) => {
                  console.log(senseis)
                  res.render('admin', {civilians, karatekas, masters, senseis});
                })
            })
        })
    })
});

app.get('/admin/civilians', (req, res, next) => {
  Civilian.countDocuments()
      .then((civiliansNumber)=>{
        Civilian.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1})
          .then((civilians) => {
            res.render('admin/civilians', {civiliansNumber, civilians});
          })
          .catch((err)=> {
            console.log(err);
          })
          .catch((err) => {
            console.log(err);
            res.send('Error al renderizar los ciudadanos');
          })
      })
      .catch((err) => {
        console.log(err);
      })
});

app.post('/admin/civilians', (req, res, next) => {
  
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
      if(genre == 'male'){
        return '/images/male.jpg';
      }else {
        return '/images/female.jpg';
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
  
  Civilian.create(randomCivilian())
  .then(() => {
    res.redirect('civilians');
  })
  .catch((err) => {
    console.log(err);
  })
});

app.get('/admin/civilians/:id', (req, res, next) => {
  const civilianId = req.params.id;
  Civilian.findById(civilianId)
    .then((result) => {
      res.render('admin/civilians/civilian', result);
    })
    .catch((err) => {
      console.log(err);
      res.send('Error al renderizar ciudadano');
    })
})

app.post('/admin/civilians/:id', (req, res, next) => {
  const civilianId = req.params.id;
  const editedCivilian = req.body;
  Civilian.findByIdAndUpdate(civilianId, editedCivilian)
    .then(()=> {
      res.redirect(`../civilians/${civilianId}`);
    })
    .catch((err)=> {
      res.send(err);
    })
})

app.get('/admin/civilians/delete/:id', (req, res, next) => {
  const civilianId = req.params.id;
  Civilian.findByIdAndDelete(civilianId)
    .then(() => {
      res.redirect('../');
    })
    .catch((err) => {
      console.log(err);
      res.send('Error al eliminar ciudadano');
    })
})

app.get('/admin/karatekas', (req, res, next) => {
  Karateka.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1})
    .then((karatekas) => {
      res.render('admin/karatekas', {karatekas});
    })
    .catch((err)=> {
      console.log(err);
    })
    .catch((err) => {
      console.log(err);
      res.send('Error al renderizar los alumnos');
    })
})

app.get('/admin/karatekas/:id', (req, res, next) => {
  const karatekaId = req.params.id;
  Karateka.findById(karatekaId)
    .then((result) => {
      res.render('admin/karatekas/karateka', result);
    })
    .catch((err) => {
      res.send('Error al renderizar karateka');
    })
})

app.post('/admin/karatekas/:id', (req, res, next) => {
  const karatekaId = req.params.id;
  const editedKaraketa = req.body;
  Karateka.findByIdAndUpdate(karatekaId, editedKaraketa)
    .then(() => {
      res.redirect(`../karatekas/${karatekaId}`);
    })
    .catch((err) => {
      res.send(err);
    })
})

app.get('admin/karatekas/delete/:id', (req, res, next) => {
  const karatekaId = req.params.id;
  Karateka.findByIdAndDelete(karatekaId)
    .then(() => {
      res.redirect('../');
    })
    .catch((err) => {
      console.log(err);
      res.send("Error al eliminar Karateka");
    })
})

app.get('/admin/masters', (req, res, next) => {
  Master.countDocuments()
    .then((mastersNumber) => {
      Master.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1})
       .then((masters) => {
         res.render('admin/masters', {masters, mastersNumber});
       })
       .catch((err) => {
         console.log(err);
         res.send('Error al renderizar los maestros');
       })
    })
});

app.post('/admin/masters', (req, res, next) => {
  
  // MASTER GENERATOR

  const randomMaster = () =>{
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

    
    const randomLevel = () => {
      const levelList = ['red', 'blue', 'green', 'brown', 'black'];
      return levelList[Math.round(Math.random() * (levelList.length))];
    }
    const randomSkill = () => {
      return Math.ceil(Math.random() * 5);
    }
    const randomMana = () => {
      return Math.ceil(Math.random() * 10);
    }
    const randomStanding = () => {
      return Math.floor(Math.random() * (81 - 30 ) + 30);
    }
    
    const randomUrl = (genre) => {
      if(genre == 'male'){
        const maleUrlList = ['/images/male1.jpg', '/images/male2.jpg', '/images/male3.jpg', '/images/male4.jpg']
        return maleUrlList[Math.round(Math.random() * (maleUrlList.length))];
      }else {
        const femaleUrlList = ['/images/female1.jpg', '/images/female2.jpg', '/images/female3.jpg', '/images/female4.jpg']
        return femaleUrlList[Math.round(Math.random() * (femaleUrlList.length))];
      }
    }

    const newMaster = new Master({
      name: randomName(genreResult),
      genre: genreResult,
      solvency: randomSolvency(),
      nature: randomNature(),
      level: randomLevel(),
      strength: randomSkill(),
      dexterity: randomSkill(),
      stamina: randomSkill(),
      mana: randomMana(),
      standing: randomStanding(),
      imageUrl: randomUrl(genreResult)
    })
    return newMaster;
  }
  
  Master.create(randomMaster())
  .then((result) => {
    res.redirect('masters');
  })
  .catch((err) => {
    console.log(err);
  })
});
// -- END ROUTES --

// LISTENER
app.listen(process.env.PORT, () => {
  const PORT = process.env.PORT;
  console.log(chalk.green.inverse.bold(`Connected to port: ${PORT}`));
})