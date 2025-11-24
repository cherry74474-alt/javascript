const guessInput = document.querySelector('#guessInput');
const submitBtn = document.querySelector('#submitBtn');
const resetBtn = document.querySelector('#resetBtn');
const messageEl = document.querySelector('#message');
const attemptCountEl = document.querySelector('#attemptCount');
const guessesListEl = document.querySelector('#guessesList');
const statusEl = document.querySelector('#status');

let targetNumber;
let attempts = 0;
let gameOver = false;

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100) + 1;
};

const startNewGame = () => {
  targetNumber = generateRandomNumber();
  attempts = 0;
  gameOver = false;
  guessInput.value = '';
  guessInput.disabled = false;
  submitBtn.disabled = false;
  guessesListEl.innerHTML = '';
  messageEl.textContent = 'Enter your guess below!';
  attemptCountEl.textContent = '0';
  resetBtn.style.display = 'none';
  statusEl.className = 'status';
  guessInput.focus();
};

const updateMessage = (text, type = 'info') => {
  messageEl.textContent = text;
  statusEl.className = `status status--${type}`;
};

const addGuessToList = (guess, result) => {
  const guessItem = document.createElement('div');
  guessItem.className = `guess-item guess-item--${result}`;
  guessItem.textContent = `${guess} (${result})`;
  guessesListEl.appendChild(guessItem);
};

const checkGuess = () => {
  const guess = parseInt(guessInput.value, 10);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    updateMessage('Please enter a valid number between 1 and 100!', 'error');
    return;
  }

  attempts++;
  attemptCountEl.textContent = attempts;

  if (guess === targetNumber) {
    gameOver = true;
    updateMessage(
      `🎉 Congratulations! You guessed it in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!`,
      'success'
    );
    addGuessToList(guess, 'correct');
    guessInput.disabled = true;
    submitBtn.disabled = true;
    resetBtn.style.display = 'block';
  } else if (guess < targetNumber) {
    updateMessage('Too low! Try a higher number.', 'warning');
    addGuessToList(guess, 'low');
  } else {
    updateMessage('Too high! Try a lower number.', 'warning');
    addGuessToList(guess, 'high');
  }

  guessInput.value = '';
  guessInput.focus();
};

const handleSubmit = () => {
  if (gameOver) return;
  checkGuess();
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !gameOver) {
    handleSubmit();
  }
};

submitBtn.addEventListener('click', handleSubmit);
resetBtn.addEventListener('click', startNewGame);
guessInput.addEventListener('keypress', handleKeyPress);

startNewGame();

