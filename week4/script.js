const categorySelect = document.querySelector('#categorySelect');
const fromUnitSelect = document.querySelector('#fromUnit');
const toUnitSelect = document.querySelector('#toUnit');
const fromValueInput = document.querySelector('#fromValue');
const toValueInput = document.querySelector('#toValue');
const swapBtn = document.querySelector('#swapBtn');
const resultText = document.querySelector('#resultText');
const resultDisplay = document.querySelector('#resultDisplay');

const units = {
  length: [
    { name: 'Meter', value: 'meter', factor: 1 },
    { name: 'Kilometer', value: 'kilometer', factor: 1000 },
    { name: 'Centimeter', value: 'centimeter', factor: 0.01 },
    { name: 'Millimeter', value: 'millimeter', factor: 0.001 },
    { name: 'Mile', value: 'mile', factor: 1609.34 },
    { name: 'Yard', value: 'yard', factor: 0.9144 },
    { name: 'Foot', value: 'foot', factor: 0.3048 },
    { name: 'Inch', value: 'inch', factor: 0.0254 },
  ],
  weight: [
    { name: 'Kilogram', value: 'kilogram', factor: 1 },
    { name: 'Gram', value: 'gram', factor: 0.001 },
    { name: 'Milligram', value: 'milligram', factor: 0.000001 },
    { name: 'Pound', value: 'pound', factor: 0.453592 },
    { name: 'Ounce', value: 'ounce', factor: 0.0283495 },
    { name: 'Ton', value: 'ton', factor: 1000 },
  ],
  temperature: [
    { name: 'Celsius', value: 'celsius' },
    { name: 'Fahrenheit', value: 'fahrenheit' },
    { name: 'Kelvin', value: 'kelvin' },
  ],
  volume: [
    { name: 'Liter', value: 'liter', factor: 1 },
    { name: 'Milliliter', value: 'milliliter', factor: 0.001 },
    { name: 'Gallon (US)', value: 'gallon', factor: 3.78541 },
    { name: 'Quart (US)', value: 'quart', factor: 0.946353 },
    { name: 'Pint (US)', value: 'pint', factor: 0.473176 },
    { name: 'Cup (US)', value: 'cup', factor: 0.236588 },
    { name: 'Fluid Ounce (US)', value: 'floz', factor: 0.0295735 },
  ],
};

let currentCategory = 'length';

const populateUnits = (category) => {
  const categoryUnits = units[category];
  fromUnitSelect.innerHTML = '';
  toUnitSelect.innerHTML = '';

  categoryUnits.forEach((unit) => {
    const fromOption = document.createElement('option');
    fromOption.value = unit.value;
    fromOption.textContent = unit.name;
    fromUnitSelect.appendChild(fromOption);

    const toOption = document.createElement('option');
    toOption.value = unit.value;
    toOption.textContent = unit.name;
    toUnitSelect.appendChild(toOption);
  });

  if (categoryUnits.length > 1) {
    toUnitSelect.selectedIndex = 1;
  }
};

const convertTemperature = (value, from, to) => {
  if (from === to) return value;

  let celsius = value;

  if (from === 'fahrenheit') {
    celsius = (value - 32) * (5 / 9);
  } else if (from === 'kelvin') {
    celsius = value - 273.15;
  }

  if (to === 'fahrenheit') {
    return celsius * (9 / 5) + 32;
  } else if (to === 'kelvin') {
    return celsius + 273.15;
  }

  return celsius;
};

const convertStandard = (value, fromUnit, toUnit, category) => {
  const categoryUnits = units[category];
  const from = categoryUnits.find((u) => u.value === fromUnit);
  const to = categoryUnits.find((u) => u.value === toUnit);

  if (!from || !to) return 0;

  const baseValue = value * from.factor;
  return baseValue / to.factor;
};

const performConversion = () => {
  const value = parseFloat(fromValueInput.value);
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  if (isNaN(value) || value === '') {
    toValueInput.value = '';
    resultText.textContent = '';
    resultDisplay.className = 'result-display';
    return;
  }

  let result;

  if (currentCategory === 'temperature') {
    result = convertTemperature(value, fromUnit, toUnit);
  } else {
    result = convertStandard(value, fromUnit, toUnit, currentCategory);
  }

  toValueInput.value = result.toFixed(6).replace(/\.?0+$/, '');

  const fromUnitName = units[currentCategory].find((u) => u.value === fromUnit).name;
  const toUnitName = units[currentCategory].find((u) => u.value === toUnit).name;

  resultText.textContent = `${value} ${fromUnitName} = ${toValueInput.value} ${toUnitName}`;
  resultDisplay.className = 'result-display result-display--active';
};

const swapUnits = () => {
  const tempUnit = fromUnitSelect.value;
  const tempValue = fromValueInput.value;

  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = tempUnit;

  fromValueInput.value = toValueInput.value;
  toValueInput.value = tempValue;

  performConversion();
};

categorySelect.addEventListener('change', (e) => {
  currentCategory = e.target.value;
  populateUnits(currentCategory);
  fromValueInput.value = '';
  toValueInput.value = '';
  resultText.textContent = '';
  resultDisplay.className = 'result-display';
});

fromUnitSelect.addEventListener('change', performConversion);
toUnitSelect.addEventListener('change', performConversion);
fromValueInput.addEventListener('input', performConversion);
swapBtn.addEventListener('click', swapUnits);

fromValueInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    performConversion();
  }
});

populateUnits(currentCategory);

