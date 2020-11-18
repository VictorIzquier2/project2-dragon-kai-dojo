// Battle //

//Two opponents only
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

