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
const Master = require('./models/Master.js');
const Sensei = require('./models/Sensei.js');
const { level } = require('chalk');
const { findOneAndUpdate } = require('./models/Civilian.js');
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

  Karateka.countDocuments()
    .then((trainees) => {
      Civilian.countDocuments()
        .then((debs) => {
          Master.countDocuments()
            .then((masters) => {
            res.render('main', {trainees, debs, masters});
            })
        })
    })
  
});

app.get('/classes', (req, res, next) => {
  Karateka.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1})
    .then((trainees) => {
      res.render('classes', {trainees});
    })
    .catch((err)=> {
      console.log(err);

    })
});

app.post('/train', (req, res, next) => {

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

    Karateka.find({}, {name: 1, imageUrl: 1, strength: 1, dexterity: 1, stamina: 1, _id: 1}).sort({strength: -1, dexterity: -1, stamina: -1})
      .then((trainees) => {
        trainees.forEach((trainee)=>{
          const id = trainee._id;
          const newStrength = trainee.strength += levelUpStrength(trainee);
          const newDexterity = trainee.dexterity += levelUpDexterity(trainee);
          const newStamina = trainee.stamina += levelUpStamina(trainee);
          Karateka.findByIdAndUpdate(id, {strength: newStrength, dexterity: newDexterity, stamina: newStamina})
        })
        res.render('train', {trainees})

      })
      .catch((err)=> {
        console.log(err);
      })
  });

app.get('/battle', (req, res, next) => {
  Karateka.find({}, {name: 1, imageUrl: 1, strength: 1, dexterity: 1, stamina: 1, level: 1, nature: 1, mana: 1, standing: 1, _id: 1}).sort({strength: -1, dexterity: -1, stamina: -1})
      .then((opponents) => {
        res.render('battle', ({opponents}))
      })
      .catch((err)=> {
        console.log(err);
      })
});

app.post('/battle/', (req, res, next) => {
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
                const standingPlus = (opp) => opp.standing + 1;
                Karateka.findByIdAndUpdate(oppWId, {standing: standingPlus(opp)})
                  .then(()=> {
                    // Hide BattleBtn and Choose Opponents
                    let hide = "display: none"; 
                    // Render Winner
                    res.render('battle', {winner, hide});
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

app.get('/tourney', (req, res, next) => {
  Karateka.find({}, {name: 1, imageUrl: 1, level: 1, mana: 1})
    .then((opponents) => {
      res.render('tourney', {opponents});
    })
    .catch((err)=> {
      console.log(err);

    });
});

app.post('/tourney', (req, res, next) => {
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
        let vencidos = [];

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
          }else {
            vencidos.push(player)
          }
        })
        
        vencidos.forEach((vencido)=>{
          let vencidoId = vencido._id;
          const standingReduc = (x) => x.standing > 7 ? x.standing - 1 : x.standing;
          Karateka.findByIdAndUpdate(vencidoId, {standing: standingReduc(vencido)})
        })
        vencedores.forEach((vencedor)=> {
          let vencedorId = vencedor._id;
          const standingAumen = (x) => x.standing < 10 ? x.standing + 1 : x.standing;
          Karateka.findByIdAndUpdate(vencedorId, {standing: standingAumen(vencedor)})
            .then(()=>{
            })
          })
        res.render('firstRound', {vencedores});
      })
})

app.post('/firstRound', (req, res, next) => {

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
        let vencidos = [];

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
          }else {
            vencidos.push(player)
          }
        })
        
        vencidos.forEach((vencido)=>{
          let vencidoId = vencido._id;
          const standingReduc = (x) => x.standing > 7 ? x.standing - 1 : x.standing;
          Karateka.findByIdAndUpdate(vencidoId, {standing: standingReduc(vencido)})
        })
        vencedores.forEach((vencedor)=> {
          let vencedorId = vencedor._id;
          const standingAumen = (x) => x.standing < 10 ? x.standing + 1 : x.standing;
          Karateka.findByIdAndUpdate(vencedorId, {standing: standingAumen(vencedor)})
            .then(()=>{
            })
          })
        res.render('secondRound', {vencedores});
      })
})

app.post('/secondRound', (req, res, next) => {

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
        let vencidos = [];

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
            vencidos.push(player)
          }
        })
        
        vencidos.forEach((vencido)=>{
          let vencidoId = vencido._id;
          const standingReduc = (x) => x.standing > 7 ? x.standing - 1 : x.standing;
          Karateka.findByIdAndUpdate(vencidoId, {standing: standingReduc(vencido)})
        })
        vencedores.forEach((vencedor)=> {
          let vencedorId = vencedor._id;
          const standingAumen = (x) => x.standing < 10 ? x.standing + 1 : x.standing;
          Karateka.findByIdAndUpdate(vencedorId, {standing: standingAumen(vencedor)})
            .then(()=>{
            })
          })
        res.render('semiFinal', {vencedores});
      })
})

app.post('/semiFinal', (req, res, next) => {

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
        let vencidos = [];

        // The most aggressive strikes first
        result[0].nature == 'wroth' ? firstknock(result[0], result[1]) : firstknock(result[1], result[0]);
        // Rest of combat
        do {combat(result[0], result[1])} while(result[0].mana > 0 && result[1].mana > 0);

        result.forEach((player)=> {
          if(player.mana > 0){
            vencedores.push(player);
          }else {
            vencidos.push(player)
          }
        })
        
        vencidos.forEach((vencido)=>{
          let vencidoId = vencido._id;
          const standingReduc = (x) => x.standing > 7 ? x.standing - 1 : x.standing;
          Karateka.findByIdAndUpdate(vencidoId, {standing: standingReduc(vencido)})
        })
        vencedores.forEach((vencedor)=> {
          let vencedorId = vencedor._id;
          const standingAumen = (x) => x.standing < 10 ? x.standing + 1 : x.standing;
          Karateka.findByIdAndUpdate(vencedorId, {standing: standingAumen(vencedor)})
            .then(()=>{
            })
          })
        res.render('final', {vencedores});
      })
})

app.get('/city', (req, res, next) => {
  
  // CIVILIAN GENERATOR
  /*
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
          standing: 5,
          imageUrl: karatekaImageUrl(),
        })
        return newKarateka;
      }

      Karateka.create(trainee())
        .then((trainee) => {
          console.log(trainee);
          Karateka.countDocuments()
            .then((count) => {
              console.log(`There are ${count} debs`)
              res.render('main', {count});
            })
        })
        .catch((err) => {
          console.log(err);
        })
        
      })
      .catch((err)=> {
        console.log(err);
      });
      Civilian.deleteOne(civId)
      .then((civilian)=>{
        console.log(civilian);
      })
      .catch((err)=>{
        console.log(err);
      })
})

app.get('/fight', (req, res, next) => {
  Master.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1})
    .then((masters) => {
      Sensei.find({}, {name: 1, imageUrl: 1, level: 1, standing: 1})
        .then((senseis) => {
          res.render('fight', {masters, senseis});
        })
    })
    .catch((err)=> {
      console.log(err);
    })
});

// LISTENER
app.listen(process.env.PORT, () => {
  const PORT = process.env.PORT;
  console.log(chalk.green.inverse.bold(`Connected to port: ${PORT}`));
})