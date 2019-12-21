/*
This project has been made by: Kenji Avila, Yasmin Torres, and Vincent Tran
They may be collectively reached by the group representative, Vincent Tran, at tranvc1@csu.fullerton.edu
This javascript file contains the source code to run the Game of Life by a Turing Machine
It has been annotated to explain the different components of the code
More information regarding references and understanding of the project may be found in the README.txt
*/

var cellDisplay = document.querySelector("#cellDisplay");
var stateDisplay = document.querySelector("#stateDisplay");

var ctxC = cellDisplay.getContext("2d");
var ctxS = stateDisplay.getContext("2d");

//Tape variables
var tapeLength = 34;
var tapeCount = 19;
var tapeArray = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
]; //19 Arrays of Length 34
//Tracking variables
var headX = [16];
var headY = [1];
var state = [0];
var marks = [0];

//Functions used in GOLTM
function addMark() {
  marks[0] += 1;
}

function resetMark() {
  marks[0] = 0;
}

function zeroCondition() {
  if (
    tapeArray[headY[0]][headX[0]] == 0 ||
    tapeArray[headY[0]][headX[0]] == "$" ||
    tapeArray[headY[0]][headX[0]] == "0.O" ||
    tapeArray[headY[0]][headX[0]] == "0.X"
  ) {
    return true;
  } else return false;
}

function oneCondition() {
  if (
    tapeArray[headY[0]][headX[0]] == 1 ||
    tapeArray[headY[0]][headX[0]] == "1.O" ||
    tapeArray[headY[0]][headX[0]] == "1.X"
  ) {
    return true;
  } else return false;
}

//Create base of tape; Edges with $ == red; Inner cells with O == white transition
function generateTapeArray(tapeArray) {
  for (let j = 0; j < 19; j++) {
    tapeArray[j][0] = "$";
    tapeArray[j][tapeLength - 1] = "$";
  }
  for (let i = 1; i < tapeLength - 1; i++) {
    tapeArray[0][i] = "$";
    tapeArray[tapeCount - 1][i] = "$";
  }
}

//Randomly seed cells; Fill cell with 0 or 1 based on RNG
function seedTapeArray(tapeArray) {
  for (let i = 1; i < tapeCount - 1; i++) {
    for (let j = 1; j < tapeLength - 1; j++) {
      let fillRandom = Math.random();
      if (fillRandom < 0.5) {
        tapeArray[i][j] = 0;
      } else {
        tapeArray[i][j] = 1;
      }
    } //Inner loop
  } //Outer loop
}


//Draw entirety of tape; Implement conversions; Draw based on 0 or 1
function drawTapeArray(tapeArray) {
  for (let i = 0; i < 19; i++) {
    for (let j = 1; j < tapeLength - 1; j++) {
      if (tapeArray[i][j] == "O" ||tapeArray[i][j] == "0.O"|| tapeArray[i][j] == "1.O") tapeArray[i][j] = 0;
      if (tapeArray[i][j] == "X" || tapeArray[i][j] == "0.X" || tapeArray[i][j] == "1.X") tapeArray[i][j] = 1;
    }
  } //Convert O+subs or X+subs into 0 or 1;

  for (let i = 0; i < 19; i++) {
    for (let j = 0; j < tapeLength; j++) {
      ctxC.beginPath();
      ctxC.lineWidth = "2";
      ctxC.strokeStyle = "black";
      ctxC.rect(j * 10, i * 10, 10, 10);
      ctxC.stroke();

      if (tapeArray[i][j] == "$") {
        ctxC.fillStyle = "red";
        ctxC.fillRect(j * 10, i * 10, 10, 10);
      }

      if (
        tapeArray[i][j] == 0
      ) {
        ctxC.fillStyle = "white";
        ctxC.fillRect(j * 10, i * 10, 10, 10);
      }
      if (
        tapeArray[i][j] == 1 
      ) {
        ctxC.fillStyle = "black";
        ctxC.fillRect(j * 10, i * 10, 10, 10);
      }
    }
  }
}



//GOLTM
function GOLTM(tapeArray) {
  switch (state[0]) {
    case 0:
      while (tapeArray[headY][headX] != "$") {
        moveHeadLeft();
      }
        moveHeadRight();
        state[0] = 1;
      break;

    case 1:
      while (tapeArray[headY][headX] != "$") {
        moveHeadUp();
      }
        moveHeadDown();
        state[0] = 2;
      break;

    case 2:
      moveHeadLeft();
      state[0] = 3;
      break;

    case 3:
      if (zeroCondition()) {
        moveHeadRight();
        state[0] = 4;
      } else if (oneCondition()) {
        moveHeadRight();
        state[0] = 5;
      }
      break;

    case 4:
      moveHeadLeft();
      moveHeadUp();
      state[0] = 6;
      break;

    case 5:
      addMark();
      moveHeadLeft();
      moveHeadUp();
      state[0] = 6;
      break;

    case 6:
      if (zeroCondition()) {
        moveHeadRight();
        moveHeadDown();
        state[0] = 7;
      } else if (oneCondition()) {
        moveHeadRight();
        moveHeadDown();
        state[0] = 8;
      }
      break;

    case 7:
      moveHeadUp();
      state[0] = 9;
      break;

    case 8:
      addMark();
      moveHeadUp();
      state[0] = 9;
      break;

    case 9:
      if (zeroCondition()) {
        moveHeadDown();
        state[0] = 10;
      } else if (oneCondition()) {
        moveHeadDown();
        state[0] = 11;
      }
      break;

    case 10:
      moveHeadUp();
      moveHeadRight();
      state[0] = 12;
      break;

    case 11:
      addMark();
      moveHeadUp();
      moveHeadRight();
      state[0] = 12;
      break;

    case 12:
      if (zeroCondition()) {
        moveHeadDown();
        moveHeadLeft();
        state[0] = 13;
      } else if (oneCondition()) {
        moveHeadDown();
        moveHeadLeft();
        state[0] = 14;
      }
      break;

    case 13:
      moveHeadRight();
      state[0] = 15;
      break;

    case 14:
      addMark();
      moveHeadRight();
      state[0] = 15;
      break;

    case 15:
      if (zeroCondition()) {
        moveHeadLeft();
        state[0] = 16;
      } else if (oneCondition()) {
        moveHeadLeft();
        state[0] = 17;
      }
      break;

    case 16:
      moveHeadDown();
      moveHeadRight();
      state[0] = 18;
      break;

    case 17:
      addMark();
      moveHeadDown();
      moveHeadRight();
      state[0] = 18;
      break;

    case 18:
      if (zeroCondition()) {
        moveHeadUp();
        moveHeadLeft();
        state[0] = 19;
      } else if (oneCondition()) {
        moveHeadUp();
        moveHeadLeft();
        state[0] = 20;
      }
      break;

    case 19:
      moveHeadDown();
      state[0] = 21;
      break;

    case 20:
      addMark();
      moveHeadDown();
      state[0] = 21;
      break;

    case 21:
      if (zeroCondition()) {
        moveHeadUp();
        state[0] = 22;
      } else if (oneCondition()) {
        moveHeadUp();
        state[0] = 23;
      }
      break;

    case 22:
      moveHeadDown();
      moveHeadLeft();
      state[0] = 24;
      break;

    case 23:
      addMark();
      moveHeadDown();
      moveHeadLeft();
      state[0] = 24;
      break;

    case 24:
      if (zeroCondition()) {
        moveHeadUp();
        moveHeadRight();
        state[0] = 25;
      } else if (oneCondition()) {
        moveHeadUp();
        moveHeadRight();
        state[0] = 26;
      }
      break;

    case 25:
      state[0] = 27;
      break;

    case 26:
      addMark();
      state[0] = 27;
      break;

    case 27:
      if (zeroCondition()) {
        state[0] = 28;
      }else if (oneCondition()) {
        state[0] = 29;
      }
      break;

    case 28:
      if (marks[0] == 3) {
        tapeArray[headY][headX] = "0.X";
      } else {
        tapeArray[headY][headX] = "0.O";
      }
      resetMark();
      moveHeadRight();
      state[0] = 30;
      break;

    case 29:
      if (marks[0] == 2 || marks[0] == 3) {
        tapeArray[headY][headX] = "1.X";
      } else {
        tapeArray[headY][headX] = "1.O";
      }
      resetMark();
      moveHeadRight();
      state[0] = 30;
      break;

    //Work from here
    case 30:
      if (tapeArray[headY][headX] != "$") {
        state[0] = 2;
      } else if (tapeArray[headY][headX] == "$") {
        moveHeadDown();
        moveHeadLeft();
        state[0] = 31;
      }
      break;

    case 31:
      if (tapeArray[headY][headX] != "$") {
        while(tapeArray[headY][headX]!="$"){
          moveHeadLeft();
        }
        moveHeadRight();
        state[0]=2;
      }
      else if (tapeArray[headY][headX] == "$") {
        drawTapeArray(tapeArray);
        moveHeadUp();
        state[0] = 0;
      }
  } //End of Switch
}

//Tape Head Movement
function drawHead() {
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "red";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();
}

function moveHeadLeft() {
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "black";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();

  headX[0] -= 1;
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "red";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();
}

function moveHeadRight() {
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "black";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();

  headX[0] += 1;
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "red";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();
}

function moveHeadUp() {
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "black";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();

  headY[0] -= 1;
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "red";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();
}

function moveHeadDown() {
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "black";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();

  headY[0] += 1;
  ctxC.beginPath();
  ctxC.lineWidth = "2";
  ctxC.strokeStyle = "red";
  ctxC.rect(headX * 10, headY * 10, 10, 10);
  ctxC.stroke();
}

//TM States
let textCount = 0;
let textWidthGap = 40;
let textHeightGap = 50;
let stateX;
let stateY;
ctxS.font = "20px Arial";

//Create GLTOM State Display
function drawTM(){

  //States
  for(let i = 0; i <4; i++){
    for(let j = 0; j<8; j++){
      ctxS.fillText(textCount, 10+textWidthGap*j, 30+textHeightGap*i)
      textCount++;
    }
  }

  //Grid lines
  for(let i = 0; i<8; i++){
    for(let j = 0; j<4; j++){
      ctxS.beginPath();
      ctxS.lineWidth = "2";
      ctxS.strokeStyle = "black";
      ctxS.rect(40*i, 50*j, 40, 50);
      ctxS.stroke();
    }
  }

  //Initial State
  ctxS.beginPath();
  ctxS.lineWidth="2";
  ctxS.strokeStyle = "red";
  ctxS.rect(0, 0, 40, 50);
  ctxS.stroke();

  stateX = 0;
  stateY = 0;
}

function changeState(state){
  ctxS.beginPath();
  ctxS.lineWidth = "2";
  ctxS.strokeStyle = "black";
  ctxS.rect(stateX, stateY, 40, 50);
  ctxS.stroke();

  switch(state){
    case 0:
        StateX = 0;
        StateY = 0; 
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 1:
        stateX = 40;
        stateY = 0;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 2:
        stateX = 80;
        stateY = 0;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 3:
        stateX = 120;
        stateY = 0;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 4:
        stateX = 160;
        stateY = 0;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 5:
        stateX = 200;
        stateY = 0;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 6:
        stateX = 240;
        stateY = 0;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 7:
        stateX = 280;
        stateY = 0;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 8:
        stateX = 0;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 9:
        stateX = 40;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 10:
        stateX = 80;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 11:
        stateX = 120;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 12:
        stateX = 160;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 13:
        stateX = 200;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 14:
        stateX = 240;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 15:
        stateX = 280;
        stateY = 50;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 16:
        stateX = 0;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 17:
        stateX = 40;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 18:
        stateX = 80;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 19:
        stateX = 120;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 20:
        stateX = 160;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 21:
        stateX = 200;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 22:
        stateX = 240;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 23:
        stateX = 280;
        stateY = 100;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 24:
        stateX = 0;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 25:
        stateX = 40;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 26:
        stateX = 80;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 27:
        stateX = 120;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 28:
        stateX = 160;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 29:
        stateX = 200;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 30:
        stateX = 240;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;

        case 31:
        stateX = 280;
        stateY = 150;
        ctxS.beginPath();
        ctxS.lineWidth = "2";
        ctxS.strokeStyle = "red";
        ctxS.rect(stateX, stateY, 40, 50);
        ctxS.stroke();
        break;
  }
}

function runChangeState(){
  changeState(state[0]);
}

//Variables for amount of iterations & Display Functions
var fullChoice = 1000;
var stepChoice = 100000;//10901 iterations provide one full generation
var animRateFull = 500;
var animRateIncFull = 500;
var animRateStep = 500;
var animRateIncStep = 5;

function runFullGeneration(){
  for(let i = 0; i<10901; i++){
    GOLTM(tapeArray);
  }
}

function runGeneration(){
  GOLTM(tapeArray);
}

function runFull(){
for(let j = 0; j<fullChoice; j++){
  window.setTimeout(runFullGeneration, animRateFull);
  window.setTimeout(runChangeState, animRateFull);
  animRateFull += animRateIncFull;
}
}

function runStep(){
  for(let j =0; j< stepChoice; j++){
    window.setTimeout(runGeneration, animRateStep);
    window.setTimeout(runChangeState, animRateStep);
    animRateStep += animRateIncStep;
  }
}

generateTapeArray(tapeArray);
seedTapeArray(tapeArray);
drawTapeArray(tapeArray);
drawHead();
drawTM();
