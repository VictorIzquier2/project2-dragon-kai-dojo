// Battle //

//TWO opponents only
let oppSelected = 0;
const countOppSelected = (checkbox) => {
  if(checkbox.checked == false){
    oppSelected--;
  }
  if(checkbox.checked == true && oppSelected < 2){
    oppSelected++;
  }else{
    checkbox.checked = false;
  }
  return oppSelected;
}

// Enable START BATTLE BUTTON
const starBattleBtn = document.querySelector('.btn-battle');
const enableBtn = () => {
  if(oppSelected < 2){
    starBattleBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      starBattleBtn.removeAttribute('disabled');
    }, 1000)
  }
}

// TOURNEY
//TWO opponents only
let playersSelected = 16;
const countPlayersSelected = (checkbox) => {
  if(checkbox.checked == false){
    playersSelected--;
  }
  if(checkbox.checked == true && playersSelected < 16){
    playersSelected++;
  }else{
    checkbox.checked = false;
  }
  return playersSelected;
}

// Enable START TOURNEY BUTTON
const starTourneyBtn = document.querySelector('.btn-tourney');
const tourneyWarn = document.querySelector('.warn');
const enableTBtn = () => {
  if(playersSelected < 16){
    starTourneyBtn.setAttribute('disabled', false);
    tourneyWarn.style.display = 'inline';
    setTimeout(()=>{
      starTourneyBtn.removeAttribute('disabled');
      tourneyWarn.style.display = 'none';
    }, 1000)
  }
}

// FIRST ROUND
let playersFRSelected = 8;
const countPlayersFRSelected = (checkbox) => {
  if(checkbox.checked == false){
    playersFRSelected--;
  }
  if(checkbox.checked == true && playersFRSelected < 8){
    playersFRSelected++;
  }else{
    checkbox.checked = false;
  }
  return playersFRSelected;
}

// Enable START TOURNEY BUTTON
const firstRoundBtn = document.querySelector('.btn-firstRound');
const enableFRBtn = () => {
  if(playersSelected < 8){
    firstRoundBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      firstRoundBtn.removeAttribute('disabled');
    }, 1000)
  }
}

// SECOND ROUND
let playersSRSelected = 4;
const countPlayersSRSelected = (checkbox) => {
  if(checkbox.checked == false){
    playersSRSelected--;
  }
  if(checkbox.checked == true && playersSRSelected < 4){
    playersSRSelected++;
  }else{
    checkbox.checked = false;
  }
  return playersSRSelected;
}

// Enable START TOURNEY BUTTON
const secondRoundBtn = document.querySelector('.btn-secondRound');
const enableSRBtn = () => {
  if(playersSelected < 8){
    secondRoundBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      secondRoundBtn.removeAttribute('disabled');
    }, 1000)
  }
}

// SEMIFINAL
let playersSFSelected = 4;
const countPlayersSFSelected = (checkbox) => {
  if(checkbox.checked == false){
    playersSFSelected--;
  }
  if(checkbox.checked == true && playersSFSelected < 4){
    playersSFSelected++;
  }else{
    checkbox.checked = false;
  }
  return playersSFSelected;
}

// Enable START TOURNEY BUTTON
const semiFinalBtn = document.querySelector('.btn-semiFinal');
const enableSFBtn = () => {
  if(playersSelected < 4){
    semiFinalBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      semiFinalBtn.removeAttribute('disabled');
    }, 1000)
  }
}


