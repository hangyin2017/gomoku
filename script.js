/**
 * A gomoku (五子棋) game without AI.
 * Can save and resume game.
 * @todo 1. History steps display
 *       2. Undo a step
 */

'use strict';

const container = document.querySelector('.container');
const board = document.querySelector('.board');
const chessBoard = document.querySelector('.chessBoard');
const btnNew = document.querySelector('.btn-new');
const btnSave = document.querySelector('.btn-save');
const btnResume = document.querySelector('.btn-resume');

/**
 * @const {number} boardLen - How many grids in a line.
 * @const {number} gridWidth - The width of a grid in px.
 * @const {number} chessRadius - The radius of a chess in px.
 * @const {string[]} players - The names of players.
 * @const {number} gridPadding - The padding of a grid.
 */
const boardLen = 9;
const gridWidth = 100;
const chessRadius = 40;
const players = ['black', 'white'];
const gridPadding = gridWidth / 2 - chessRadius;

/** @type {number} Count the number of steps. */
let stepCount = 0;

/** @type {boolean} Player1(me)'s turn = 1. Player2's turn = 0. */
let me = 1;

/** @type {number[]} A two dimension that stores the chess grids. Use an int value to represent each player. */
let chessArr = [];

/** @type {boolean} A flag that shows the game has finished. */
let isWin = 0;

/** Create a board. Every grid is a div. Could be replaced by canvas or a background img. */
const createBoard = () => {
  const gridHTML = `<div class="grid"></div>`;
  let boardHTML = ``;
  for (let i = 0; i < boardLen - 1; i++) {
    for (let j = 0; j < boardLen - 1; j++) {
      boardHTML += gridHTML;
    }
  }
  board.innerHTML = boardHTML;
};

/** Create chesses on the chessBoard. */
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

/**
 * Create a chess element.
 * @param {number} x - Horizon coordinate. Left is zero.
 * @param {number} y - Vertical coordinate. Top is zero.
 * @returns {Object} The chess div.
 */
const createChess = (x, y) => {
  if (x >= 0 && x < boardLen && y >= 0 && y < boardLen) {
    let chess = document.createElement('div');
    chess.classList = `chess chess-${chessArr[y][x]}`;
    chess.style.left = `${gridPadding + gridWidth * x}px`;
    chess.style.top = `${gridPadding + gridWidth * y}px`;
    return chess;
  }
};

/**
 * Start a new game.
 * @param {Object} [e] - An event.
 */
const newGame = (e) => {
  stepCount = 0;
  me = 1;
  isWin = 0;

  // If it's invoked by a click on the container after win,
  // remove click listener and stop propagation to child elements.
  container.removeEventListener('click', newGame, true);
  if (e) e.stopPropagation();

  // Generate an 9 * 9 array of all zero.
  chessArr = new Array(boardLen);
  for (let i = 0; i < boardLen; i++) {
    chessArr[i] = new Array(boardLen).fill(0);
  }
  renderChessBoard();
};

/** Save chessArr and stepCount to localStorage. */
const saveGame = () => {
  localStorage.setItem('chessArr', JSON.stringify(chessArr));
  localStorage.setItem('stepCount', stepCount);
};

/** Resume saved game from localStorage. Otherwise start a new game. */
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

/**
 * Handle click on chessBoard.
 * @param {Object} e - An event.
 */
const step = (e) => {
  // Ensure the click is on empty area on the chessBoard.
  if (e.target.className === 'chessBoard') {
    // Convert click coordinates to grid coordinates.
    const x = e.offsetX;
    const y = e.offsetY;
    const j = Math.floor(x / gridWidth);
    const i = Math.floor(y / gridWidth);

    // If there is no chess, create a new chess there.
    if (!chessArr[i][j]) {
      stepCount++;
      chessArr[i][j] = me ? 1 : 2;
      chessBoard.appendChild(createChess(j, i));

      // Prevent the event from triggering the container.
      e.stopPropagation();
      judge(i, j);
      me = !me;
    }
  }
};

/**
 * Judge if there are 5 chesses in a line around the input coordinate.
 * @param {number} i - Vertical coordinate.
 * @param {number} j - Horizon coordinate.
 */
const judge = (i, j) => {
  const chess = chessArr[i][j];
  if (!chess) return;

  // Horizon direction - .
  let count = 1;
  for (let n = 1; j + n < boardLen; n++) {
    if (chessArr[i][j + n] === chess) count++;
    else break;
  }
  for (let n = 1; j - n >= 0; n++) {
    if (chessArr[i][j - n] === chess) count++;
    else break;
  }
  if (count === 5) return winned();

  // Vertical direction | .
  count = 1;
  for (let n = 1; i + n < boardLen; n++) {
    if (chessArr[i + n][j] === chess) count++;
    else break;
  }
  for (let n = 1; i - n >= 0; n++) {
    if (chessArr[i - n][j] === chess) count++;
    else break;
  }
  if (count === 5) return winned();

  // Backslash direction \ .
  count = 1;
  for (let n = 1; i + n < boardLen && j + n < boardLen; n++) {
    if (chessArr[i + n][j + n] === chess) count++;
    else break;
  }
  for (let n = 1; i - n >= 0 && j - n >= 0; n++) {
    if (chessArr[i - n][j - n] === chess) count++;
    else break;
  }
  if (count === 5) return winned();

  // Slach direction / .
  count = 1;
  for (let n = 1; i - n >= 0 && j + n < boardLen; n++) {
    if (chessArr[i - n][j + n] === chess) count++;
    else break;
  }
  for (let n = 1; i + n < boardLen && j - n >= 0; n++) {
    if (chessArr[i + n][j - n] === chess) count++;
    else break;
  }
  if (count === 5) return winned();
};

/** Create an alert box and listen to a click to restart. */
const winned = () => {
  isWin = 1;
  const winner = me ? players[0] : players[1];
  const alertBox = document.createElement('div');
  alertBox.classList = 'alert';
  alertBox.innerHTML = `${winner} win!<br>Click anywhere to start a new game.`;

  // Start a new game if click anywhere on the container.
  // Also prevent children's click events from being triggered.
  container.addEventListener('click', newGame, true);
  chessBoard.appendChild(alertBox);
};

chessBoard.addEventListener('click', step);
btnNew.addEventListener('click', newGame);
btnSave.addEventListener('click', saveGame);
btnResume.addEventListener('click', resumeGame);

createBoard();
newGame();
