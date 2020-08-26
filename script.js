'use strict';

const board = document.querySelector('.board');
const chessBoard = document.querySelector('.chessBoard');
const btnNew = document.querySelector('.btn-new');
const btnSave = document.querySelector('.btn-save');
const btnResume = document.querySelector('.btn-resume');
let clickCount = 0;
let chessArray = [];

const step = (e) => {
  if (!e.target.innerHTML && e.target.className === 'chessGrid') {
    clickCount++;
    let chess = document.createElement('div');
    chess.classList.add('chess');
    clickCount % 2
      ? chess.classList.add('chess-black')
      : chess.classList.add('chess-white');
    e.target.appendChild(chess);
  }
};

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

const initialChess = () => {
  const savedArray = localStorage.getItem('chessArray');
  if (savedArray) {
    chessArray = JSON.parse(savedArray);
    renderChessBoard();
  } else newGame();
};

const renderChessBoard = () => {
  let chessBoardHTML = chessArray
    .flat()
    .map((grid) => {
      let chessClass = 'chess';
      if (grid === 0) return `<div class="chessGrid"></div>`;
      else if (grid === 1) chessClass += ' chess-black';
      else if (grid === 2) chessClass += ' chess-white';
      const chessHTML = `<div class='${chessClass}'></div>`;
      return `<div class="chessGrid">${chessHTML}</div>`;
    })
    .join('');
  chessBoard.innerHTML = chessBoardHTML;
};

const newGame = () => {
  // Generate an 9 * 9 array of all zero.
  chessArray = new Array(9).fill(new Array(9).fill(0));
  renderChessBoard();
};

const saveGame = () => {
  localStorage.setItem('chessArray', JSON.stringify(chessArray));
  console.log(localStorage.chessArray);
};

// const resumeGame = () => {
//   const savedArray = localStorage.getItem('chessArray');
//   if (savedArray) {
//     chessArray = JSON.parse(savedArray);
//     renderChessBoard();
//   }
// };

createBoard();
initialChess();
chessBoard.addEventListener('click', step);
btnNew.addEventListener('click', newGame);
btnSave.addEventListener('click', saveGame);
btnResume.addEventListener('click', initialChess);
