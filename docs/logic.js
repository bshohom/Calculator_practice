// Global variable to store the current random number
let currentNumber = null;
let startTime = null;
let timerInterval = null;
const scores = []; // Array to track scores and times
const nums = [];

function checkRepeats(newNum) {
  if (nums.includes(newNum)){
    console.log(`${newNum} not added due to repeat.`);
    return true;
  } else {
    if (nums.length === 7) {
      let deleted = nums.shift(); // Remove the oldest element if queue size exceeds 3
      console.log(`${deleted} removed from record`)
    }
    nums.push(newNum)
    console.log(`${newNum} added.`);

    return false;
  };
  
}

/**
 * Start the timer
 */
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime)/10) / 100; // Elapsed time in seconds with decimals
    document.getElementById('timer').textContent = elapsed.toFixed(2); // Display 3 decimal places
  }, 10); // Update every 10 milliseconds
}

/**
 * Stop the timer and return elapsed time
 */
function stopTimer() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime)/10) / 100;
  return elapsed;
}

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
  let newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  if (newNumber == Math.floor(newNumber/10) * 10) {
    console.log(`${newNumber} replaced`);
    newNumber = generateRandomNumber(digits);

  }

  if (checkRepeats(newNumber)) {
    newNumber = generateRandomNumber(digits);
  };
  

  // Example: basic random integer generation
  return newNumber;
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

  // Restart the timer
  clearInterval(timerInterval);
  startTimer();
}




/**
 * 3. Check user guess
 */
function checkGuess() {
  const userGuess = parseInt(document.getElementById('square-guess').value, 10);

  // actual square
  const correctAnswer = currentNumber * currentNumber;
  let resultMessage = '';
  let correct = false;
  let elapsedTime = null; // Declare elapsedTime outside the if block

  if (userGuess === correctAnswer) {
    resultMessage = `Correct! ${currentNumber} squared is ${correctAnswer}.`;
    elapsedTime = stopTimer(); // Only stop the timer when the answer is correct
    correct = true;

    // Store the result in scores array only if the guess is correct
    scores.push({
      number: currentNumber,
      guess: userGuess,
      correct: correct,
      time: elapsedTime
    });
  } else {
    resultMessage = `Nope, Try again.`;
  }

  document.getElementById('result-message').textContent = resultMessage;
}


/**
 * 4. Reset to start over
 */
function resetGame() {
  setRandomNumber();
}

/**
 * Download scoresheet as CSV
 */
function downloadScoresheet() {
  const csvContent = [
    'Number,Guess,Correct,Time',
    ...scores.map(score => 
      `${score.number},${score.guess},${score.correct ? 'Yes' : 'No'},${score.time}`
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  // Generate a timestamp
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14); // e.g., "20241229123456"
  const filename = `scoresheet_${timestamp}.csv`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
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

  // Download scoresheet button
  document.getElementById('download-scoresheet-btn').addEventListener('click', downloadScoresheet);

  // Add global keypress event listener
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      // Check the answer when Enter is pressed
      checkGuess();
    } else if (event.key.toLowerCase() === 'r') {
      // Reset the game when R is pressed
      resetGame();
    }
  });
};
