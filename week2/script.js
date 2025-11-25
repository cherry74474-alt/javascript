const displayEl = document.querySelector('#display');
const historyEl = document.querySelector('#history');
const keypad = document.querySelector('.keypad');

let currentValue = '0';
let previousValue = '';
let operator = null;
let overwrite = false;

const format = (value) => {
  const [int, decimal] = value.split('.');
  const formattedInt = Number(int).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
  return decimal ? `${formattedInt}.${decimal}` : formattedInt;
};

const updateDisplay = () => {
  displayEl.textContent = format(currentValue);
  historyEl.textContent = previousValue
    ? `${format(previousValue)} ${operator ?? ''}`
    : '';
};

const handleNumber = (digit) => {
  if (overwrite) {
    currentValue = digit === '.' ? '0.' : digit;
    overwrite = false;
    return;
  }

  if (digit === '.' && currentValue.includes('.')) return;
  currentValue =
    currentValue === '0' && digit !== '.'
      ? digit
      : `${currentValue}${digit}`;
};

const handleOperator = (nextOperator) => {
  if (operator && !overwrite) {
    calculate();
  } else {
    previousValue = currentValue;
  }
  operator = nextOperator;
  overwrite = true;
};

const calculate = () => {
  if (!operator || !previousValue) return;
  const a = parseFloat(previousValue);
  const b = parseFloat(currentValue);
  let result = 0;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '−':
      result = a - b;
      break;
    case '×':
      result = a * b;
      break;
    case '÷':
      result = b === 0 ? 'Error' : a / b;
      break;
    default:
      return;
  }

  currentValue =
    typeof result === 'number' && Number.isFinite(result)
      ? result.toString()
      : 'Error';
  previousValue = '';
  operator = null;
  overwrite = true;
};

const handleFunction = (action) => {
  switch (action) {
    case 'clear':
      currentValue = '0';
      previousValue = '';
      operator = null;
      overwrite = false;
      break;
    case 'sign':
      currentValue =
        currentValue.charAt(0) === '-'
          ? currentValue.slice(1)
          : currentValue === '0'
          ? '0'
          : `-${currentValue}`;
      break;
    case 'percent':
      currentValue = (parseFloat(currentValue) / 100).toString();
      break;
    default:
      break;
  }
};

const handleEquals = () => {
  calculate();
};

keypad.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  const { value } = target.dataset;
  const action = target.dataset.action;

  if (value !== undefined) {
    handleNumber(value);
  } else if (action === 'equals') {
    handleEquals();
  } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
    const symbols = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷',
    };
    handleOperator(symbols[action]);
  } else {
    handleFunction(action);
  }

  updateDisplay();
});

document.addEventListener('keydown', (event) => {
  const { key } = event;
  if (/\d/.test(key)) {
    handleNumber(key);
  } else if (key === '.') {
    handleNumber('.');
  } else if (['+', '-', '*', '/'].includes(key)) {
    const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    handleOperator(symbols[key]);
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  } else if (key === 'Escape') {
    handleFunction('clear');
  } else if (key === '%') {
    handleFunction('percent');
  }
  updateDisplay();
});

updateDisplay();



