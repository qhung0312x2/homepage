let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Hàng ngang
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Hàng dọc
    [0, 4, 8], [2, 4, 6]             // Đường chéo
];

function makeMove(index) {
    if (board[index] !== "" || !isGameActive) return;

    board[index] = currentPlayer;
    document.querySelectorAll(".cell")[index].textContent = currentPlayer;

    if (checkWin()) {
        document.getElementById("status").textContent = `🎉 승리: ${currentPlayer}!`;
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        document.getElementById("status").textContent = "🤝 무승부! (Hòa)";
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("status").textContent = `차례: ${currentPlayer}`;
}

function checkWin() {
    return winConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    document.getElementById("status").textContent = "차례: X (당신)";
    document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
}