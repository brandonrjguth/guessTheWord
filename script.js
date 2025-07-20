let availableCards = [];
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let currentRound = 1;
let passesLeft = 2;
let timer;
let timeLeft = 60;
let currentAnimation = null;

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

// Event Listeners
newGameBtn.addEventListener('click', startGame);
passBtn.addEventListener('click', handlePass);
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
    startRound();
}

function startRound() {
    availableCards = [...cards];
    timeLeft = 60;
    timeLeftElement.textContent = timeLeft;
    timeLeftElement.style.color = 'var(--text)';
    timeLeftElement.style.animation = '';
    roundTransitionArea.classList.add('hidden');
    gameArea.classList.remove('hidden');
    passesLeft = 2;
    passBtn.disabled = false;
    passWarningElement.classList.add('hidden');
    drawCard();
    startTimer();
}

function drawCard() {
    if (availableCards.length === 0) {
        endRound();
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const currentCard = availableCards.splice(randomIndex, 1)[0];

    // Remove previous animation classes
    cardElement.classList.remove('slide-in', 'slide-out');
    
    // Start slide-out animation if card is visible
    if (cardElement.style.opacity !== '0') {
        cardElement.classList.add('slide-out');
        setTimeout(() => {
            updateCardContent(currentCard);
        }, 300);
    } else {
        updateCardContent(currentCard);
    }
}

function updateCardContent(card) {
    displayCard(card);
    cardElement.classList.remove('slide-out');
    cardElement.classList.add('slide-in');
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
        passWarningElement.classList.add('hidden');
        
        // Slide out current card
        cardElement.classList.add('slide-out');
        
        setTimeout(() => {
            if (passesLeft === 0) {
                passWarningElement.textContent = "No passes left this round!";
                passWarningElement.classList.remove('hidden');
                passBtn.disabled = true;
            }
            drawCard();
        }, 300);
    }
}

function handleGotIt() {
    showScoreAnimation();
    updateScore();
    cardElement.classList.add('slide-out');
    
    setTimeout(() => {
        drawCard();
    }, 300);
}

function showScoreAnimation() {
    const scoreIndicator = document.createElement('div');
    scoreIndicator.textContent = '+1';
    scoreIndicator.style.position = 'absolute';
    scoreIndicator.style.color = 'var(--warning)';
    scoreIndicator.style.fontSize = '2rem';
    scoreIndicator.style.fontWeight = 'bold';
    scoreIndicator.style.pointerEvents = 'none';
    scoreIndicator.style.zIndex = '1000';
    
    const scoreElement = currentPlayer === 1 ? player1ScoreElement : player2ScoreElement;
    const rect = scoreElement.getBoundingClientRect();
    scoreIndicator.style.left = `${rect.left}px`;
    scoreIndicator.style.top = `${rect.top}px`;
    
    document.body.appendChild(scoreIndicator);
    
    scoreIndicator.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-50px) scale(1.5)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = () => scoreIndicator.remove();
}

function updateScore() {
    const scoreElement = currentPlayer === 1 ? player1ScoreElement : player2ScoreElement;
    if (currentPlayer === 1) {
        player1Score++;
    } else {
        player2Score++;
    }
    updateScoreDisplay();
    
    scoreElement.style.animation = 'pop 0.3s ease-out';
    scoreElement.addEventListener('animationend', () => {
        scoreElement.style.animation = '';
    }, { once: true });
}

function updateScoreDisplay() {
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
}

function startTimer() {
    const timerBar = document.createElement('div');
    timerBar.classList.add('timer-bar');
    timerElement.innerHTML = '';
    timerElement.appendChild(timerBar);
    
    timerBar.style.animation = 'none';
    timerBar.offsetHeight;
    timerBar.style.animation = 'countdown 60s linear forwards';
    currentAnimation = timerBar.style.animation;

    timer = setInterval(() => {
        timeLeft--;
        timeLeftElement.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerBar.style.background = 'linear-gradient(90deg, var(--danger), var(--warning))';
            timeLeftElement.style.color = 'var(--danger)';
            timeLeftElement.style.animation = 'pulse 1s infinite';
        }
        
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
                return;
            }
        }
    } else {
        endGame();
        return;
    }
}

function startNextRound() {
    startRound();
}

function endGame() {
    gameArea.classList.add('hidden');
    roundTransitionArea.classList.add('hidden');
    gameOverArea.classList.remove('hidden');
    
    const winner = player1Score > player2Score ? 'Player 1' : player1Score < player2Score ? 'Player 2' : 'It\'s a tie';
    const winnerMessage = player1Score === player2Score ? '' : ` - ${winner} wins!`;
    
    finalScoreElement.innerHTML = `
        <h3>Game Over!${winnerMessage}</h3>
        <div class="final-scores">
            <div>Player 1: ${player1Score} points</div>
            <div>Player 2: ${player2Score} points</div>
        </div>
    `;
}
