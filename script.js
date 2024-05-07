const playerWonModal = document.querySelector(".modal");
const modalText = document.querySelector(".modal-text");
const playAgainBtn = document.querySelector(".play-again-btn");

function GameBoard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const addToBoard = (row, column, player) => {
    board[row][column].addMark(player);
  };

  const resetBoard = () => {
    board = [];
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  const isBoardFull = () => {
    let isFull = true;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (board[i][j].getValue() === "") {
          isFull = false;
        }
      }
    }
    return isFull;
  };

  const isBoardCellEmpty = function (row, column) {
    if (
      board[row][column].getValue() === "X" ||
      board[row][column].getValue() === "O"
    ) {
      return false;
    } else {
      return true;
    }
  };
  return {
    board,
    addToBoard,
    getBoard,
    isBoardCellEmpty,
    resetBoard,
    isBoardFull,
  };
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
    // check to prevent override of marks
    if (!board.isBoardCellEmpty(row, column)) {
      return;
    } else {
      // add mark to board
      board.addToBoard(row, column, activePlayer.getMark());
      // check if anyone won
      if (checkWin(activePlayer, board.getBoard())) {
        // Change modals text to announce the winner
        modalText.textContent = `${activePlayer.getName()} won!`;
        playerWonModal.showModal();
        return;
      } else if (board.isBoardFull()) {
        modalText.textContent = `It's a tie`;
        playerWonModal.showModal();
      } else {
        toggleActivePlayer();
      }
    }
  };

  const checkWin = (player, board) => {
    let mark = player.getMark();
    // Check horizontal cells
    if (
      (board[0][0].getValue() === mark &&
        board[0][1].getValue() === mark &&
        board[0][2].getValue() === mark) ||
      (board[1][0].getValue() === mark &&
        board[1][1].getValue() === mark &&
        board[1][2].getValue() === mark) ||
      (board[2][0].getValue() === mark &&
        board[2][1].getValue() === mark &&
        board[2][2].getValue() === mark)
    ) {
      return true;
    }
    // Check vertical cells
    if (
      (board[0][0].getValue() === mark &&
        board[1][0].getValue() === mark &&
        board[2][0].getValue() === mark) ||
      (board[0][1].getValue() === mark &&
        board[1][1].getValue() === mark &&
        board[2][1].getValue() === mark) ||
      (board[0][2].getValue() === mark &&
        board[1][2].getValue() === mark &&
        board[2][2].getValue() === mark)
    ) {
      return true;
    }

    // Check diagonal cells

    if (
      (board[0][0].getValue() === mark &&
        board[1][1].getValue() === mark &&
        board[2][2].getValue() === mark) ||
      (board[0][2].getValue() === mark &&
        board[1][1].getValue() === mark &&
        board[2][0].getValue() === mark)
    ) {
      return true;
    }
  };

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
    resetBoard: board.resetBoard,
    toggleActivePlayer,
    checkWin,
  };
}

function ScreenController() {
  playerWonModal.close();
  const boardDiv = document.querySelector(".board");
  const playerTurnDiv = document.querySelector(".turn");
  const game = GameController();

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
        // const cellButton = document.createElement("button");
        // cellButton.classList.add("cell");

        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell-div");

        //cellDiv.appendChild(cellButton);
        boardDiv.appendChild(cellDiv);

        cellDiv.dataset.row = rowIndex;
        cellDiv.dataset.column = index;

        cellDiv.textContent = cell.getValue();

        if (rowIndex === 0 && index === 0) {
          cellDiv.classList.add("border-down", "border-right");
        } else if (rowIndex === 0 && index === 1) {
          cellDiv.classList.add("border-down", "border-right");
        } else if (rowIndex === 0 && index === 2) {
          cellDiv.classList.add("border-down");
        } else if (rowIndex === 1 && index === 0) {
          cellDiv.classList.add("border-down", "border-right");
        } else if (rowIndex === 1 && index === 1) {
          cellDiv.classList.add("border-down", "border-right");
        } else if (rowIndex === 1 && index === 2) {
          cellDiv.classList.add("border-down");
        } else if (rowIndex === 2 && index === 0) {
          cellDiv.classList.add("border-right");
        } else if (rowIndex === 2 && index === 1) {
          cellDiv.classList.add("border-right");
        }
      });
    });
  };
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();

  return { updateScreen, resetBoard: game.resetBoard };
}
const Screen = ScreenController();
playAgainBtn.addEventListener("click", () => {
  playerWonModal.close();
  Screen.resetBoard();
  Screen.updateScreen();
});
