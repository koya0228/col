'use strict';

let ansColor = '';
let userLatestAns = '';

let answerCount = 0;
let inputCount = 0;

const $ = (selector) => { return document.querySelectorAll(selector) };

function getRandomColor() {
  return Math.random().toString(16).slice(-6).toUpperCase();
}

function colorReset() {
  ansColor = getRandomColor();  
  $('.color_display')[0].style.backgroundColor = `#${ansColor}`;

  const brightness = 
    (parseInt(ansColor.substr(0, 2), 16) * 0.299) +
    (parseInt(ansColor.substr(2, 2), 16) * 0.587) +
    (parseInt(ansColor.substr(4, 2), 16) * 0.114);
  const color = brightness >= 140 ? '000000' : 'FFFFFF';
  $('.color_display')[0].style.color = `#${color}`;
}

function allReset() {
  ansColor = '';
  userLatestAns = '';

  answerCount = 0;
  inputCount = 0;
  
  colorReset();
  $('.color_display')[0].innerText = '';
  
  const ansInputCellList = $('.ans_input_cell');
  ansInputCellList.forEach((ansinputCell) => {
    ansinputCell.innerText = '';
    ansinputCell.dataset.check = '';
  });
  const ansColorDisplayList = $('.ans_color_display');
  ansColorDisplayList.forEach((ansColorDisplay) => {
    ansColorDisplay.style.backgroundColor = '';
  });
  const keyboardCellList = $('.keyboard_cell');
  keyboardCellList.forEach((keyboardCell) => {
    keyboardCell.dataset.check = '';
  });
  $('.keyboard_cell').forEach((keyboardCell) => {
    keyboardCell.style.borderColor = '';
  });
}

function getSameCharIndex(char, original) {
  const sameCharIndex = [];
  original.filter((v, i) => {
    if(char === v) sameCharIndex.push(i);
  });
  return sameCharIndex;
}

function displayCheckResult(checkResultList) {
  for(let i=0; i<6; i++) {
    const cell = $('.ans_input')[answerCount].querySelectorAll('.ans_input_cell')[i];
    if(checkResultList[i] === 2) {
      cell.dataset.check = 'correct';
    }
    else if(checkResultList[i] === 1) {
      cell.dataset.check = 'nearly';
    }
    else {
      cell.dataset.check = 'unuse';
    }

    const userAnsChar = userLatestAns[i];
    const userAnsKeyBoardCell = $(`.keyboard_cell[data-command="${userAnsChar}"]`)[0];
    if(checkResultList[i] === 2) {
      userAnsKeyBoardCell.dataset.check = 'correct';
    }
    else if(checkResultList[i] === 1) {
      if(userAnsKeyBoardCell.dataset.check != 'correct'){
        userAnsKeyBoardCell.dataset.check = 'nearly';
      }
    }
    else if(checkResultList[i] === -1) {
      if(!userAnsKeyBoardCell.dataset.check){
        userAnsKeyBoardCell.dataset.check = 'unuse';
      }
    }
  }
}

function checkAns() {
  const checkResultList = [-1, -1, -1, -1, -1, -1];
  let tempAnsColor = ansColor;

  if(userLatestAns === tempAnsColor) {
    displayCheckResult([2, 2, 2, 2, 2, 2]);
    return 1;
  }

  for(let i=0; i<6; i++) {
    if(userLatestAns[i] === tempAnsColor[i]) {
      checkResultList[i] = 2;
      tempAnsColor = tempAnsColor.slice(0, i) + 'Z' + tempAnsColor.slice(i+1, 6);
    }
  }

  for(let i=0; i<6; i++) {
    const sameCharIndexesInAns = getSameCharIndex(userLatestAns[i], tempAnsColor.split(''));
    const sameCharCountInAns = getSameCharIndex(userLatestAns[i], tempAnsColor.split('')).length;

    for(let j=0; j<sameCharCountInAns; j++) {
      const charIndex = sameCharIndexesInAns[j];
      if(checkResultList[i] != 2) {
        checkResultList[i] = 1;
        tempAnsColor = tempAnsColor.slice(0, charIndex) + 'Z' + tempAnsColor.slice(charIndex+1, 6);
        break;
      }
    }
  }

  displayCheckResult(checkResultList);

  return -1;
}

function printChar(char) {
  const inputCell = $('.ans_input')[answerCount].querySelectorAll('.ans_input_cell')[inputCount];
  inputCell.innerText = char;
}

function clickKeyboard(command) {  
  if(command === 'enter') {
    if(inputCount === 6) {
      const checkAnsResult = checkAns();
      if(checkAnsResult === 1) {
        $('.color_display')[0].innerText = `#${ansColor}`;
      }

      $('.ans_color_display')[answerCount].style.backgroundColor = `#${userLatestAns}`;
      userLatestAns = '';
      answerCount += 1;
      inputCount = 0;

      if(answerCount === 6) {
        $('.color_display')[0].innerText = `#${ansColor}`;
      }
    }
  }
  else if(command === 'delete') {
    if(inputCount > 0) {
      const inputCell = $('.ans_input')[answerCount].querySelectorAll('.ans_input_cell')[inputCount-1];
      inputCell.innerText = '';
      userLatestAns = userLatestAns.slice(0, -1);
      inputCount -= 1;
    }
  }
  else {
    if(inputCount < 6) {
      printChar(command);
      userLatestAns += command;
      inputCount += 1;
    }
  }

  $('.keyboard_cell').forEach((keyboardCell) => {
    keyboardCell.style.borderColor = '';
  });
  for(let i=0; i<userLatestAns.length; i++) {
    $(`.keyboard_cell[data-command="${userLatestAns[i]}"]`)[0].style.borderColor = 'var(--colorBlue)';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  colorReset();
  const keyboardCellList = $('.keyboard_cell');
  for(let i=0; i<keyboardCellList.length; i++) {
    keyboardCellList[i].addEventListener('click', (e) => {
      const keyboardCell = e.target;
      clickKeyboard(keyboardCell.dataset.command);
    });
  }

  const reloadButton = $('.color_reload')[0];
  reloadButton.addEventListener('click', () => {
    allReset();
  });
});

document.addEventListener('keydown', e => {
  if(e.code === 'Enter') {
    clickKeyboard('enter');
  }
  else if(e.code === 'Delete' || e.code === 'Backspace') {
    clickKeyboard('delete');
  }
  else if(
    e.code === 'Digit1' ||
    e.code === 'Digit2' ||
    e.code === 'Digit3' ||
    e.code === 'Digit4' ||
    e.code === 'Digit5' ||
    e.code === 'Digit6' ||
    e.code === 'Digit7' ||
    e.code === 'Digit8' ||
    e.code === 'Digit9' ||
    e.code === 'Digit0'
  ) {
    clickKeyboard(e.code.split('t')[1]);
  }
  else if(
    e.code === 'KeyA' ||
    e.code === 'KeyB' ||
    e.code === 'KeyC' ||
    e.code === 'KeyD' ||
    e.code === 'KeyE' ||
    e.code === 'KeyF'
  ) {
    clickKeyboard(e.code.split('y')[1]);
  }
});
