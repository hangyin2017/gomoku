'use strict';

const board = document.querySelector('.board');
const chessBoard = document.querySelector('.chessBoard');
const btnNew = document.querySelector('.btn-new');
const btnSave = document.querySelector('.btn-save');
const btnResume = document.querySelector('.btn-resume');
const boardLen = 9;
const gridWidth = 100;
const chessRadius = 40;
const players = ['black', 'white'];
const gridPadding = gridWidth / 2 - chessRadius;

let stepCount = 0;
let me = 1;
let chessArr = [];

const createBoard = () => {
  const gridHTML = `<div class="grid"></div>`;
  let boardHTML = ``;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      boardHTML += gridHTML;
    }
  }
  board.innerHTML = boardHTML;
};

const renderChessBoard = () => {
  chessBoard.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let y = 0; y < boardLen; y++) {
    for (let x = 0; x < boardLen; x++) {
      if (chessArr[y][x] > 0) {
        fragment.appendChild(createChess(x, y));
      }
    }
  }
  chessBoard.appendChild(fragment);
};

const createChess = (x, y) => {
  if (x >= 0 && x < boardLen && y >= 0 && y < boardLen) {
    let chess = document.createElement('div');
    chess.classList = `chess chess-${chessArr[y][x]}`;
    chess.style.left = `${gridPadding + gridWidth * x}px`;
    chess.style.top = `${gridPadding + gridWidth * y}px`;
    return chess;
  }
};

const newGame = () => {
  // Generate an 9 * 9 array of all zero.
  chessArr = new Array(boardLen);
  stepCount = 0;
  me = 1;
  for (let i = 0; i < boardLen; i++) {
    chessArr[i] = new Array(boardLen).fill(0);
  }
  renderChessBoard();
};

const saveGame = () => {
  localStorage.setItem('chessArr', JSON.stringify(chessArr));
  localStorage.setItem('stepCount', stepCount);
  console.log(localStorage.chessArr);
};

const resumeGame = () => {
  const savedArray = localStorage.getItem('chessArr');
  const savedStepCOunt = localStorage.getItem('stepCount');
  if (savedArray) {
    chessArr = JSON.parse(savedArray);
    if (savedStepCOunt) stepCount = Number.parseInt(savedStepCOunt);
    me = !(stepCount % 2);
    renderChessBoard();
  } else newGame();
};

const step = (e) => {
  if (e.target.className === 'chessBoard') {
    const x = e.offsetX;
    const y = e.offsetY;
    const j = Math.floor(x / gridWidth);
    const i = Math.floor(y / gridWidth);
    if (!chessArr[i][j]) {
      stepCount++;
      chessArr[i][j] = me ? 1 : 2;
      chessBoard.appendChild(createChess(j, i));
      if (isWin(i, j)) {
        const winner = me ? players[0] : players[1];
        alert(`${winner} win!`);
        newGame();
        return;
      }
      me = !me;
    }
  }
};

const isWin = (i, j) => {
  const chess = chessArr[i][j];
  let count = 1;
  for (let n = 1; j + n < boardLen; n++) {
    if (chessArr[i][j + n] === chess) count++;
    else break;
  }
  for (let n = 1; j - n >= 0; n++) {
    if (chessArr[i][j - n] === chess) {
      count++;
    } else break;
  }
  if (count === 5) return true;

  count = 1;
  for (let n = 1; i + n < boardLen; n++) {
    if (chessArr[i + n][j] === chess) count++;
    else break;
  }
  for (let n = 1; i - n >= 0; n++) {
    if (chessArr[i - n][j] === chess) {
      count++;
    } else break;
  }
  if (count === 5) return true;

  count = 1;
  for (let n = 1; i + n < boardLen && j + n < boardLen; n++) {
    if (chessArr[i + n][j + n] === chess) count++;
    else break;
  }
  for (let n = 1; i - n >= 0 && j - n >= 0; n++) {
    if (chessArr[i - n][j - n] === chess) {
      count++;
    } else break;
  }
  if (count === 5) return true;

  count = 1;
  for (let n = 1; i - n >= 0 && j + n < boardLen; n++) {
    if (chessArr[i - n][j + n] === chess) count++;
    else break;
  }
  for (let n = 1; i + n < boardLen && j - n >= 0; n++) {
    if (chessArr[i + n][j - n] === chess) {
      count++;
    } else break;
  }
  if (count === 5) return true;

  return false;
};

chessBoard.addEventListener('click', step);
btnNew.addEventListener('click', newGame);
btnSave.addEventListener('click', saveGame);
btnResume.addEventListener('click', resumeGame);

createBoard();
newGame();
