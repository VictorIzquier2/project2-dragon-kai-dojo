//// DOJO ////

// enable RECRUIT button
const masterCounter = document.querySelector('#master-counter');
let masterCounterNumber;
if(masterCounter){
  masterCounterNumber = parseInt(masterCounter.innerText);
  const recruitMasterBtn = document.querySelector('#master-recruit');
  const enableRecruitMasterBtn = (btn) => {
    if(masterCounterNumber < 1){
      btn.setAttribute('disabled', false);
    }
  }
  enableRecruitMasterBtn(recruitMasterBtn);
}

//// CLASSES ////

// BATTLE //

// 2 opponents only
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

// TOURNEY //

// 16 opponents only
let playersSelected = document.getElementsByClassName('entry').length;
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

// Enable START tourney button
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

// FIRST ROUND //

// 8 opponents only
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

// Enable SECOND ROUND button
const firstRoundBtn = document.querySelector('.btn-firstRound');
const enableFRBtn = () => {
  if(playersSelected < 8){
    firstRoundBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      firstRoundBtn.removeAttribute('disabled');
    }, 1000)
  }
}

// SECOND ROUND //

// 4 opponents only
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

// Enable SEMI FINAL button
const secondRoundBtn = document.querySelector('.btn-secondRound');
const enableSRBtn = () => {
  if(playersSRSelected < 4){
    secondRoundBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      secondRoundBtn.removeAttribute('disabled');
    }, 1000)
  }
}

// SEMIFINAL //

// 2 opponents only
let playersSFSelected = 2;
const countPlayersSFSelected = (checkbox) => {
  if(checkbox.checked == false){
    playersSFSelected--;
  }
  if(checkbox.checked == true && playersSFSelected < 2){
    playersSFSelected++;
  }else{
    checkbox.checked = false;
  }
  return playersSFSelected;
}

// Enable FINAL button
const semiFinalBtn = document.querySelector('.btn-semiFinal');
const enableSFBtn = () => {
  if(playersSelected < 2){
    semiFinalBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      semiFinalBtn.removeAttribute('disabled');
    }, 1000)
  }
}

//// CITY ////

// enable RECRUIT button
const civCounter = document.querySelector('#civ-counter');
let civCounterNumber;
if(civCounter){
  const civCounterNumber = parseInt(civCounter.innerText);
  const recruitCivBtn = document.querySelector('#civ-recruit');
  const enableRecruitCivBtn = (btn) => {
    if(civCounterNumber < 1){
      btn.setAttribute('disabled', false);
    }
  }
  enableRecruitCivBtn(recruitCivBtn);
}

// FIGHT //

// BATTLE //

// 1 opponents only
let fighterSelected = 0;
const countFighterSelected = (checkbox) => {
  if(checkbox.checked == false){
    fighterSelected--;
  }
  if(checkbox.checked == true && fighterSelected < 1){
    fighterSelected++;
  }else{
    checkbox.checked = false;
  }
  console.log('hizo click', fighterSelected)
  return fighterSelected;
}

// Enable START BATTLE BUTTON
const starFightBtn = document.querySelector('.btn-fight');
const enableFightBtn = () => {
  if(fighterSelected < 1){
    starFightBtn.setAttribute('disabled', false);
    setTimeout(()=>{
      starFightBtn.removeAttribute('disabled');
    }, 1000)
  }
}

// RANKING //
const ranking = document.querySelector('#ranking');
if(ranking){
  const rank = ranking.children;
  for(i = 0; i< rank.length; i++){
    let pos = i;
    rank[i].children[0].innerText = pos + 1;
  }
}