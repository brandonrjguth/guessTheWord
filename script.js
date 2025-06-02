let availableCards = [];
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let currentRound = 1;
let passesLeft = 2; // Initialize passes left for the round
let timer;
let timeLeft = 60;

const newGameBtn = document.getElementById('new-game-btn');
const passWarningElement = document.getElementById('pass-warning');
const gameArea = document.getElementById('game-area');
const cardElement = document.getElementById('card');
const mainWordElement = document.getElementById('main-word');
const forbiddenWordsElement = document.getElementById('forbidden-words');
const timerElement = document.getElementById('timer');
const timeLeftElement = document.getElementById('time-left');
const passBtn = document.getElementById('pass-btn');
const gotItBtn = document.getElementById('got-it-btn');
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');
const roundTransitionArea = document.getElementById('round-transition-area');
const roundMessageElement = document.getElementById('round-message');
const startNextRoundBtn = document.getElementById('start-next-round-btn');
const gameOverArea = document.getElementById('game-over-area');
const finalScoreElement = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');

newGameBtn.addEventListener('click', startGame);
passBtn.addEventListener('click', handlePass); // Change event listener to handlePass
gotItBtn.addEventListener('click', handleGotIt);
playAgainBtn.addEventListener('click', startGame);
startNextRoundBtn.addEventListener('click', startNextRound);


function startGame() {
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    currentRound = 1;
    updateScoreDisplay();
    gameOverArea.classList.add('hidden');
    roundTransitionArea.classList.add('hidden');
    newGameBtn.classList.add('hidden');
    gameArea.classList.remove('hidden');
    colorOptionsContainer.classList.add('hidden'); // Hide color options grid
    colorPickerBtn.classList.add('hidden'); // Hide color picker button
    startRound();
}

function startRound() {
    availableCards = [...cards]; // Reset available cards for the round
    timeLeft = 60;
    timeLeftElement.textContent = timeLeft;
    roundTransitionArea.classList.add('hidden');
    gameArea.classList.remove('hidden');
    passesLeft = 2; // Reset passes left at the start of a round
    passBtn.disabled = false; // Enable the pass button
    passWarningElement.classList.add('hidden'); // Hide warning message
    drawCard();
    startTimer();
}

function drawCard() {
    if (availableCards.length === 0) {
        // No more cards in this round, end the round
        endRound();
        return;
    }
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const currentCard = availableCards.splice(randomIndex, 1)[0];
    // Ensure the card is in the initial hidden state before starting the transition
    cardElement.style.opacity = 0;
    cardElement.style.transform = 'scale(0.9)';


    // Wait for a brief moment to ensure the initial state is applied, then change content and animate in
    setTimeout(() => {
        displayCard(currentCard);
        // Add visible class to animate in the new card
        cardElement.classList.add('card-visible');
    }, 50); // Short delay to allow initial state to apply before content change

    // After the content is displayed, trigger the animation to visible state
    setTimeout(() => {
        cardElement.style.opacity = 1;
        cardElement.style.transform = 'scale(1)';
    }, 100); // Delay to allow content to update before animating
}

function displayCard(card) {
    mainWordElement.textContent = card.mainWord;
    forbiddenWordsElement.innerHTML = '';
    card.forbiddenWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        forbiddenWordsElement.appendChild(li);
    });
}

function handlePass() {
    if (passesLeft > 0) {
        passesLeft--;
        passWarningElement.classList.add('hidden'); // Hide warning on successful pass
        drawCard();
        if (passesLeft === 0) {
            passWarningElement.textContent = "You have no passes left this round.";
            passWarningElement.classList.remove('hidden');
            passBtn.disabled = true; // Disable the pass button after the second pass
        }
    }
    // If passesLeft is already 0, the button is disabled and the warning is shown, so do nothing.
}

function handleGotIt() {
    if (currentPlayer === 1) {
        player1Score++;
    } else {
        player2Score++;
    }
    updateScoreDisplay();
    drawCard();
}

function updateScoreDisplay() {
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endRound();
        }
    }, 1000);
}

function endRound() {
    clearInterval(timer);
    gameArea.classList.add('hidden');
    roundTransitionArea.classList.remove('hidden');

    if (currentRound < 2 || (currentRound === 2 && currentPlayer === 1)) {
        // Move to next player or next round
        if (currentPlayer === 1) {
            currentPlayer = 2;
            roundMessageElement.textContent = `Player 1 scored ${player1Score} points this round! Player 2's turn is next!`;
        } else {
            currentPlayer = 1;
            currentRound++;
            if (currentRound <= 2) {
                roundMessageElement.textContent = `Player 2 scored ${player2Score} points this round! Starting Round ${currentRound} for Player 1!`;
            } else {
                endGame();
                return; // Exit to prevent showing transition area before game over
            }
        }
    } else {
        endGame();
        return; // Exit to prevent showing transition area before game over
    }
}

function startNextRound() {
    startRound();
}

function endGame() {
    gameArea.classList.add('hidden');
    roundTransitionArea.classList.add('hidden');
    gameOverArea.classList.remove('hidden');
    finalScoreElement.innerHTML = `Game Over! Final Scores:<br><br>Player 1: ${player1Score} points<br>Player 2: ${player2Score} points`;
}

// Color Picker Functionality
const colorPickerBtn = document.getElementById('color-picker-btn');
const colorOptionsContainer = document.getElementById('color-options');
const root = document.documentElement;

const colorPalettes = [
    { // Purple Palette
        primary: '#4527A0',
        secondary: '#7E57C2',
        warning: '#B39DDB',
        danger: '#E53935',
        background: '#EDE7F6'
    },
    { // Blue Palette
        primary: '#1565C0',
        secondary: '#42A5F5',
        warning: '#90CAF9',
        danger: '#EF5350',
        background: '#E3F2FD'
    },
    { // Green Palette
        primary: '#388E3C',
        secondary: '#66BB6A',
        warning: '#A5D6A7',
        danger: '#EF5350',
        background: '#E8F5E9'
    },
    { // Red Palette
        primary: '#C62828',
        secondary: '#E57373',
        warning: '#EF9A9A',
        danger: '#B71C1C',
        background: '#FFEBEE'
    }
];

function populateColorOptions() {
    colorOptionsContainer.innerHTML = ''; // Clear existing options
    colorPalettes.forEach((palette, index) => {
        const colorDot = document.createElement('div');
        colorDot.classList.add('color-dot');
        colorDot.style.backgroundColor = palette.primary; // Use primary color for the dot
        colorDot.dataset.paletteIndex = index; // Store palette index
        colorDot.addEventListener('click', handleColorSelect);
        colorOptionsContainer.appendChild(colorDot);
    });
}

function handleColorSelect(event) {
    const selectedIndex = event.target.dataset.paletteIndex;
    const selectedPalette = colorPalettes[selectedIndex];

    // Update CSS variables
    root.style.setProperty('--primary-color', selectedPalette.primary);
    root.style.setProperty('--secondary-color', selectedPalette.secondary);
    root.style.setProperty('--warning-color', selectedPalette.warning);
    root.style.setProperty('--danger-color', selectedPalette.danger);
    root.style.setProperty('--background-color', selectedPalette.background);

    // Update color picker button color
    colorPickerBtn.style.backgroundColor = selectedPalette.primary;

    // Apply gradient text effect to relevant elements (excluding h1)
    applyGradientText('#main-word', selectedPalette.primary, selectedPalette.secondary);
    applyGradientText('#player1-score', selectedPalette.primary, selectedPalette.secondary);
    applyGradientText('#player2-score', selectedPalette.primary, selectedPalette.secondary);


    // Hide color options
    colorOptionsContainer.classList.add('hidden');
}

function applyGradientText(selector, color1, color2) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.style.backgroundImage = `linear-gradient(45deg, ${color1}, ${color2})`;
        element.style.webkitBackgroundClip = 'text';
        element.style.backgroundClip = 'text';
        element.style.color = 'transparent';
    });
}


// Toggle color options visibility
colorPickerBtn.addEventListener('click', () => {
    colorOptionsContainer.classList.toggle('hidden');
});

// Populate color options on load
populateColorOptions();


/*Card Cleanup


const fs = require('fs');

function removeDuplicateCards(cards, outputFile = 'unique_cards.txt') {
  const seen = new Set();
  const uniqueCards = cards.filter(card => {
    if (seen.has(card.mainWord)) return false;
    seen.add(card.mainWord);
    return true;
  });
  // Write each card as a single-line JSON object with a comma at the end of each line except the last
  const lines = uniqueCards.map((card, index) => {
    const json = JSON.stringify(card);
    return index < uniqueCards.length - 1 ? json + ',' : json;
  }).join('\n');
  fs.writeFileSync(outputFile, lines, 'utf8');
  console.log(`Unique cards written to ${outputFile} (one per line with commas)`);
  return uniqueCards;
}

function getCommaSeparatedMainWords(cards, outputFile = 'main_words.txt') {
  const csv = cards.map(card => card.mainWord).join(',');
  fs.writeFileSync(outputFile, csv, 'utf8');
  console.log(`Comma-separated main words written to ${outputFile}`);
  return csv;
}

// Example usage:
const uniqueCards = removeDuplicateCards(cards, 'unique_cards.txt');
getCommaSeparatedMainWords(uniqueCards, 'main_words.txt');*/
