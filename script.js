'use strict';

let board = document.querySelector('.board');
let virtualBoard = document.querySelector('.virtualBoard');
let clickCount = 0;

const handleClick = (e) => {
  if (!e.target.innerHTML && e.target.className === 'virtualGrid') {
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
  let chessArray = new Array(8).fill(new Array(8).fill(0));
  let virtualBoardHTML = chessArray
    .flat()
    .map((grid) => `<div class="virtualGrid"></div>`)
    .join('');
  virtualBoard.innerHTML = virtualBoardHTML;
};

createBoard();
initialChess();
virtualBoard.addEventListener('click', handleClick);
