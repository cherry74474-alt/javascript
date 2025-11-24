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

