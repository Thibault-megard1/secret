// Onglets
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = {
  tic: document.getElementById('tic-panel'),
  pendu: document.getElementById('pendu-panel'),
  rps: document.getElementById('rps-panel')
};

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');

    Object.values(tabPanels).forEach((panel) => panel.classList.remove('active'));
    tabPanels[button.dataset.tab].classList.add('active');
  });
});

// Tic Tac Toe vs IA simple
const ticBoardElement = document.getElementById('tic-board');
const ticStatus = document.getElementById('tic-status');
const ticReset = document.getElementById('tic-reset');

let ticBoard = Array(9).fill('');
let ticGameOver = false;

function renderTicBoard() {
  ticBoardElement.innerHTML = '';
  ticBoard.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.className = 'tic-cell';
    cell.textContent = value;
    cell.disabled = value !== '' || ticGameOver;
    cell.addEventListener('click', () => handlePlayerMove(index));
    ticBoardElement.appendChild(cell);
  });
}

function checkWinner(board, player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return wins.some((combo) => combo.every((idx) => board[idx] === player));
}

function getEmptyCells(board) {
  return board.map((v, i) => (v === '' ? i : null)).filter((v) => v !== null);
}

function aiMove() {
  const empties = getEmptyCells(ticBoard);

  // 1) L'IA essaie de gagner
  for (const idx of empties) {
    const copy = [...ticBoard];
    copy[idx] = 'O';
    if (checkWinner(copy, 'O')) {
      return idx;
    }
  }

  // 2) L'IA bloque le joueur
  for (const idx of empties) {
    const copy = [...ticBoard];
    copy[idx] = 'X';
    if (checkWinner(copy, 'X')) {
      return idx;
    }
  }

  // 3) Priorite centre, coins, puis hasard
  if (ticBoard[4] === '') return 4;
  const corners = [0, 2, 6, 8].filter((i) => ticBoard[i] === '');
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return empties[Math.floor(Math.random() * empties.length)];
}

function handlePlayerMove(index) {
  if (ticBoard[index] !== '' || ticGameOver) return;

  ticBoard[index] = 'X';

  if (checkWinner(ticBoard, 'X')) {
    ticStatus.textContent = 'Tu as gagne !';
    ticGameOver = true;
    renderTicBoard();
    return;
  }

  if (getEmptyCells(ticBoard).length === 0) {
    ticStatus.textContent = 'Egalite.';
    ticGameOver = true;
    renderTicBoard();
    return;
  }

  ticStatus.textContent = 'Tour de l\'IA...';
  renderTicBoard();

  setTimeout(() => {
    const move = aiMove();
    ticBoard[move] = 'O';

    if (checkWinner(ticBoard, 'O')) {
      ticStatus.textContent = 'L\'IA a gagne.';
      ticGameOver = true;
    } else if (getEmptyCells(ticBoard).length === 0) {
      ticStatus.textContent = 'Egalite.';
      ticGameOver = true;
    } else {
      ticStatus.textContent = 'Ton tour (X)';
    }

    renderTicBoard();
  }, 350);
}

function resetTicTacToe() {
  ticBoard = Array(9).fill('');
  ticGameOver = false;
  ticStatus.textContent = 'Ton tour (X)';
  renderTicBoard();
}

ticReset.addEventListener('click', resetTicTacToe);
resetTicTacToe();

// Pendu
const hangmanWords = [
  'JAVASCRIPT', 'ORDINATEUR', 'PROGRAMMATION', 'NAVIGATEUR', 'ALGORITHME', 'VARIABLE'
];

const hangmanStatus = document.getElementById('hangman-status');
const hangmanWordEl = document.getElementById('hangman-word');
const hangmanUsedEl = document.getElementById('hangman-used');
const hangmanErrorsEl = document.getElementById('hangman-errors');
const hangmanInput = document.getElementById('hangman-input');
const hangmanGuessBtn = document.getElementById('hangman-guess');
const hangmanResetBtn = document.getElementById('hangman-reset');

let hangmanWord = '';
let guessedLetters = new Set();
let errors = 0;
const maxErrors = 6;

function renderHangman() {
  const display = hangmanWord
    .split('')
    .map((char) => (guessedLetters.has(char) ? char : '_'))
    .join(' ');

  hangmanWordEl.textContent = display;
  hangmanUsedEl.textContent = guessedLetters.size ? Array.from(guessedLetters).join(', ') : 'Aucune';
  hangmanErrorsEl.textContent = String(errors);

  const isWon = hangmanWord.split('').every((char) => guessedLetters.has(char));
  const isLost = errors >= maxErrors;

  if (isWon) {
    hangmanStatus.textContent = 'Bravo, tu as trouve le mot !';
  } else if (isLost) {
    hangmanStatus.textContent = `Perdu. Le mot etait ${hangmanWord}.`;
  } else {
    hangmanStatus.textContent = 'Trouve le mot !';
  }

  hangmanInput.disabled = isWon || isLost;
  hangmanGuessBtn.disabled = isWon || isLost;
}

function guessLetter() {
  if (hangmanInput.disabled) return;

  const letter = hangmanInput.value.toUpperCase();
  hangmanInput.value = '';

  if (!/^[A-Z]$/.test(letter)) {
    hangmanStatus.textContent = 'Entre une seule lettre.';
    return;
  }

  if (guessedLetters.has(letter)) {
    hangmanStatus.textContent = 'Lettre deja proposee.';
    return;
  }

  guessedLetters.add(letter);

  if (!hangmanWord.includes(letter)) {
    errors += 1;
  }

  renderHangman();
}

function resetHangman() {
  hangmanWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
  guessedLetters = new Set();
  errors = 0;
  hangmanInput.disabled = false;
  hangmanGuessBtn.disabled = false;
  hangmanInput.value = '';
  renderHangman();
}

hangmanGuessBtn.addEventListener('click', guessLetter);
hangmanResetBtn.addEventListener('click', resetHangman);
hangmanInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') guessLetter();
});
resetHangman();

// Pierre-Feuille-Ciseaux
const rpsChoices = ['pierre', 'feuille', 'ciseaux'];
const rpsStatus = document.getElementById('rps-status');
const rpsResult = document.getElementById('rps-result');
const rpsPlayerScoreEl = document.getElementById('rps-player-score');
const rpsAiScoreEl = document.getElementById('rps-ai-score');
const rpsResetBtn = document.getElementById('rps-reset');

let rpsPlayerScore = 0;
let rpsAiScore = 0;

function decideRpsWinner(player, ai) {
  if (player === ai) return 'egalite';
  if (
    (player === 'pierre' && ai === 'ciseaux') ||
    (player === 'feuille' && ai === 'pierre') ||
    (player === 'ciseaux' && ai === 'feuille')
  ) {
    return 'joueur';
  }
  return 'ia';
}

function updateRpsScore() {
  rpsPlayerScoreEl.textContent = String(rpsPlayerScore);
  rpsAiScoreEl.textContent = String(rpsAiScore);
}

function playRps(playerChoice) {
  const aiChoice = rpsChoices[Math.floor(Math.random() * rpsChoices.length)];
  const winner = decideRpsWinner(playerChoice, aiChoice);

  if (winner === 'joueur') {
    rpsPlayerScore += 1;
    rpsResult.textContent = `Tu as choisi ${playerChoice}, IA ${aiChoice}: tu gagnes !`;
  } else if (winner === 'ia') {
    rpsAiScore += 1;
    rpsResult.textContent = `Tu as choisi ${playerChoice}, IA ${aiChoice}: l'IA gagne.`;
  } else {
    rpsResult.textContent = `Tu as choisi ${playerChoice}, IA ${aiChoice}: egalite.`;
  }

  rpsStatus.textContent = 'Rejoue quand tu veux.';
  updateRpsScore();
}

document.querySelectorAll('.rps-choice').forEach((btn) => {
  btn.addEventListener('click', () => playRps(btn.dataset.choice));
});

rpsResetBtn.addEventListener('click', () => {
  rpsPlayerScore = 0;
  rpsAiScore = 0;
  rpsResult.textContent = '--';
  rpsStatus.textContent = 'Choisis un coup.';
  updateRpsScore();
});

updateRpsScore();
