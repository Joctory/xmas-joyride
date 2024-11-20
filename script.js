const gameArea = document.getElementById("gameArea");
const countdownDiv = document.getElementById("countdown");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");
const startMenu = document.getElementById("startMenu");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseBtn");
const leaderboardFormdiv = document.getElementById("formfinish");
const leaderboardForm = document.getElementById("leaderboardForm");
const pauseModal = document.getElementById("pauseModal");
// Options
const musicButton = document.getElementById("music-setting");
const effectButton = document.getElementById("effect-setting");
// Add event listeners for leaderboard modal
const leaderboardButton = document.getElementById("leaderboardButton");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeButton = document.getElementById("leaderboardClose");
// Add event listeners for how to play modal
const howtoplayButton = document.getElementById("howtoplayButton");
const howtoplayModal = document.getElementById("howtoplayModal");
const howtoplayClose = document.getElementById("howtoplayClose");
// Add event listeners for credit modal
const creditButton = document.getElementById("creditButton");
const creditModal = document.getElementById("creditModal");
const creditClose = document.getElementById("creditClose");
const overlay = document.getElementById("overlay");

let gameStarted = false;
let score = 0;
let speed = 2;
let playerX = 140;
const playerWidth = 40;
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
const failed = new Audio("sound/failed.mp3");
const landsounds1 = new Audio("sound/change1.mp3");
const landsounds2 = new Audio("sound/change2.mp3");

// Variable to track the pause state
let isPaused = false;

// Canvas Background
let backgroundPositionY = 0;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
backgroundImage.src = "assets/road.png"; // Your background image

let yOffset = 0;

// Sound Effect
let areSoundEffectsOn = true; // Assume sound effects are on by default
let isMusicOn = true; // Assuming this is the 'on' icon
let sounds = {}; // Object to hold all audio objects

// Global variable to hold the currently playing sound effect
let currentSoundEffect = null;

// Preload the sound effects when the page loads
function preloadSounds() {
  sounds.coinSound = new Audio("/sound/coin-sound.mp3");
  sounds.explosionSound = new Audio("/sound/explosion-sound.mp3");
  sounds.titleMusic = new Audio("/sound/title.mp3");
  sounds.backgroundMusic = new Audio("/sound/ingame.mp3");
  sounds.passThroughSound1 = new Audio("/sound/pass-through-sound1.mp3");
  sounds.passThroughSound2 = new Audio("/sound/pass-through-sound2.mp3");
  sounds.passThroughSound3 = new Audio("/sound/pass-through-sound3.mp3");
  sounds.passThroughSound4 = new Audio("/sound/pass-through-sound4.mp3");
  sounds.countdownSound = new Audio("/sound/countdown-sound.mp3");
  sounds.startSound = new Audio("/sound/start-sound.mp3");
  sounds.laneChangeSound = new Audio("/sound/lane-change-sound.mp3");
}

// Function to check settings
function checkOptions(option) {
  let musicSetting = getGameCookie("drive-game-music");
  let effectSetting = getGameCookie("drive-game-effect");
  let firstvisit = getGameCookie("drive-game-first");

  // Check if cookies are null and set them to true if so
  if (musicSetting === "unset") {
    musicSetting = 1; // Set to true
    setGameCookie("music", musicSetting);
  }

  if (effectSetting === "unset") {
    effectSetting = 1; // Set to true
    setGameCookie("effect", effectSetting);
  }

  if (firstvisit === "unset") {
    firstvisit = 0; // Set to true
    setGameCookie("first", firstvisit);
  }

  // Set music and sound effects based on cookie values
  isMusicOn = musicSetting; // Assuming 1 means true
  areSoundEffectsOn = effectSetting; // Assuming 1 means true

  // Update UI elements accordingly
  const musicTick = document.getElementById("music-tick");
  const effectTick = document.getElementById("effect-tick");

  musicTick.style.display = isMusicOn ? "block" : "none"; // Show or hide music tick
  effectTick.style.display = areSoundEffectsOn ? "block" : "none"; // Show or hide effect tick

  // Play music if enabled
  if (isMusicOn) {
    playMusic(); // Play music if the music setting is enabled
  }
}

// Function to toggle sound effects
function toggleSoundIcon() {
  const effectTick = document.getElementById("effect-tick");
  if (effectTick.style.display === "none" || effectTick.style.display === "") {
    areSoundEffectsOn = true;
    setGameCookie("effect", 1);
    effectTick.style.display = "block"; // Show the tick image
  } else {
    areSoundEffectsOn = false;
    setGameCookie("effect", 0);
    effectTick.style.display = "none"; // Hide the tick image
  }
}

// Function to play a sound effect
function playSoundEffect(soundKey) {
  const sound = sounds[soundKey];

  if (sound && areSoundEffectsOn) {
    // Set the new sound as the current sound effect
    currentSoundEffect = sound;

    sound.play().catch((error) => {
      console.error(`Error playing sound: ${soundKey}`, error);
    });
  }
}

// Options
function toggleMusicSetting() {
  const musicTick = document.getElementById("music-tick");
  if (musicTick.style.display === "none" || musicTick.style.display === "") {
    isMusicOn = true;
    playMusic();
    setGameCookie("music", 1);
    musicTick.style.display = "block"; // Show the tick image
  } else {
    isMusicOn = false;
    sounds.titleMusic.pause(); // Stop the music
    setGameCookie("music", 0);
    musicTick.style.display = "none"; // Hide the tick image
  }
}

// Function to play music
function playMusic() {
  if (isMusicOn) {
    sounds.titleMusic.loop = true; // Optional: Loop the music
    sounds.titleMusic.currentTime = 0;
    sounds.titleMusic.play();
  }
}

function drawBackground() {
  // Clear the canvas before drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background image at the current yOffset
  ctx.drawImage(backgroundImage, 0, yOffset, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, yOffset - canvas.height, canvas.width, canvas.height);

  // Update the yOffset to create the upward movement
  yOffset += speed; // Move the background upward based on speed
  if (yOffset >= canvas.height) {
    yOffset -= canvas.height; // Adjust offset for seamless looping
  }
}

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

  const laneWidth = gameArea.clientWidth / 3;
  const lane = Math.floor(Math.random() * 3);
  const x = lane * laneWidth + (laneWidth - 30) / 2;
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

  let laneWidth, lane, x, y;
  do {
    laneWidth = gameArea.clientWidth / 3;
    lane = Math.floor(Math.random() * 3);
    x = lane * laneWidth + (laneWidth - 30) / 2;
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
  drawBackground();

  obstacles.forEach((obstacle, index) => {
    const top = parseInt(obstacle.style.top);
    obstacle.style.top = `${top + speed}px`;

    // Randomly change lane with a 0.1% chance per frame
    if (Math.random() < 0.003) {
      const currentLane = parseInt(obstacle.dataset.lane);
      const obstacleRect = obstacle.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();

      // Only change lanes if the obstacle is not too close to the player
      if (obstacleRect.bottom < playerRect.top - 200) {
        let newLane;

        if (currentLane === 0) {
          newLane = 1; // Can only move right
        } else if (currentLane === 2) {
          newLane = 1; // Can only move left
        } else {
          // In the middle lane, randomly choose left or right
          newLane = Math.random() < 0.5 ? 0 : 2;
        }

        const laneWidth = gameArea.clientWidth / 3; // Calculate lane width based on gameArea width
        const newX = newLane * laneWidth + (laneWidth - 30) / 2;
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
      playSoundEffect("coinSound");
    }
  });

  speed += 0.003; //Speed Adjust
  scoreElement.textContent = `Score: ${score}`;
  animationId = requestAnimationFrame(updateGame);
}

function playRandomPassThroughSound() {
  const passsounds = [
    sounds.passThroughSound1,
    sounds.passThroughSound2,
    sounds.passThroughSound3,
    sounds.passThroughSound4,
  ];
  const randomSound = passsounds[Math.floor(Math.random() * passsounds.length)];
  if (areSoundEffectsOn) {
    randomSound.play();
  }
}

function setPlayerLane(x) {
  const laneWidth = gameArea.clientWidth / 3;
  const newLane = Math.max(0, Math.min(2, Math.floor(x / laneWidth)));
  const oldLane = Math.floor(playerX / laneWidth);

  // if (newLane !== oldLane) {
  // }

  playerX = Math.max(
    0,
    Math.min(gameArea.clientWidth - playerWidth, newLane * laneWidth + (laneWidth - playerWidth) / 2)
  );
  updatePlayerPosition();
}

function startGame() {
  if (gameStarted) return;
  sounds.titleMusic.pause();
  startMenu.style.display = "none";
  pauseButton.style.display = "none";
  setGameCookie("first", 1);
  drawBackground();
  gameStarted = true;
  isPaused = false;
  isGameOver = false;
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  speed = 2;
  obstacleSpawnRate = 2000; // Reset spawn rate
  player.classList.add("player-init");
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
    // Play countdown sound effect;
    playSoundEffect("countdownSound");
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownDiv.textContent = "START";
      setTimeout(() => {
        countdownDiv.style.display = "none";
        countdownDiv.textContent = "";
        if (isMusicOn) {
          sounds.backgroundMusic.play();
        }
        gameArea.classList.remove("disabled");
        updateGame();
        obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
        coinInterval = setInterval(createCoin, 3000);
        scoreInterval = setInterval(() => {
          score++;
          // Increase obstacle spawn rate every 10 seconds
          if (score % 20 === 0) {
            updateObstacleSpawnRate();
          }
        }, 100);
        pauseButton.style.display = "block";
        player.classList.remove("player-init");
      }, 1000);
    }
  }, 1000);
}

function restartGame() {
  hidePreview(pauseModal);
  startGame();
}

function gameOver() {
  gameStarted = false;
  isGameOver = true;
  cancelAnimationFrame(animationId);
  clearInterval(obstacleInterval);
  clearInterval(coinInterval);
  clearInterval(scoreInterval);

  sounds.backgroundMusic.pause();

  // Play explosion sound
  playSoundEffect("explosionSound");

  // Get the current obstacle's lane
  const playerRect = player.getBoundingClientRect();
  const collidedObstacle = obstacles.find((obstacle) => checkCollision(playerRect, obstacle.getBoundingClientRect()));

  if (collidedObstacle) {
    const obstacleLane = parseInt(collidedObstacle.dataset.lane);
    const laneWidth = gameArea.clientWidth / 3;
    playerX = obstacleLane * laneWidth + (laneWidth - playerWidth) / 2; // Set player position to the obstacle's lane
    updatePlayerPosition(); // Update the player's position on the screen
  }

  // Disable touch in game area
  gameArea.classList.add("disabled");

  // Show explosion
  const explosion = document.getElementById("explosion");
  explosion.style.left = `${playerX - 30}px`;
  explosion.style.top = `${player.offsetTop - 30}px`;
  explosion.style.display = "block";

  // Hide explosion and show game over screen after animation
  setTimeout(() => {
    gameOverElement.style.display = "flex";
    finalScoreElement.textContent = `Final Score: ${score}`;
    showLeaderboardForm(score);
    explosion.style.display = "none";
  }, 1500); // Adjust this time based on your explosion GIF duration
}

function showLeaderboardForm(newScore) {
  showPreview(formfinish);
  document.getElementById("leaderboardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const playerNameInput = document.getElementById("playerName");
    const playerEmailInput = document.getElementById("playerEmail");
    const playerName = playerNameInput.value;
    const playerEmail = playerEmailInput.value;
    if (playerName) {
      hidePreview(formfinish);
      $.ajax({
        url: "https://www.axs.com.sg/drive-winner-form/", // Replace with the path to your PHP file
        type: "POST",
        data: {
          winner_name: playerName,
          winner_email: playerEmail,
          winner_score: newScore,
          submit_winner: true, // Indicate that the form is submitted
        },
        success: function (response) {
          alert("Score submitted successfully!");
          playerNameInput.value = ""; // Clear the input field
          playerEmailInput.value = ""; // Clear the input field
        },
        error: function (xhr, status, error) {
          // Handle error response
          console.error(error);
          // alert("An error occurred while submitting the score.");
        },
      });
    }
  });
}

function updateObstacleSpawnRate() {
  obstacleSpawnRate = Math.max(500, obstacleSpawnRate - 100); // Decrease spawn rate, but not lower than 500ms
  clearInterval(obstacleInterval);
  obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
}

// Pop Up Container
function showPreview(div) {
  playSoundEffect("select");
  removePopClass();
  div.classList.add("active");
  div.classList.remove("closed");
  overlay.style.display = "block";
}

function hidePreview(div) {
  playSoundEffect("close");
  removePopClass();
  div.classList.remove("active");
  div.classList.add("closed");
  overlay.style.display = "none";
}

function removePopClass() {
  document.querySelectorAll(".pop-container").forEach((container) => {
    // Remove classes from the pop-container itself
    container.classList.remove("closed", "active");
  });
}

function mainMenu() {
  startMenu.style.display = "flex";
  gameOverElement.style.display = "none";
  hidePreview(formfinish);
  hidePreview(pauseModal);
  playMusic();
}

// Function to pause the game
function pauseMenu() {
  showPreview(pauseModal);
  togglePause();
}

function unpauseMenu() {
  hidePreview(pauseModal);
  togglePause();
}

function pauseGame() {
  if (!isPaused) {
    isPaused = true; // Set the game state to paused
    gameStarted = false;
    cancelAnimationFrame(animationId); // Stop the game loop
    clearInterval(obstacleInterval); // Stop obstacle creation
    clearInterval(coinInterval); // Stop coin creation
    clearInterval(scoreInterval); // Stop score updates
    sounds.backgroundMusic.pause(); // Pause background music
  }
}

// Function to unpause the game
function unpauseGame() {
  if (isPaused) {
    isPaused = false; // Set the game state to running
    gameStarted = true;
    updateGame(); // Restart the game loop
    if (isMusicOn) {
      sounds.backgroundMusic.play(); // Resume background music
    }

    // Restart intervals
    obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
    coinInterval = setInterval(createCoin, 3000);
    scoreInterval = setInterval(() => {
      score++;
      // Increase obstacle spawn rate every 10 seconds
      if (score % 20 === 0) {
        updateObstacleSpawnRate();
      }
    }, 100);
  }
}

// Function to toggle pause/unpause
function togglePause() {
  if (isPaused) {
    unpauseGame(); // Call unpause function if currently paused
  } else {
    pauseGame(); // Call pause function if currently running
  }
}

// Set Cookies
function setGameCookie(cname, cvalue) {
  document.cookie = `drive-game-${cname}=${cvalue}; path=/;`;
}

// Get Cookies
function getGameCookie(cname) {
  const cookies = document.cookie.split("; ");
  let cvalue = "unset"; // Default to "unset"

  cookies.forEach((cookie) => {
    const [name, value] = cookie.split("=");
    if (name === cname) {
      cvalue = parseInt(value); // Set cvalue only if the cookie matches
    }
  });
  return cvalue;
}

// Leaderboard Modal
leaderboardButton.addEventListener("click", function () {
  document.getElementById("winner-iframe").src = "leaderboard.html";
  leaderboardModal.style.display = "flex";
});

// How to play Modal

// Credit Modal

// game-btn to handle the click and touch events
document.querySelectorAll(".game-button").forEach((button) => {
  const toggleActiveClass = () => {
    button.classList.toggle("active"); // Toggle the active class
  };

  button.addEventListener("click", toggleActiveClass); // Handle click event
  button.addEventListener("touchstart", toggleActiveClass); // Handle touch event
});

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

startButton.addEventListener("click", startGame);

// Add an event listener for a key press to control the player movement
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;
  if (e.key === "ArrowLeft") {
    // Move left
    setPlayerLane(playerX - 100); // Adjust the lane to the left
  } else if (e.key === "ArrowRight") {
    // Move right
    setPlayerLane(playerX + 100); // Adjust the lane to the right
  }
});

// Add an event listener for a key press to toggle pause
document.addEventListener("keydown", (e) => {
  if (e.key === "p") {
    // Press 'p' to toggle pause/unpause
    togglePause();
  }
});

// function scaleMain() {
//   const slotMain = document.querySelector(".gameArea-background");
//   const scaleFactor = Math.min(window.innerWidth / 300); // Adjust these values as needed
//   console.log(window.innerWidth);
//   console.log(scaleFactor);
//   slotMain.style.transform = `scale(${Math.min(scaleFactor, 1)})`; // Cap scale at 1
// }

// // Call the function on load and resize
// window.addEventListener("resize", scaleMain);

// // Hide loading indicator when the page is fully loaded
// window.addEventListener("load", function () {
//   scaleMain();
// });

// Don't start the game immediately
document.addEventListener("DOMContentLoaded", function () {
  preloadSounds();
  checkOptions();
  updatePlayerPosition();
});
