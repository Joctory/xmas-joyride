const gameArea = document.getElementById("gameArea");
const countdownDiv = document.getElementById("countdown");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");
const scoreOverTimeCheckbox = document.getElementById("scoreOverTime");
const startMenu = document.getElementById("startMenu");
const startButton = document.getElementById("startButton");
const leaderboardFormdiv = document.getElementById("form-finish");
const leaderboardForm = document.getElementById("leaderboardForm");
let gameStarted = false;

let score = 0;
let speed = 2;
let playerX = 150;
const playerWidth = 30;
const playerHeight = 50;

const obstacles = [];
const coins = [];
let isDragging = false;
let isGameOver = false;
let animationId;
let obstacleInterval;
let coinInterval;
let scoreInterval;
const leaderboard = [];
let obstacleChangeInterval;
let obstacleSpawnRate = 2000; // Initial spawn rate in milliseconds

const obstacleTypes = ["obstacle-1", "obstacle-2", "obstacle-3", "obstacle-4", "obstacle-5"];
const coinSound = document.getElementById("coinSound");
const explosionSound = document.getElementById("explosionSound");
const backgroundMusic = document.getElementById("backgroundMusic");
const passThroughSound1 = document.getElementById("passThroughSound1");
const passThroughSound2 = document.getElementById("passThroughSound2");
const passThroughSound3 = document.getElementById("passThroughSound3");
const passThroughSound4 = document.getElementById("passThroughSound4");
const background = document.getElementById("background");
const countdownSound = new Audio("sound/countdown-sound.mp3");
const weak = new Audio("sound/weak.mp3");
const startSound = new Audio("sound/start-sound.mp3");
let backgroundPositionY = 0;
const laneChangeSound = document.getElementById("laneChangeSound");

function updatePlayerPosition() {
  // Ensure the player stays within the game area
  if (playerX < 0) playerX = 0;
  if (playerX > gameArea.clientWidth - playerWidth) playerX = gameArea.clientWidth - playerWidth;
  player.style.left = `${playerX}px`;
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";

  // Randomly select an obstacle type
  const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  obstacle.classList.add(obstacleType);

  const lane = Math.floor(Math.random() * 3);
  const x = lane * 100 + 35;
  obstacle.style.left = `${x}px`;
  obstacle.style.top = "-50px";
  obstacle.dataset.lane = lane;
  gameArea.appendChild(obstacle);
  obstacles.push(obstacle);
}

function createCoin() {
  const coin = document.createElement("div");
  coin.className = "coin";

  // Randomly select a coin type
  const coinTypes = ["gold", "silver", "bronze"];
  const randomCoinType = coinTypes[Math.floor(Math.random() * coinTypes.length)];
  coin.classList.add(`coin-${randomCoinType}`);

  // Set coin value based on type
  let coinValue;
  switch (randomCoinType) {
    case "gold":
      coinValue = 150;
      break;
    case "silver":
      coinValue = 100;
      break;
    case "bronze":
      coinValue = 50;
      break;
  }
  coin.dataset.value = coinValue;

  let lane, x, y;
  do {
    lane = Math.floor(Math.random() * 3);
    x = lane * 100 + 35;
    y = -20;
  } while (checkCoinOverlap(x, y));

  coin.style.left = `${x}px`;
  coin.style.top = `${y}px`;
  gameArea.appendChild(coin);
  coins.push(coin);
}

function checkCoinOverlap(x, y) {
  return obstacles.some((obstacle) => {
    const obstacleRect = obstacle.getBoundingClientRect();
    return x < obstacleRect.right && x + 20 > obstacleRect.left && y < obstacleRect.bottom && y + 20 > obstacleRect.top;
  });
}

function checkCollision(rect1, rect2) {
  return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}

function updateGame() {
  if (isGameOver) return;

  // Update background position based on speed
  backgroundPositionY += speed;
  background.style.backgroundPositionY = `${backgroundPositionY}px`;

  obstacles.forEach((obstacle, index) => {
    const top = parseInt(obstacle.style.top);
    obstacle.style.top = `${top + speed}px`;

    // Randomly change lane with a 0.5% chance per frame
    if (Math.random() < 0.005) {
      const currentLane = parseInt(obstacle.dataset.lane);
      const obstacleRect = obstacle.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();

      // Only change lanes if the obstacle is not too close to the player
      if (obstacleRect.bottom < playerRect.top - 150) {
        let newLane;

        if (currentLane === 0) {
          newLane = 1; // Can only move right
        } else if (currentLane === 2) {
          newLane = 1; // Can only move left
        } else {
          // In the middle lane, randomly choose left or right
          newLane = Math.random() < 0.5 ? 0 : 2;
        }

        const newX = newLane * 100 + 35;
        obstacle.style.left = `${newX}px`;
        obstacle.dataset.lane = newLane; // Update the stored lane

        // Add a smooth transition for lane changes
        obstacle.style.transition = "left 0.3s ease-in-out";
        setTimeout(() => {
          obstacle.style.transition = "";
        }, 300);
      }
    }

    if (top > gameArea.clientHeight) {
      gameArea.removeChild(obstacle);
      obstacles.splice(index, 1);
      playRandomPassThroughSound(); // Play random pass-through sound effect
    }
    if (checkCollision(player.getBoundingClientRect(), obstacle.getBoundingClientRect())) {
      gameOver();
    }
  });

  coins.forEach((coin, index) => {
    const top = parseInt(coin.style.top);
    coin.style.top = `${top + speed}px`;
    if (top > gameArea.clientHeight) {
      gameArea.removeChild(coin);
      coins.splice(index, 1);
    }
    // Update the collision detection part in the updateGame function
    if (checkCollision(player.getBoundingClientRect(), coin.getBoundingClientRect())) {
      gameArea.removeChild(coin);
      coins.splice(index, 1);
      score += parseInt(coin.dataset.value);
      coinSound.play(); // Play coin sound effect
    }
  });

  speed += 0.004;
  scoreElement.textContent = `Score: ${score}`;
  animationId = requestAnimationFrame(updateGame);
}

function playRandomPassThroughSound() {
  const sounds = [passThroughSound1, passThroughSound2, passThroughSound3, passThroughSound4];
  const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
  randomSound.play();
}

function setPlayerLane(x) {
  const laneWidth = gameArea.clientWidth / 3;
  const newLane = Math.max(0, Math.min(2, Math.floor(x / laneWidth)));
  const oldLane = Math.floor(playerX / laneWidth);

  //if (newLane !== oldLane) {
  //  laneChangeSound.play();
  //}

  playerX = Math.max(0, Math.min(gameArea.clientWidth - playerWidth, newLane * laneWidth + (laneWidth - playerWidth) / 2));
  updatePlayerPosition();
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startMenu.style.display = "none";
  document.getElementById("background").style.animationPlayState = "running";
  isGameOver = false;
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  speed = 2;
  obstacleSpawnRate = 2000; // Reset spawn rate
  setPlayerLane(gameArea.clientWidth / 2); // Set to middle lane using setPlayerLane
  obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));
  coins.forEach((coin) => gameArea.removeChild(coin));
  obstacles.length = 0;
  coins.length = 0;
  gameOverElement.style.display = "none";

  // Add countdown before starting the game
  countdownDiv.style.display = "block";

  let countdown = 3;
  const countdownInterval = setInterval(() => {
    countdownDiv.textContent = countdown;
    // Play countdown sound effect
    countdownSound.play();
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownDiv.textContent = "START";
      // Play a different sound effect for the start
      //startSound.play();
      setTimeout(() => {
        countdownDiv.style.display = "none";
        countdownDiv.textContent = "";
        backgroundMusic.play(); // Play background music
        updateGame();
        obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
        coinInterval = setInterval(createCoin, 3000);
        if (scoreOverTimeCheckbox.checked) {
          scoreInterval = setInterval(() => {
            score++;
            // Increase obstacle spawn rate every 10 seconds
            if (score % 20 === 0) {
              updateObstacleSpawnRate();
            }
          }, 100);
        }
      }, 1000); // Display "START" for 1 second before starting the game
    }
  }, 1000);
}

function gameOver() {
  gameStarted = false;
  isGameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(obstacleInterval);
  clearInterval(coinInterval);
  clearInterval(scoreInterval);

  backgroundMusic.pause(); // Stop background music
  backgroundMusic.currentTime = 0; // Reset music to start

  // Play explosion sound
  explosionSound.play();

  // Show explosion
  const explosion = document.getElementById("explosion");
  explosion.style.left = `${playerX - 35}px`;
  explosion.style.top = `${player.offsetTop - 30}px`;
  explosion.style.display = "block";

  // Hide explosion and show game over screen after animation
  setTimeout(() => {
    explosion.style.display = "none";
    gameOverElement.style.display = "flex";
    finalScoreElement.textContent = `Final Score: ${score}`;
    weak.play();
    showLeaderboardForm(score);
  }, 1500); // Adjust this time based on your explosion GIF duration
}

function showLeaderboardForm(newScore) {
  leaderboardFormdiv.style.display = "block";
  document.getElementById("leaderboardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const playerNameInput = document.getElementById("playerName");
    const playerName = playerNameInput.value;
    if (playerName) {
      updateLeaderboard(playerName, newScore);
      leaderboardFormdiv.style.display = "none";
      playerNameInput.value = ""; // Clear the input field
    }
  });
}

function updateLeaderboard(playerName, newScore) {
  leaderboard.push({ name: playerName, score: newScore });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 5) {
    leaderboard.length = 5; // Keep only top 5 scores
  }
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboardElement = document.getElementById("leaderboard");
  leaderboardElement.innerHTML = "<h2>Leaderboard</h2><ol></ol>";
  const leaderboardList = leaderboardElement.querySelector("ol");

  leaderboard.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(listItem);
  });
}

function updateObstacleSpawnRate() {
  obstacleSpawnRate = Math.max(500, obstacleSpawnRate - 100); // Decrease spawn rate, but not lower than 500ms
  clearInterval(obstacleInterval);
  obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
}

gameArea.addEventListener("mousedown", (e) => {
  if (!gameStarted) return;
  isDragging = true;
  const rect = gameArea.getBoundingClientRect();
  setPlayerLane(e.clientX - rect.left);
});

gameArea.addEventListener("mousemove", (e) => {
  if (!gameStarted) return;
  if (isDragging) {
    const rect = gameArea.getBoundingClientRect();
    setPlayerLane(e.clientX - rect.left);
  }
});

gameArea.addEventListener("mouseup", () => {
  isDragging = false;
});

gameArea.addEventListener("touchstart", (e) => {
  if (!gameStarted) return;
  isDragging = true;
  const rect = gameArea.getBoundingClientRect();
  setPlayerLane(e.touches[0].clientX - rect.left);
});

gameArea.addEventListener("touchmove", (e) => {
  if (!gameStarted) return;
  if (isDragging) {
    e.preventDefault();
    const rect = gameArea.getBoundingClientRect();
    setPlayerLane(e.touches[0].clientX - rect.left);
  }
});

gameArea.addEventListener("touchend", () => {
  isDragging = false;
});

restartButton.addEventListener("click", startGame);
startButton.addEventListener("click", startGame);

// Don't start the game immediately
// startGame();
document.addEventListener("DOMContentLoaded", function () {
  updatePlayerPosition();
});
