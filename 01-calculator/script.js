const display = document.querySelector("input");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "";
let operator = "";
let firstOperand = null;

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "AC") {
      clearDisplay();
    } else if (value === "=") {
      calculate();
    } else if (value === "%") {
      percentage();
    } else if (value === "+/-") {
      toggleSign();
    } else {
      handleInput(value);
    }
  });
});

function clearDisplay() {
  currentInput = "";
  operator = "";
  firstOperand = null;
  display.value = '';
}

function handleInput(value) {
  if (["+", "-", "*", "/"].includes(value)) {
    if (currentInput === '') return;
    if (firstOperand === null) {
      firstOperand = parseFloat(currentInput);
    } else {
      calculate();
    }

    operator = value;
    currentInput = '';
  } else {
    currentInput += value;
    display.value = currentInput;
  }
}

function calculate() {
  if (firstOperand === null || currentInput === '') return;
  const secondOperand = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+':
      result = firstOperand + secondOperand;
      break;
    case '-':
      result = firstOperand - secondOperand;
      break;
    case '*':
      result = firstOperand * secondOperand;
      break;
    case '/':
      result = firstOperand / secondOperand;
      break;
    default:
      return;
  }

  display.value = result;
  currentInput = '';
  operator = '';
  firstOperand = result;

}

function percentage() {
  if(currentInput) {
    currentInput = parseFloat(currentInput / 100).toString();
    display.value = currentInput;
  }
}

function toggleSign() {
  if(currentInput) {
    currentInput = parseFloat(currentInput * -1).toString();
    display.value = currentInput;
  }
}