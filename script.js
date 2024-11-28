const boardElement = document.getElementById("board");
const result = document.getElementById("result");
const resetButton = document.getElementById("reset");
const modeSelector = document.getElementById("mode");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = 2; // Default: 2-player mode

// Winning combinations
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize the game board
function createBoard() {
    boardElement.innerHTML = "";
    board = ["", "", "", "", "", "", "", "", ""];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-index", i);
        boardElement.appendChild(cell);
    }
}

// Handle mode selection
modeSelector.addEventListener("change", () => {
    gameMode = parseInt(modeSelector.value);
    resetGame();
});

// Handle cell click
boardElement.addEventListener("click", (event) => {
    const cell = event.target;
    const cellIndex = cell.getAttribute("data-index");

    if (!cell.classList.contains("cell") || board[cellIndex] !== "" || !gameActive) return;

    // Update board state and UI
    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    if (checkWin()) {
        result.textContent = `${currentPlayer} Wins!`;
        gameActive = false;
    } else if (board.every(cell => cell !== "")) {
        result.textContent = "It's a Tie!";
        gameActive = false;
    } else {
        if (gameMode === 1 && currentPlayer === "X") {
            currentPlayer = "O"; // AI's turn
            setTimeout(aiMove, 500); // Slight delay for better UX
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }
});

// Check for a winner
function checkWin() {
    return winningCombos.some(combo => {
        const [a, b, c] = combo;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// AI Move using Minimax
function aiMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    board[bestMove] = "O";
    const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
    cell.textContent = "O";
    cell.classList.add("taken");

    if (checkWin()) {
        result.textContent = "AI Wins!";
        gameActive = false;
    } else if (board.every(cell => cell !== "")) {
        result.textContent = "It's a Tie!";
        gameActive = false;
    } else {
        currentPlayer = "X";
    }
}

// Minimax Algorithm
function minimax(board, depth, isMaximizing) {
    let winner = checkWinnerForMinimax();
    if (winner !== null) {
        if (winner === "O") return 10 - depth;
        if (winner === "X") return depth - 10;
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check Winner for Minimax
function checkWinnerForMinimax() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== "")) return "Tie";
    return null;
}

// Reset the game
function resetGame() {
    createBoard();
    currentPlayer = "X";
    gameActive = true;
    result.textContent = "";
}

// Start the game
resetButton.addEventListener("click", resetGame);
createBoard();
