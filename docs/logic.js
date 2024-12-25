// Global variable to store the current random number
let currentNumber = null;

/**
 * 1. RNG function: 
 *    You can modify this to experiment with seed-based RNG,
 *    time-based RNG, or any custom logic.
 */
function generateRandomNumber(digits) {
  // e.g. 2 digits => between 10 and 99
  //      3 digits => between 100 and 999
  //      4 digits => between 1000 and 9999
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  
  // Example: basic random integer generation
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 2. Update UI with new random number
 */
function setRandomNumber() {
  const digitSelector = document.getElementById('digit-selector');
  const selectedDigits = parseInt(digitSelector.value, 10);
  currentNumber = generateRandomNumber(selectedDigits);
  
  document.getElementById('random-number').textContent = currentNumber;
  document.getElementById('square-guess').value = '';
  document.getElementById('result-message').textContent = '';
}

/**
 * 3. Check user guess
 */
function checkGuess() {
  const userGuess = parseInt(document.getElementById('square-guess').value, 10);
  
  // actual square
  const correctAnswer = currentNumber * currentNumber;
  
  if (userGuess === correctAnswer) {
    document.getElementById('result-message').textContent = 
      `Correct! ${currentNumber} squared is ${correctAnswer}.`;
  } else {
    document.getElementById('result-message').textContent = 
      `Nope. Off by ${correctAnswer-userGuess}`;
  }
}

/**
 * 4. Reset to start over
 */
function resetGame() {
  setRandomNumber();
}

// Attach event listeners once DOM is loaded
window.onload = function() {
  // Generate the initial random number
  setRandomNumber();

  // On change of digit selector, automatically reset
  document.getElementById('digit-selector').addEventListener('change', setRandomNumber);

  // Check guess button
  document.getElementById('check-btn').addEventListener('click', checkGuess);

  // Reset button
  document.getElementById('reset-btn').addEventListener('click', resetGame);
};
