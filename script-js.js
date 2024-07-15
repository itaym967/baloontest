const levels = [
    { balloons: 6, sum: 10 },
    { balloons: 10, sum: 20 },
    { balloons: 12, sum: 30 },
    { balloons: 14, sum: 100 }
];

let currentLevel = 0;
let score = 0;
let selectedBalloons = [];
let startTime;

const colors = ['#FFFF00', '#00FFFF', '#FFC0CB', '#00FF00', '#FF69B4'];

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('background-music').play();
    startTime = new Date();
    updateTimer();
    setInterval(updateTimer, 1000);
    loadLevel();
}

function loadLevel() {
    const level = levels[currentLevel];
    document.getElementById('level-instruction').textContent = `מצא זוגות בלונים שסכומם ${level.sum}`;
    const balloonContainer = document.getElementById('balloons');
    balloonContainer.innerHTML = '';
    
    const numbers = generateNumbers(level.balloons, level.sum);
    for (let i = 0; i < level.balloons; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.textContent = numbers[i];
        balloon.onclick = () => selectBalloon(balloon);
        balloonContainer.appendChild(balloon);
    }
}

function generateNumbers(count, sum) {
    const numbers = [];
    for (let i = 0; i < count; i += 2) {
        let a = Math.floor(Math.random() * (sum - 1)) + 1;
        let b = sum - a;
        numbers.push(a, b);
    }
    return shuffleArray(numbers);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function selectBalloon(balloon) {
    if (selectedBalloons.includes(balloon)) return;
    
    selectedBalloons.push(balloon);
    balloon.style.opacity = '0.5';

    if (selectedBalloons.length === 2) {
        const sum = levels[currentLevel].sum;
        const value1 = parseInt(selectedBalloons[0].textContent);
        const value2 = parseInt(selectedBalloons[1].textContent);

        if (value1 + value2 === sum) {
            score++;
            document.getElementById('score').textContent = `ניקוד: ${score}`;
            selectedBalloons.forEach(b => b.style.visibility = 'hidden');
        } else {
            selectedBalloons.forEach(b => b.style.opacity = '1');
        }

        selectedBalloons = [];

        if (document.querySelectorAll('.balloon:not([style*="visibility: hidden"])').length === 0) {
            if (currentLevel < levels.length - 1) {
                document.getElementById('next-level').style.display = 'block';
            } else {
                endGame();
            }
        }
    }
}

function nextLevel() {
    currentLevel++;
    document.getElementById('next-level').style.display = 'none';
    loadLevel();
}

function endGame() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    document.getElementById('final-score').textContent = `ניקוד סופי: ${score}`;
    document.getElementById('player-name-display').textContent = document.getElementById('player-name').value;
    document.getElementById('background-music').pause();
}

function updateTimer() {
    const now = new Date();
    const diff = now - startTime;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('timer').textContent = `זמן: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById('start-game').onclick = startGame;
document.getElementById('next-level').onclick = nextLevel;
