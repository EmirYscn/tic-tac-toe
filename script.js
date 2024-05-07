function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const printBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        console.log("\n");
        console.log(board[i][j].getValue());
      }
    }
  };
  const addToBoard = (row, column, player) => {
    board[row][column].addMark(player);
  };
  return { board, addToBoard, printBoard, getBoard };
}
function Cell() {
  let value = "";
  const addMark = (player) => {
    value = player;
  };
  const getValue = () => value;

  return { addMark, getValue };
}
function Player(name, mark) {
  const playerName = name;
  const playerMark = mark;

  const getMark = () => playerMark;
  const getName = () => playerName;

  return { getMark, getName };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const player1 = Player(playerOneName, "X");
  const player2 = Player(playerTwoName, "O");
  const board = GameBoard();

  const players = [player1, player2];
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  const toggleActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playRound = function (row, column) {
    board.addToBoard(row, column, activePlayer.getMark());
  };

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
    toggleActivePlayer,
  };
}

function ScreenController() {
  const boardDiv = document.querySelector(".board");
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest board and active player
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.getName()}'s turn..`;

    // display latest board
    board.forEach((row, index) => {
      let rowIndex = index;
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    game.playRound(selectedRow, selectedColumn);
    game.toggleActivePlayer();
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();
}
ScreenController();
