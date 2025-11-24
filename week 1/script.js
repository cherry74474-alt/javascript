const themeToggle = document.querySelector('#themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
const yearEl = document.querySelector('#year');

const setYear = () => {
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

const loadThemePreference = () => {
  const stored = localStorage.getItem('preferred-theme');
  if (stored === 'light') {
    document.documentElement.classList.add('light');
    themeIcon.textContent = '🌙';
  }
};

const toggleTheme = () => {
  document.documentElement.classList.toggle('light');
  const isLight = document.documentElement.classList.contains('light');
  localStorage.setItem('preferred-theme', isLight ? 'light' : 'dark');
  themeIcon.textContent = isLight ? '🌙' : '☀️';
};

const toggleNav = () => {
  navList.classList.toggle('is-open');
};

const initNavLinks = () => {
  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
    });
  });
};

setYear();
loadThemePreference();

themeToggle?.addEventListener('click', toggleTheme);
navToggle?.addEventListener('click', toggleNav);
if (navList) initNavLinks();


// Simple Calculator Logic
const calcDisplay = document.getElementById('calc-display');
const calcButtons = document.querySelectorAll('.calc-btn');
let calcCurrent = '';
let calcOperator = '';
let calcOperand = '';
let calcResultShown = false;

function updateCalcDisplay(val) {
  calcDisplay.textContent = val;
}

function clearCalc() {
  calcCurrent = '';
  calcOperator = '';
  calcOperand = '';
  calcResultShown = false;
  updateCalcDisplay('0');
}

function calculate() {
  let result = 0;
  const a = parseFloat(calcOperand);
  const b = parseFloat(calcCurrent);
  if (isNaN(a) || isNaN(b)) return calcCurrent || calcOperand || '0';
  switch (calcOperator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b !== 0 ? a / b : 'Err'; break;
    default: return calcCurrent;
  }
  return result.toString();
}

calcButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.getAttribute('data-value');
    if (val === 'C') {
      clearCalc();
    } else if (val === '=') {
      if (calcOperator && calcOperand !== '' && calcCurrent !== '') {
        const result = calculate();
        updateCalcDisplay(result);
        calcCurrent = result;
        calcOperator = '';
        calcOperand = '';
        calcResultShown = true;
      }
    } else if ('+-*/'.includes(val)) {
      if (calcCurrent !== '') {
        if (calcOperator && calcOperand !== '') {
          // Chain operations
          const result = calculate();
          calcOperand = result;
          updateCalcDisplay(result);
        } else {
          calcOperand = calcCurrent;
        }
        calcOperator = val;
        calcCurrent = '';
        calcResultShown = false;
      }
    } else {
      if (calcResultShown) {
        calcCurrent = '';
        calcResultShown = false;
      }
      // Prevent multiple decimals
      if (val === '.' && calcCurrent.includes('.')) return;
      calcCurrent += val;
      updateCalcDisplay(calcCurrent);
    }
  });
});

// Initialize calculator display
if (calcDisplay) updateCalcDisplay('0');

