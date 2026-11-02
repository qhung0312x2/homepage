const numberPicker = document.getElementById("number-picker");
const selectedNumbersDisplay = document.getElementById("selected-numbers");
const drawResults = document.getElementById("draw-results");
const pickCountDisplay = document.getElementById("pick-count");
const resultMessage = document.getElementById("result-message");
const drawCountDisplay = document.getElementById("draw-count");
const randomPickButton = document.getElementById("random-pick-button");
const drawButton = document.getElementById("draw-button");
const resetButton = document.getElementById("reset-button");
const clearStatsButton = document.getElementById("clear-stats-button");
const historyBody = document.getElementById("history-body");
const historyTotalDisplay = document.getElementById("history-total");
const statsMessage = document.getElementById("stats-message");

const PICK_LIMIT = 6;
const MAX_NUMBER = 45;
const REVEAL_DELAY_MS = 260;
const HISTORY_STORAGE_KEY = "lotto645-draw-history";
let selectedNumbers = [];
let drawHistory = loadDrawHistory();
let drawCount = drawHistory.length;
let isDrawing = false;
let hasDrawn = false;
let drawSession = 0;
let canSaveHistory = true;

function getNumberRange(number) {
  if (number <= 10) return "yellow";
  if (number <= 20) return "blue";
  if (number <= 30) return "red";
  if (number <= 40) return "gray";
  return "green";
}

function createBall(number, extraClass = "") {
  const ball = document.createElement("span");
  ball.className = `number-ball ${extraClass}`.trim();
  ball.dataset.range = getNumberRange(number);
  ball.textContent = String(number).padStart(2, "0");
  ball.setAttribute("aria-label", String(number));
  return ball;
}

function renderPicker() {
  numberPicker.replaceChildren();

  for (let number = 1; number <= MAX_NUMBER; number += 1) {
    const button = document.createElement("button");
    button.className = "pick-number";
    button.type = "button";
    button.textContent = String(number).padStart(2, "0");
    button.dataset.range = getNumberRange(number);
    button.setAttribute("aria-label", `Chọn số ${number}`);
    button.setAttribute("aria-pressed", String(selectedNumbers.includes(number)));
    button.disabled = isDrawing || hasDrawn;
    if (selectedNumbers.includes(number)) button.classList.add("is-selected");
    button.addEventListener("click", () => toggleNumber(number));
    numberPicker.appendChild(button);
  }
}

function renderSelectedNumbers() {
  selectedNumbersDisplay.replaceChildren();

  for (let index = 0; index < PICK_LIMIT; index += 1) {
    const number = selectedNumbers[index];
    if (number !== undefined) {
      selectedNumbersDisplay.appendChild(createBall(number, "ticket-ball"));
      continue;
    }

    const placeholder = document.createElement("span");
    placeholder.className = "number-slot";
    placeholder.textContent = "·";
    placeholder.setAttribute("aria-hidden", "true");
    selectedNumbersDisplay.appendChild(placeholder);
  }

  pickCountDisplay.textContent = String(selectedNumbers.length);
  drawButton.disabled = selectedNumbers.length !== PICK_LIMIT || isDrawing || hasDrawn;
}

function renderEmptyDrawSlots() {
  const slots = Array.from({ length: PICK_LIMIT }, () => {
    const placeholder = document.createElement("span");
    placeholder.className = "number-slot";
    placeholder.textContent = "·";
    placeholder.setAttribute("aria-hidden", "true");
    return placeholder;
  });
  drawResults.replaceChildren(...slots);
}

function isValidNumberSet(numbers) {
  return Array.isArray(numbers) &&
    numbers.length === PICK_LIMIT &&
    numbers.every((number) => Number.isInteger(number) && number >= 1 && number <= MAX_NUMBER) &&
    new Set(numbers).size === PICK_LIMIT;
}

function loadDrawHistory() {
  try {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!savedHistory) return [];

    const parsedHistory = JSON.parse(savedHistory);
    if (!Array.isArray(parsedHistory)) throw new TypeError("Lịch sử xổ số không hợp lệ.");

    const validHistory = parsedHistory.filter((entry) =>
      entry &&
      isValidNumberSet(entry.selectedNumbers) &&
      isValidNumberSet(entry.drawnNumbers) &&
      typeof entry.drawnAt === "string"
    );
    if (validHistory.length !== parsedHistory.length) {
      statsMessage.textContent = "Một số dữ liệu lịch sử không hợp lệ đã được bỏ qua.";
      console.error("Một số mục trong lịch sử xổ số đã lưu không hợp lệ.");
    }
    return validHistory;
  } catch (error) {
    statsMessage.textContent = "Không thể đọc lịch sử đã lưu. Thống kê mới vẫn hoạt động trong phiên này.";
    console.error("Không thể đọc lịch sử xổ số từ bộ nhớ trình duyệt.", error);
    return [];
  }
}

function saveDrawHistory() {
  if (!canSaveHistory) return;

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(drawHistory));
    statsMessage.textContent = "";
  } catch (error) {
    canSaveHistory = false;
    statsMessage.textContent = "Không thể lưu thống kê vào trình duyệt; dữ liệu sẽ mất khi tải lại trang.";
    console.error("Không thể lưu lịch sử xổ số vào bộ nhớ trình duyệt.", error);
  }
}

function renderStats() {
  for (let matchCount = 0; matchCount <= PICK_LIMIT; matchCount += 1) {
    const count = drawHistory.reduce((total, entry) => {
      const matches = entry.drawnNumbers.filter((number) => entry.selectedNumbers.includes(number)).length;
      return total + Number(matches === matchCount);
    }, 0);
    document.getElementById(`match-count-${matchCount}`).textContent = String(count);
  }

  historyTotalDisplay.textContent = `${drawHistory.length} lượt`;
  historyBody.replaceChildren();

  if (drawHistory.length === 0) {
    const row = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.className = "history-empty";
    emptyCell.colSpan = 4;
    emptyCell.textContent = "Chưa có lượt quay nào.";
    row.appendChild(emptyCell);
    historyBody.appendChild(row);
    return;
  }

  drawHistory.slice().reverse().forEach((entry, reverseIndex) => {
    const matchCount = entry.drawnNumbers.filter((number) => entry.selectedNumbers.includes(number)).length;
    const row = document.createElement("tr");
    const roundCell = document.createElement("td");
    const selectedCell = document.createElement("td");
    const drawnCell = document.createElement("td");
    const matchCell = document.createElement("td");
    const badge = document.createElement("span");

    roundCell.textContent = `#${drawHistory.length - reverseIndex}`;
    selectedCell.className = "history-numbers";
    selectedCell.textContent = entry.selectedNumbers.map((number) => String(number).padStart(2, "0")).join(" · ");
    drawnCell.className = "history-numbers";
    drawnCell.textContent = entry.drawnNumbers.map((number) => String(number).padStart(2, "0")).join(" · ");
    badge.className = `match-badge${matchCount === PICK_LIMIT ? " match-badge-perfect" : ""}`;
    badge.textContent = `${matchCount}/6`;
    matchCell.appendChild(badge);
    row.append(roundCell, selectedCell, drawnCell, matchCell);
    historyBody.appendChild(row);
  });
}

function toggleNumber(number) {
  if (isDrawing || hasDrawn) return;

  const selectedIndex = selectedNumbers.indexOf(number);
  if (selectedIndex !== -1) {
    selectedNumbers.splice(selectedIndex, 1);
  } else if (selectedNumbers.length < PICK_LIMIT) {
    selectedNumbers.push(number);
  } else {
    resultMessage.textContent = "Bạn đã chọn đủ 6 số. Bỏ chọn một số trước nhé.";
    return;
  }

  selectedNumbers.sort((a, b) => a - b);
  pickCountDisplay.textContent = String(selectedNumbers.length);
  renderPicker();
  renderSelectedNumbers();
  renderEmptyDrawSlots();
  resultMessage.textContent = selectedNumbers.length === PICK_LIMIT
    ? "Vé đã sẵn sàng — bắt đầu quay khi bạn muốn!"
    : "Chọn đủ 6 số để bắt đầu quay.";
}

function chooseRandomNumbers() {
  if (isDrawing || hasDrawn) return;

  const numbers = Array.from({ length: MAX_NUMBER }, (_, index) => index + 1);
  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [numbers[index], numbers[randomIndex]] = [numbers[randomIndex], numbers[index]];
  }

  selectedNumbers = numbers.slice(0, PICK_LIMIT).sort((a, b) => a - b);
  pickCountDisplay.textContent = String(PICK_LIMIT);
  renderPicker();
  renderSelectedNumbers();
  renderEmptyDrawSlots();
  resultMessage.textContent = "Vé đã sẵn sàng — bắt đầu quay khi bạn muốn!";
}

function finishDraw(drawnNumbers) {
  const matchedNumbers = drawnNumbers.filter((number) => selectedNumbers.includes(number));
  const matched = new Set(matchedNumbers);
  drawResults.replaceChildren(
    ...drawnNumbers.map((number) => createBall(number, matched.has(number) ? "is-match" : ""))
  );
  selectedNumbersDisplay.replaceChildren(
    ...selectedNumbers.map((number) => createBall(
      number,
      `ticket-ball${matched.has(number) ? " is-match" : ""}`
    ))
  );

  const matchCount = matchedNumbers.length;
  resultMessage.textContent = matchCount === PICK_LIMIT
    ? "Tuyệt vời! Bạn trùng cả 6 số."
    : `Bạn trùng ${matchCount}/6 số${matchCount ? `: ${matchedNumbers.map(n => String(n).padStart(2, "0")).join(", ")}` : ". Chúc may mắn lượt sau!"}`;
  drawCount += 1;
  drawCountDisplay.textContent = String(drawCount);
  drawHistory.push({
    selectedNumbers: [...selectedNumbers],
    drawnNumbers: [...drawnNumbers],
    drawnAt: new Date().toISOString()
  });
  saveDrawHistory();
  renderStats();
  isDrawing = false;
  hasDrawn = true;
  randomPickButton.disabled = true;
  drawButton.disabled = true;
  renderPicker();
}

function revealDraw(drawnNumbers, session, index = 0) {
  if (session !== drawSession) return;

  if (index === drawnNumbers.length) {
    finishDraw(drawnNumbers);
    return;
  }

  drawResults.children[index].replaceWith(createBall(drawnNumbers[index], "is-revealing"));
  window.setTimeout(() => revealDraw(drawnNumbers, session, index + 1), REVEAL_DELAY_MS);
}

function startDraw() {
  if (selectedNumbers.length !== PICK_LIMIT || isDrawing || hasDrawn) return;

  const numbers = Array.from({ length: MAX_NUMBER }, (_, index) => index + 1);
  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [numbers[index], numbers[randomIndex]] = [numbers[randomIndex], numbers[index]];
  }

  isDrawing = true;
  drawSession += 1;
  randomPickButton.disabled = true;
  drawButton.disabled = true;
  numberPicker.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  renderEmptyDrawSlots();
  resultMessage.textContent = "Đang quay số...";
  revealDraw(numbers.slice(0, PICK_LIMIT).sort((a, b) => a - b), drawSession);
}

function startNewGame() {
  drawSession += 1;
  selectedNumbers = [];
  isDrawing = false;
  hasDrawn = false;
  randomPickButton.disabled = false;
  drawCount = drawHistory.length;
  drawCountDisplay.textContent = String(drawCount);
  renderEmptyDrawSlots();
  resultMessage.textContent = "Chọn đủ 6 số để bắt đầu quay.";
  pickCountDisplay.textContent = "0";
  renderPicker();
  renderSelectedNumbers();
}

function clearDrawHistory() {
  drawHistory = [];
  drawCount = 0;
  drawCountDisplay.textContent = "0";
  saveDrawHistory();
  renderStats();
}

randomPickButton.addEventListener("click", chooseRandomNumbers);
drawButton.addEventListener("click", startDraw);
resetButton.addEventListener("click", startNewGame);
clearStatsButton.addEventListener("click", clearDrawHistory);

renderPicker();
renderSelectedNumbers();
renderEmptyDrawSlots();
drawCountDisplay.textContent = String(drawCount);
renderStats();
