// Xử lý Logic Game Tic-Tac-Toe
        let boardSize = 3;
        let winCondition = 3;
        let board = [];
        let currentPlayer = "X";
        let isGameActive = true;
        let gameMode = "ai";
        let difficulty = "hard";

        let stats = { wins: 0, losses: 0, draws: 0, streak: 0 };

        function initGame() {
            board = Array(boardSize * boardSize).fill("");
            isGameActive = true;
            currentPlayer = "X";
            
            const boardEl = document.getElementById("board");
            boardEl.innerHTML = "";
            boardEl.className = `ttt-board ${boardSize === 5 ? 'size-5' : ''}`;

            for (let i = 0; i < boardSize * boardSize; i++) {
                const cell = document.createElement("button");
                cell.className = "ttt-cell";
                cell.dataset.index = i;
                cell.addEventListener("click", () => handleCellClick(i));
                boardEl.appendChild(cell);
            }

            updateStatus("당신의 차례입니다 (X)");
        }

        function setGameMode(mode) {
            gameMode = mode;
            document.getElementById("btnModeAi").classList.toggle("active", mode === 'ai');
            document.getElementById("btnModePvp").classList.toggle("active", mode === 'pvp');
            document.getElementById("aiDiffContainer").style.display = mode === 'ai' ? 'block' : 'none';
            resetGame();
        }

        function setDifficulty(diff) {
            difficulty = diff;
            document.getElementById("diffEasy").classList.toggle("active", diff === 'easy');
            document.getElementById("diffMedium").classList.toggle("active", diff === 'medium');
            document.getElementById("diffHard").classList.toggle("active", diff === 'hard');
            resetGame();
        }

        function setBoardSize(size) {
            boardSize = size;
            winCondition = size === 3 ? 3 : 4;
            document.getElementById("size3").classList.toggle("active", size === 3);
            document.getElementById("size5").classList.toggle("active", size === 5);
            resetGame();
        }

        function handleCellClick(index) {
            if (board[index] !== "" || !isGameActive) return;

            makeMove(index, currentPlayer);

            if (checkWin(currentPlayer)) {
                endGame(currentPlayer === "X" ? "win" : "loss");
                return;
            }

            if (board.every(cell => cell !== "")) {
                endGame("draw");
                return;
            }

            currentPlayer = currentPlayer === "X" ? "O" : "X";

            if (gameMode === "ai" && currentPlayer === "O" && isGameActive) {
                updateStatus("AI가 생각 중입니다...");
                setTimeout(makeAiMove, 300);
            } else {
                updateStatus(`차례: ${currentPlayer}`);
            }
        }

        function makeMove(index, player) {
            board[index] = player;
            const cells = document.querySelectorAll(".ttt-cell");
            cells[index].textContent = player;
            cells[index].classList.add(player.toLowerCase());
        }

        function makeAiMove() {
            if (!isGameActive) return;
            let move;

            if (difficulty === "easy") {
                move = getRandomMove();
            } else if (difficulty === "medium") {
                move = Math.random() < 0.5 ? getBestMove() : getRandomMove();
            } else {
                move = getBestMove();
            }

            if (move !== undefined && move !== -1) {
                makeMove(move, "O");

                if (checkWin("O")) {
                    endGame("loss");
                    return;
                }

                if (board.every(cell => cell !== "")) {
                    endGame("draw");
                    return;
                }

                currentPlayer = "X";
                updateStatus("당신의 차례입니다 (X)");
            }
        }

        function getRandomMove() {
            const emptyIndices = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
            return emptyIndices.length > 0 ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)] : -1;
        }

        function getBestMove() {
            const emptyIndices = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);

            for (let idx of emptyIndices) {
                board[idx] = "O";
                if (checkWin("O")) { board[idx] = ""; return idx; }
                board[idx] = "";
            }

            for (let idx of emptyIndices) {
                board[idx] = "X";
                if (checkWin("X")) { board[idx] = ""; return idx; }
                board[idx] = "";
            }

            const center = Math.floor((boardSize * boardSize) / 2);
            if (board[center] === "") return center;

            return getRandomMove();
        }

        function checkWin(player) {
            const size = boardSize;
            const win = winCondition;

            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (c + win <= size && checkLine(r, c, 0, 1, player)) return true;
                    if (r + win <= size && checkLine(r, c, 1, 0, player)) return true;
                    if (r + win <= size && c + win <= size && checkLine(r, c, 1, 1, player)) return true;
                    if (r + win <= size && c - win + 1 >= 0 && checkLine(r, c, 1, -1, player)) return true;
                }
            }
            return false;
        }

        function checkLine(r, c, dr, dc, player) {
            for (let i = 0; i < winCondition; i++) {
                const idx = (r + dr * i) * boardSize + (c + dc * i);
                if (board[idx] !== player) return false;
            }
            return true;
        }

        function endGame(result) {
            isGameActive = false;
            if (result === "win") {
                updateStatus("🎉 축하합니다! 승리하셨습니다!");
                stats.wins++;
                stats.streak++;
            } else if (result === "loss") {
                updateStatus("😅 AI가 승리했습니다. 다시 도전해보세요!");
                stats.losses++;
                stats.streak = 0;
            } else {
                updateStatus("🤝 무승부입니다!");
                stats.draws++;
            }
            updateScoreboard();
        }

        function updateStatus(msg) {
            document.getElementById("turnStatus").textContent = msg;
        }

        function updateScoreboard() {
            document.getElementById("winCount").textContent = stats.wins;
            document.getElementById("lossCount").textContent = stats.losses;
            document.getElementById("drawCount").textContent = stats.draws;
            document.getElementById("streakCount").textContent = stats.streak;
        }

        function resetGame() {
            initGame();
        }

        function resetScore() {
            stats = { wins: 0, losses: 0, draws: 0, streak: 0 };
            updateScoreboard();
            resetGame();
        }

        window.onload = initGame;