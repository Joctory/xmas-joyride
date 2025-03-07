/* Developed by Joel Lee @ Joasis Web */
const gameArea = document.getElementById("gameArea");
const countdownDiv = document.getElementById("countdown");
const tipsDiv = document.getElementById("tips");
const player = document.getElementById("player");
const startline = document.getElementById("startline");
const scoreElement = document.getElementById("score");
const coinElement = document.getElementById("coin");
const gameOverElement = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");
const explosion = document.getElementById("explosion");
const startMenu = document.getElementById("startMenu");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseBtn");
const leaderboardFormdiv = document.getElementById("formfinish");
const leaderboardForm = document.getElementById("leaderboardForm");
const pauseModal = document.getElementById("pauseModal");
const formLoader = document.getElementById("form-loader");
const submitError = document.getElementById("submit-error");
const driveXmas = document.getElementById("drive-xmas");
const driveXmasTitle = document.getElementById("game-menu-main");
let previousLane = null; // Variable to track the previous lane
// Options
const musicButton = document.getElementById("music-setting");
const effectButton = document.getElementById("effect-setting");
// Add event listeners for leaderboard modal
const leaderboardButton = document.getElementById("leaderboardButton");
const leaderboardModal = document.getElementById("leaderboardModal");
const closeButton = document.getElementById("leaderboardClose");
const winneriframe = document.getElementById("winner-iframe");
// Add event listeners for how to play modal
const howtoplayButton = document.getElementById("howtoplayButton");
const howtoplayModal = document.getElementById("howtoplayModal");
const howtoplayClose = document.getElementById("howtoplayClose");
// Add event listeners for credit modal
const creditButton = document.getElementById("creditButton");
const creditModal = document.getElementById("creditModal");
const creditClose = document.getElementById("creditClose");
const overlay = document.getElementById("overlay");
// Input Form
const playerNameInput = document.getElementById("playerName");
const playerEmailInput = document.getElementById("playerEmail");
// How to play Section
const HTPdiv = document.getElementById("htp-div");
const HTPgameArea = document.getElementById("htpgameArea");
const HTPplayer = document.getElementById("htpplayer");
const HTPexplosion = document.getElementById("htpexplosion");
//  Init Game Loading
// Init Game Var
var gameInitLoader = document.getElementById("game-init-loader");
const initLoader = document.querySelector(".init-loader");

// Set Game FPS
let lastFrameTime = 0; // Variable to track the last frame time
const targetFPS = 120; // Set your target FPS
const frameDuration = 1000 / targetFPS; // Calculate the duration of each frame in milliseconds

let countdownInterval; // Declare this at the top with other variables

// let newfinalScore = 0;
// Variable to track coins collected
let goldCoinsCollected = 0;
let silverCoinsCollected = 0;
let bronzeCoinsCollected = 0;

let gameStarted = false;
let speed = 2;
let playerX = 140;
const playerWidth = 54;
const playerHeight = 68;
let gametime;

const obstacles = [];
const coins = [];
const obstaclesWidth = 45;
const obstaclesHeight = 72;
let isDragging = false;
let isGameOver = false;
let animationId;
let obstacleInterval;
let coinInterval;
let scoreInterval;
const leaderboard = [];
let obstacleChangeInterval;
let obstacleSpawnRate = 2500; // Initial spawn rate in milliseconds
let gameStartTimestamp;
let gameEndTimestamp;

const gameNonce = document.getElementById("game-nonce"); // Add this element to your HTML
let currentNonce = null;
let isNonceInitialized = false;

const obstacleTypes = ["obstacle-1", "obstacle-2", "obstacle-3", "obstacle-4", "obstacle-5"];

let gameScoreData = {
  newfinalScore: 0,
  score: 0,
};

// Variable to track the pause state
let isPaused = false;

// Canvas Background
let backgroundPositionY = 0;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
backgroundImage.src = "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/road.png"; // Your background image

let yOffset = 0;

// Sound Effect
let areSoundEffectsOn = false; // Assume sound effects are on by default
let isMusicOn = false; // Assuming this is the 'on' icon
let sounds = {}; // Object to hold all audio objects

// Global variable to hold the currently playing sound effect
let currentSoundEffect = null;

// Preload the sound effects when the page loads
function preloadSounds() {
  sounds.open = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/open.mp3");
  sounds.close = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/close.mp3");
  sounds.coinSound = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/coin-sound.mp3");
  sounds.explosionSound = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/explosion-sound.mp3"
  );
  sounds.titleMusic = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/title.mp3");
  sounds.backgroundMusic = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/ingame.mp3");
  sounds.passThroughSound1 = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound1.mp3"
  );
  sounds.passThroughSound2 = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound2.mp3"
  );
  sounds.passThroughSound3 = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound3.mp3"
  );
  sounds.passThroughSound4 = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound4.mp3"
  );
  sounds.countdownSound = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/countdown-sound.mp3"
  );
  sounds.startSound = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/start-sound.mp3");
  sounds.prize = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/prize.mp3");
  sounds.scoreCount = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/score-count.mp3");
  sounds.laneChangeSound = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/lane-change-sound.mp3"
  );
}

// Function to check settings
function checkOptions(option) {
  let musicSetting = getGameCookie("drive-game-music");
  let effectSetting = getGameCookie("drive-game-effect");
  let firstvisit = getGameCookie("drive-game-first");
  let acceptCookies = getGameCookie("drive-game-cookies");

  // Check if cookies are null and set them to true if so
  if (musicSetting === "unset") {
    musicSetting = 0; // Set to true
    setGameCookie("music", musicSetting);
  }

  if (effectSetting === "unset") {
    effectSetting = 0; // Set to true
    setGameCookie("effect", effectSetting);
  }

  if (firstvisit === "unset") {
    firstvisit = 0; // Set to true
    setGameCookie("first", firstvisit);
  }

  if (acceptCookies === "unset") {
    acceptCookies = 0; // Set to true
    setGameCookie("cookies", acceptCookies);
  }

  // Set music and sound effects based on cookie values
  isMusicOn = musicSetting; // Assuming 1 means true
  areSoundEffectsOn = effectSetting; // Assuming 1 means true

  // Update UI elements accordingly
  const musicTick = document.getElementById("music-tick");
  const effectTick = document.getElementById("effect-tick");

  if (isMusicOn == 0) {
    musicTick.style.display = "none";
  }

  if (areSoundEffectsOn == 0) {
    effectTick.style.display = "none";
  }
}

// Function to toggle sound effects
function toggleSoundIcon() {
  const effectTick = document.getElementById("effect-tick");
  if (effectTick.style.display === "none") {
    areSoundEffectsOn = 1;
    setGameCookie("effect", 1);
    effectTick.style.display = "block"; // Show the tick image
  } else if (effectTick.style.display === "") {
    areSoundEffectsOn = 1;
    setGameCookie("effect", 0);
    effectTick.style.display = "none"; // Show the tick image
  } else {
    areSoundEffectsOn = 0;
    setGameCookie("effect", 0);
    effectTick.style.display = "none"; // Hide the tick image
  }
}

// Function to play a sound effect
function playSoundEffect(soundKey) {
  const sound = sounds[soundKey];

  if (sound && areSoundEffectsOn == 1) {
    // Set the new sound as the current sound effect
    currentSoundEffect = sound;

    sound.play().catch((error) => {
      console.error(`Error playing sound: ${soundKey}`, error);
    });
  }
}

// Function to play sound
function playButtonClickSound() {
  sounds.open.currentTime = 0; // Reset sound to start
  playSoundEffect("open");
}

// Function to play sound
function closeButtonClickSound() {
  sounds.close.currentTime = 0; // Reset sound to start
  playSoundEffect("close");
}

// Options
function toggleMusicSetting() {
  const musicTick = document.getElementById("music-tick");
  if (musicTick.style.display === "none") {
    isMusicOn = true;
    playMusic();
    setGameCookie("music", 1);
    musicTick.style.display = "block"; // Show the tick image
  } else if (musicTick.style.display === "") {
    isMusicOn = false;
    playMusic();
    setGameCookie("music", 0);
    musicTick.style.display = "none"; // Show the tick image
  } else {
    isMusicOn = false;
    sounds.titleMusic.pause(); // Stop the music
    setGameCookie("music", 0);
    musicTick.style.display = "none"; // Hide the tick image
  }
}

// Function to play music
function playMusic(div) {
  if (isMusicOn == 1) {
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
  // Add a smooth transition for lane changes
  player.style.transition = "left 0.3s ease-in-out";
  setTimeout(() => {
    player.style.transition = "";
  }, 300);
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.className = "obstacle";

  // Randomly select an obstacle type
  const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  obstacle.classList.add(obstacleType);

  const laneWidth = gameArea.clientWidth / 3;
  const lane = Math.floor(Math.random() * 3);
  const x = Math.max(
    0,
    Math.min(gameArea.clientWidth - obstaclesWidth, lane * laneWidth + (laneWidth - obstaclesWidth) / 2)
  );
  obstacle.style.left = `${x}px`;
  obstacle.style.top = `-${gameArea.clientHeight}px`;
  obstacle.dataset.lane = lane;
  obstacle.dataset.previousLane = lane; // Store the initial lane
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
    x = lane * laneWidth + (laneWidth - 40) / 2;
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
  // Adjust the collision detection by adding a margin
  const margin = 30; // Increase this value to reduce sensitivity
  return (
    rect1.left < rect2.right - margin && // Check if the left edge of rect1 is to the left of the right edge of rect2
    rect1.right > rect2.left + margin && // Check if the right edge of rect1 is to the right of the left edge of rect2
    rect1.top < rect2.bottom - margin && // Check if the top edge of rect1 is above the bottom edge of rect2
    rect1.bottom > rect2.top + margin // Check if the bottom edge of rect1 is below the top edge of rect2
  );
}

function updateGame(currentTime) {
  if (isGameOver) return;

  // Calculate the time since the last frame
  const deltaTime = currentTime - lastFrameTime;

  // Only update the game if enough time has passed
  if (deltaTime >= frameDuration) {
    lastFrameTime = currentTime; // Update the last frame time

    // Update background position based on speed
    drawBackground();

    obstacles.forEach((obstacle, index) => {
      const top = parseInt(obstacle.style.top);
      obstacle.style.top = `${top + speed}px`;

      // Get the current lane of the obstacle
      const currentLane = parseInt(obstacle.dataset.lane);
      const previousLane = parseInt(obstacle.dataset.previousLane);

      // Check if the obstacle is turning left or right
      if (currentLane !== previousLane) {
        if (currentLane < previousLane) {
          obstacle.style.animation = "carleft 0.3s ease-in-out forwards";
        } else {
          obstacle.style.animation = "carright 0.3s ease-in-out forwards";
        }

        // Reset the animation after it completes
        setTimeout(() => {
          obstacle.style.animation = "";
        }, 300);
      }

      // Update the previous lane for the next frame
      obstacle.dataset.previousLane = currentLane;

      // Randomly change lane with a 0.1% chance per frame
      if (Math.random() < 0.0009) {
        const currentLane = parseInt(obstacle.dataset.lane);
        const obstacleRect = obstacle.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        const laneChangeThreshold = gameScoreData.score > 1900 ? gameArea.clientHeight / 2 : 300; // Deduct more from playerRect.top if score > 2000

        // Only change lanes if the obstacle is not too close to the player
        if (obstacleRect.bottom < playerRect.top - laneChangeThreshold) {
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
          const newX = Math.max(
            0,
            Math.min(gameArea.clientWidth - obstaclesWidth, newLane * laneWidth + (laneWidth - obstaclesWidth) / 2)
          );
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
        //   playRandomPassThroughSound();
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
      const coinType = coin.className.split("-")[1]; // Get the type of coin from its class

      // Update the collision detection part in the updateGame function
      if (checkCollision(player.getBoundingClientRect(), coin.getBoundingClientRect())) {
        gameArea.removeChild(coin);
        coins.splice(index, 1);
        gameScoreData.score += parseInt(coin.dataset.value);
        coinElement.textContent = `+ ${coin.dataset.value}`;
        coinElement.classList.add("show", coinType);
        setTimeout(() => {
          coinElement.classList.remove("show", coinType);
        }, 800);
        //   playSoundEffect("coinSound");

        // Update coin collection counts
        if (coinType === "gold") {
          goldCoinsCollected++;
        } else if (coinType === "silver") {
          silverCoinsCollected++;
        } else if (coinType === "bronze") {
          bronzeCoinsCollected++;
        }
      }
    });

    speed += 0.003; //Speed Adjust
    scoreElement.textContent = `Score: ${gameScoreData.score}`;
  }

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
  if (areSoundEffectsOn == 1) {
    randomSound.play();
  }
}

function setPlayerLane(x) {
  const laneWidth = gameArea.clientWidth / 3;
  const newLane = Math.max(0, Math.min(2, Math.floor(x / laneWidth)));

  // Check if the lane has changed
  if (previousLane !== null && newLane !== previousLane) {
    if (newLane < previousLane) {
      player.classList.add("player-left");
      setTimeout(() => {
        player.classList.remove("player-left");
      }, 300);
    } else {
      player.classList.add("player-right");
      setTimeout(() => {
        player.classList.remove("player-right");
      }, 300);
    }
  }

  previousLane = newLane; // Update the previous lane

  playerX = Math.max(
    0,
    Math.min(gameArea.clientWidth - playerWidth, newLane * laneWidth + (laneWidth - playerWidth) / 2)
  );
  updatePlayerPosition();
}

function startHTP() {
  if (gameStarted) return;
  setGameCookie("cookies", 1);
  hidePreview(howtoplayModal);
  htpdriver.drive();
  player.style.display = "none";
  HTPdiv.style.display = "block";
  startline.style.display = "none";
  startMenu.style.display = "none";
}

function resetHTP() {
  HTPplayer.classList.remove("played");
  HTPplayer.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player.png')";
}

function preStartGame() {
  gameInitLoader.style.display = "flex";
  setTimeout(() => {
    gameInitLoader.style.display = "none";
    startGame();
  }, 2500);
}

function startGame() {
  if (gameStarted) return;
  stopGame();
  gameScoreData = {
    newfinalScore: 0,
    score: 0,
  };
  player.style.display = "block";
  HTPdiv.style.display = "none";
  startline.style.display = "block";
  player.style.display = "none";
  startMenu.style.display = "none";
  pauseButton.style.display = "none";
  submitError.style.display = "none";

  driveXmas.classList.remove("entrance");
  driveXmasTitle.classList.remove("entrance");
  startline.classList.remove("started");
  finalScoreElement.classList.remove("scale");
  player.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player.png')";
  sounds.titleMusic.pause();
  setGameCookie("first", 1);
  drawBackground();
  gameStarted = true;
  gameStarting = true;
  isPaused = false;
  isGameOver = false;
  gameScoreData.score = 0;
  gametime = 0;
  scoreElement.textContent = `Score: ${gameScoreData.score}`;
  speed = 2;
  obstacleSpawnRate = 1800; // Reset spawn rate
  obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));
  coins.forEach((coin) => gameArea.removeChild(coin));
  obstacles.length = 0;
  coins.length = 0;
  gameOverElement.style.display = "none";

  requestNewSecureKey(); // Request the secure key

  // Check for existing user details
  const userName = getGameCookie("drive-game-name");
  const userEmail = getGameCookie("drive-game-email");
  if (userName !== "unset") {
    playerNameInput.value = userName;
  }
  if (userEmail !== "unset") {
    playerEmailInput.value = userEmail;
  }

  setPlayerLane(gameArea.clientWidth / 2); // Set to middle lane using setPlayerLane
  player.classList.add("player-init");

  let countdown = 3;
  countdownInterval = setInterval(() => {
    // Add countdown before starting the game
    countdownDiv.style.display = "flex";
    tipsDiv.style.display = "block";
    countdownDiv.textContent = countdown;
    // Play countdown sound effect;
    playSoundEffect("countdownSound");
    countdown--;
    player.style.display = "block";
    if (countdown < 0) {
      clearInterval(countdownInterval);
      countdownDiv.textContent = "START";
      setTimeout(() => {
        if (gameStarted) {
          countdownDiv.style.display = "none";
          tipsDiv.style.display = "none";
          countdownDiv.textContent = "";
          gameStarting = false;
          if (isMusicOn == 1) {
            sounds.backgroundMusic.loop = true; // Optional: Loop the music
            sounds.backgroundMusic.currentTime = 0;
            sounds.backgroundMusic.play();
          }
          startline.classList.add("started");
          gameArea.classList.remove("disabled");
          gameStartTimestamp = Math.floor(Date.now() / 1000); // Store the timestamp when the game starts
          updateGame();
          obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
          obstacleSpawnRate = Math.max(1900, Math.min(3000, 2200 * (750 / gameArea.clientHeight)));
          coinInterval = setInterval(createCoin, 3000);
          scoreInterval = setInterval(() => {
            gameScoreData.score++;
            gametime++;
            // Increase obstacle spawn rate every 7 seconds
            if (gameScoreData.score % 70 === 0) {
              updateObstacleSpawnRate();
            }
          }, 100);
          pauseButton.style.display = "block";
          player.classList.remove("player-init");
        }
      }, 1000);
    }
  }, 1000);

  // Reset coin collected counts
  goldCoinsCollected = 0;
  silverCoinsCollected = 0;
  bronzeCoinsCollected = 0;
}

// Function to fully stop the game
function stopGame() {
  // Stop the game loop
  cancelAnimationFrame(animationId);

  // Clear all intervals
  clearInterval(obstacleInterval);
  clearInterval(coinInterval);
  clearInterval(scoreInterval);

  // Pause the background music
  sounds.backgroundMusic.pause();

  // Reset game state variables
  gameStarted = false;
  gameStarting = false;
  isGameOver = true;
  isPaused = false;

  // Remove all obstacles and coins from the game area
  obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));
  coins.forEach((coin) => gameArea.removeChild(coin));
  obstacles.length = 0;
  coins.length = 0;

  // Hide game over elements
  countdownDiv.textContent = "";
  gameOverElement.style.display = "none";
}

function initStart() {
  const visitCheck = getGameCookie("drive-game-first");
  let cookiesCheck = getGameCookie("drive-game-cookies");

  // Play music if enabled
  if (isMusicOn == 1) {
    playMusic(); // Play music if the music setting is enabled
  }

  if (cookiesCheck == 0) {
    showPreview(howtoplayModal);
  } else {
    if (visitCheck == 0) {
      startHTP();
    } else {
      preStartGame();
    }
  }
}

function restartGame() {
  hidePreview(pauseModal);
  startGame();
}

function gameOver() {
  gameStarted = false;
  gameStarting = false;
  isGameOver = true;
  gameEndTimestamp = Math.floor(Date.now() / 1000);
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
  explosion.style.left = `${playerX - 26}px`;
  explosion.style.top = `${player.offsetTop - 20}px`;
  explosion.style.display = "block";

  // Hide explosion and show game over screen after animation
  setTimeout(() => {
    gameOverElement.style.display = "flex";
    scoreElement.textContent = `Score: ???`;
    finalScoreElement.textContent = `${gameScoreData.score}`;

    // Display collected coins
    document.getElementById("goldCoinsSpan").textContent = goldCoinsCollected;
    document.getElementById("silverCoinsSpan").textContent = silverCoinsCollected;
    document.getElementById("bronzeCoinsSpan").textContent = bronzeCoinsCollected;

    endGame(gameScoreData.score);
    showLeaderboardForm(gameScoreData.score);
    explosion.style.display = "none";

    // Change player background image to player-crash.gif
    player.style.backgroundImage =
      "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player-crash.gif')";
  }, 1500); // Adjust this time based on your explosion GIF duration
}

function endGame() {
  // Set the final score
  gameScoreData.newfinalScore = gameScoreData.score; // Assume this function calculates the score

  // Freeze the object to prevent changes
  Object.freeze(gameScoreData);
}

function animateScore(finalScore, callback) {
  let currentScore = 0;
  const increment = Math.ceil(finalScore / 100); // Adjust the increment value for smoother animation
  const duration = 1000; // Duration in milliseconds
  const intervalTime = 50; // Time between increments in milliseconds
  const totalSteps = duration / intervalTime;

  const scoreInterval = setInterval(() => {
    currentScore += increment;
    if (currentScore >= finalScore) {
      currentScore = finalScore; // Ensure it doesn't exceed the final score
      clearInterval(scoreInterval); // Stop the interval
      if (callback) callback(); // Call the callback function if provided
    }
    finalScoreElement.textContent = `${currentScore}`; // Update the displayed score
  }, totalSteps);
}

function showLeaderboardForm(newScore) {
  showPreview(formfinish);
  playerNameInput.maxLength = "12";
}

// Add this function to check if ajax_object exists
function checkAjaxObject() {
  if (typeof ajax_object === "undefined") {
    console.error("AJAX object not properly initialized");
    return false;
  }
  return true;
}

// Function to request a new nonce
function requestNewNonce() {
  if (!checkAjaxObject()) return;

  jQuery.ajax({
    type: "post",
    url: ajax_object.ajax_url,
    data: {
      action: "get_new_nonce",
    },
    success: function (response) {
      if (response.success) {
        currentNonce = response.data.nonce;
        isNonceInitialized = true;
        // console.log("New nonce received:", currentNonce); // For debugging
      }
    },
    error: function (xhr, status, error) {
      console.error("Nonce request failed:", error);
    },
  });
}

// Function to initialize nonce
function initializeNonce() {
  if (!checkAjaxObject()) return;

  jQuery.ajax({
    type: "post",
    url: ajax_object.ajax_url,
    data: {
      action: "get_new_nonce",
    },
    success: function (response) {
      if (response.success) {
        currentNonce = response.data.nonce;
        isNonceInitialized = true;
        // console.log("Nonce initialized:", currentNonce);
      }
    },
    error: function (xhr, status, error) {
      console.error("Initial nonce request failed:", error);
      // Retry after 5 seconds
      setTimeout(initializeNonce, 5000);
    },
  });
}

function gameCalculate() {
  const gameData =
    gameStartTimestamp +
    "." +
    gameEndTimestamp +
    "." +
    goldCoinsCollected +
    "." +
    silverCoinsCollected +
    "." +
    bronzeCoinsCollected;

  return gameData;
}

// Function to request a new secure key
function requestNewSecureKey() {
  jQuery.ajax({
    type: "post",
    url: ajax_object.ajax_url,
    data: {
      action: "get_secure_key",
    },
    success: function (response) {
      if (response.success) {
        currentSecureKey = response.data.key; // Store the new key
        // console.log("New secure key received:", currentSecureKey); // For debugging
      }
    },
    error: function (xhr, status, error) {
      console.error("Secure key request failed:", error);
    },
  });
}

// Modify your submitFormButton function
function submitFormButton() {
  if (!checkAjaxObject()) return;
  if (!isNonceInitialized) {
    // console.log("No nonce available, requesting new one..."); // For debugging
    initializeNonce();
    alert("Please try again in a moment.");
    return;
  }

  const playerID = gameCalculate();

  const loaderoverlay = document.getElementById("form-loader");
  const playerName = playerNameInput.value;
  const playerEmail = playerEmailInput.value;

  // Basic input validation
  if (!playerName || !playerEmail) {
    alert("Please fill in all details.");
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(playerEmail)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Name validation - allow only alphanumeric and spaces
  const nameRegex = /^[a-zA-Z0-9\s]{1,12}$/;
  if (!nameRegex.test(playerName)) {
    alert("Name can only contain letters, numbers, and spaces (max 12 characters).");
    return;
  }

  // Set game end timestamp
  loaderoverlay.style.display = "flex";
  const winnerData = {
    winner_name: playerName,
    winner_email: playerEmail,
    winner_id: playerID,
    winner_score: gameScoreData.newfinalScore,
    submit_winner: true,
  };

  jQuery.ajax({
    type: "post",
    url: ajax_object.ajax_url,
    data: {
      action: "save_winner",
      security: currentNonce,
      secure_key: currentSecureKey,
      data: winnerData,
    },
    complete: function (response) {
      loaderoverlay.style.display = "none";
      const result = JSON.parse(response.responseText);

      if (result.success && result.data === "success") {
        formLoader.style.display = "none";
        submitError.style.display = "none";
        closeForm();
        playerNameInput.value = "";
        playerEmailInput.value = "";
        setGameCookie("name", playerName);
        setGameCookie("email", playerEmail);

        // Invalidate the used nonce and secure key
        currentNonce = null;
        isNonceInitialized = false;
        currentSecureKey = null; // Invalidate the secure key

        submitError.style.display = "none";

        // Request a new nonce for next submission
        requestNewNonce();
      } else {
        formLoader.style.display = "none";
        submitError.style.display = "block";
        submitError.textContent = result.data || "An error occurred. Please try again.";
      }

      // console.log(response);
    },
  });
}

// Add nonce refresh setup
function setupNonceRefresh() {
  // Refresh nonce every 14 minutes (before 15-minute expiration)
  setInterval(function () {
    requestNewNonce();
  }, 14 * 60 * 1000);
}

// Modify your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  preloadSounds();
  checkOptions();
  updatePlayerPosition();
  initializeNonce();
});

function updateObstacleSpawnRate() {
  obstacleSpawnRate = Math.max(500, obstacleSpawnRate - 80); // Decrease spawn rate, but not lower than 500ms
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

function closeForm() {
  const gameovermenu = document.querySelector(".gameOver-menu");
  gameovermenu.style.visibility = "hidden";
  hidePreview(formfinish);
  playSoundEffect("scoreCount");
  animateScore(gameScoreData.score, () => {
    finalScoreElement.classList.add("scale");
    playSoundEffect("prize");
    confetti({
      particleCount: 400,
      spread: 250,
      origin: { y: 0.4 },
    });
    gameovermenu.style.visibility = "visible";
  });
}

function removePopClass() {
  document.querySelectorAll(".pop-container").forEach((container) => {
    // Remove classes from the pop-container itself
    container.classList.remove("closed", "active");
  });
}

function mainMenu() {
  startMenu.style.display = "flex";
  driveXmas.classList.add("entrance");
  driveXmasTitle.classList.add("entrance");
  gameOverElement.style.display = "none";
  clearInterval(countdownInterval); // Clear the countdown interval if it's running
  stopGame();
  playMusic();
}

function backtomainMenu() {
  stopGame(); // Stop the game before showing the main menu
  clearInterval(countdownInterval); // Clear the countdown interval if it's running
  startMenu.style.display = "flex";
  driveXmas.classList.add("entrance");
  driveXmasTitle.classList.add("entrance");
  gameOverElement.style.display = "none";
  hidePreview(formfinish);
  hidePreview(pauseModal);
  playMusic();
}

// Function to pause the game
function pauseMenu() {
  showPreview(pauseModal);
  pauseGame();
}

function unpauseMenu() {
  hidePreview(pauseModal);
  unpauseGame();
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
    if (gameStarting) {
      restartGame();
    } else {
      isPaused = false; // Set the game state to running
      gameStarted = true;
      updateGame(); // Restart the game loop
      if (isMusicOn == 1) {
        sounds.backgroundMusic.play(); // Resume background music
      }

      // Restart intervals
      obstacleInterval = setInterval(createObstacle, obstacleSpawnRate);
      coinInterval = setInterval(createCoin, 3000);
      scoreInterval = setInterval(() => {
        gameScoreData.score++;
        // Increase obstacle spawn rate every 70 seconds
        if (gameScoreData.score % 70 === 0) {
          updateObstacleSpawnRate();
        }
      }, 100);
    }
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
      cvalue = value; // Set cvalue only if the cookie matches
    }
  });
  return cvalue;
}

// Leaderboard Modal
function getThursdayOfCurrentWeek() {
  const today = new Date(); // Get today's date
  const day = today.getDay(); // Get the current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

  // Calculate how many days to subtract to get to the last Thursday
  const daysToSubtract = (day + 3) % 7; // 3 is the offset to get to Thursday (4)

  // Create a new date object for this week's Thursday
  const thursday = new Date(today);
  thursday.setDate(today.getDate() - daysToSubtract); // Subtract the days to get to Thursday

  // Format the date as YYYY-MM-DD
  const year = thursday.getFullYear();
  const month = String(thursday.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const dayOfMonth = String(thursday.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`; // Return formatted date
}

function getNextThursday() {
  const today = new Date();
  const day = today.getDay(); // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

  // Calculate days to next Thursday
  let daysToNextThursday = 4 - day;

  // If today is Thursday or we've passed Thursday, add 7 days to get to next Thursday
  if (daysToNextThursday <= 0) {
    daysToNextThursday += 7;
  }

  // Create new date for next Thursday
  const nextThursday = new Date(today);
  nextThursday.setDate(today.getDate() + daysToNextThursday);

  // Format the date as YYYY-MM-DD
  const year = nextThursday.getFullYear();
  const month = String(nextThursday.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(nextThursday.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}

leaderboardButton.addEventListener("click", function () {
  const loaderoverlay = document.getElementById("leaderboard-overlay");
  const leaderboardInner = document.getElementById("leaderboardInner");
  const userEmail = getGameCookie("drive-game-email");
  const ThursdayDate = getThursdayOfCurrentWeek();
  const NextThursdayDate = getNextThursday();
  loaderoverlay.style.display = "flex";
  let useremail = {
    user_email: userEmail,
    current_thursday: ThursdayDate,
    next_thursday: NextThursdayDate,
  };
  leaderboardInner.innerHTML = "";
  jQuery.ajax({
    type: "post",
    url: ajax_object.ajax_url, // Use localized URL
    data: {
      action: "get_winner",
      data: useremail,
      security: currentNonce, // Include the nonce here
    },
    complete: function (response) {
      loaderoverlay.style.display = "none";
      leaderboardInner.innerHTML = JSON.parse(response.responseText).data;
    },
  });
});

// game-btn to handle the click and touch events
document.querySelectorAll(".game-button").forEach((button) => {
  const toggleActiveClass = () => {
    button.classList.toggle("active"); // Toggle the active class
  };

  button.addEventListener("click", toggleActiveClass); // Handle click event
  button.addEventListener("touchstart", toggleActiveClass); // Handle touch event
});

// Mouse Event
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

// Touch Event
let startX; // Variable to track the initial touch position

// Existing touch event listeners
gameArea.addEventListener("touchstart", (e) => {
  if (!gameStarted) return;

  const touch = e.touches[0]; // Get the first touch point
  const bottomAreaThreshold = window.innerHeight * 0.2; // Adjust this value as needed (20% of the screen height)

  // Check if the touch is in the bottom area of the screen
  if (touch.clientY > window.innerHeight - bottomAreaThreshold) {
    isDragging = true; // Only set dragging to true if in the bottom area
    const rect = gameArea.getBoundingClientRect();
    setPlayerLane(touch.clientX - rect.left);
  } else {
    // Store the initial touch position for swipe detection
    startX = touch.clientX;
  }
});

gameArea.addEventListener("touchmove", (e) => {
  if (!gameStarted) return;

  const touch = e.touches[0]; // Get the current touch point
  const bottomAreaThreshold = window.innerHeight * 0.2; // Adjust this value as needed (20% of the screen height)

  // Check if the touch is in the bottom area of the screen
  if (touch.clientY > window.innerHeight - bottomAreaThreshold) {
    if (isDragging) {
      e.preventDefault();
      const rect = gameArea.getBoundingClientRect();
      setPlayerLane(touch.clientX - rect.left);
    }
  }
});

gameArea.addEventListener("touchend", (e) => {
  if (!gameStarted) return;

  const touch = e.changedTouches[0]; // Get the touch that ended
  const bottomAreaThreshold = window.innerHeight * 0.2; // Adjust this value as needed (20% of the screen height)

  // Check if the touch is in the bottom area of the screen
  if (touch.clientY <= window.innerHeight - bottomAreaThreshold) {
    const endX = touch.clientX; // Get the final touch position
    const swipeThreshold = 10; // Minimum distance to consider it a swipe

    // Determine swipe direction
    if (startX - endX > swipeThreshold) {
      setPlayerLane(playerX - 100); // Adjust the lane to the left
    } else if (endX - startX > swipeThreshold) {
      setPlayerLane(playerX + 100); // Adjust the lane to the right
    }
  }

  isDragging = false; // Reset dragging state on touch end
});

// Add an event listener for a key press to control the player movement
// document.addEventListener("keydown", (e) => {
//   if (!gameStarted) return;
//   if (e.key === "ArrowLeft") {
//     // Move left
//     setPlayerLane(playerX - 100); // Adjust the lane to the left
//   } else if (e.key === "ArrowRight") {
//     // Move right
//     setPlayerLane(playerX + 100); // Adjust the lane to the right
//   }
// });

// Add an event listener for a key press to toggle pause
document.addEventListener("keydown", (e) => {
  if (e.key === "p") {
    pauseGame();
  }
});

// Add event listener to all game buttons
document.querySelectorAll(".game-button").forEach((button) => {
  button.addEventListener("click", playButtonClickSound);
});

window.addEventListener("load", function () {
  setTimeout(() => {
    gameInitLoader.style.display = "none";
    driveXmas.classList.add("entrance");
    driveXmasTitle.classList.add("entrance");
  }, 3000);
});

// Check if user change window
window.addEventListener("blur", () => {
  if (document.hidden) {
    if (gameStarted) {
      pauseMenu();
    }
    if (isMusicOn != 0) {
      sounds.backgroundMusic.pause();
    }
  } else {
    if (gameStarted && isMusicOn != 0) {
      sounds.backgroundMusic.play();
    }
  }
});

// Detect if user not active
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (gameStarted) {
      pauseMenu();
    }
    if (isMusicOn != 0) {
      sounds.backgroundMusic.pause();
    }
  } else {
    if (gameStarted && isMusicOn != 0) {
      sounds.backgroundMusic.play();
    }
  }
});

// Check if user clicked back button
(function () {
  // Function to disable back navigation
  function disableBackNavigation() {
    // Push an initial state onto the history stack
    history.pushState(null, null, location.href);

    // Listen for popstate events
    window.onpopstate = function (event) {
      // Push another state to prevent going back
      history.pushState(null, null, location.href);
      if (gameStarted) {
        pauseMenu();
        history.pushState(null, null, location.href);
      } else {
        removePopClass();
        overlay.style.display = "none";
      }
    };
  }
  // Call the function on page load
  disableBackNavigation();
})();

// How to Play JS
const driver = window.driver.js.driver;

const htpdriver = driver({
  showProgress: false,
  allowClose: false,
  smoothScroll: true,
  popoverClass: "HTParea",
  nextBtnText: "Next",
  prevBtnText: "Previous",
  doneBtnText: "Start",
  steps: [
    {
      popover: {
        title: "Welcome to AXS Drive: Heart Racer!",
        description: "Your partner is waiting! Before you start the game, here is some information you need to know",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("passThroughSound3");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: "#htpplayer",
      popover: {
        title: "AXS Car a.k.a Your Car",
        description: "Late for your date! Tap left or right to change lanes and make it on time.",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("passThroughSound1");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: ".htp-drag-area",
      popover: {
        title: "Car Control",
        description: "You can also drag to change lanes",
        onNextClick: () => {
          closeButtonClickSound();
          htpdriver.moveNext();
        },
      },
    },
    {
      element: ".htp-swipe-area",
      popover: {
        title: "Car Control",
        description: "or swipe/tap a lane to switch.",
        onNextClick: () => {
          closeButtonClickSound();
          htpdriver.moveNext();
        },
      },
    },
    {
      element: ".htp-obstacle",
      popover: {
        title: "Your Enemy",
        description: "Every car and every delay is a blow to your romantic plans! So hurry up!",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("laneChangeSound");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: "#htp-car-crash-part",
      popover: {
        title: "Be Careful!",
        description: "What you should do? Dodge those cars! You don't want to be late for your date.",
        onNextClick: () => {
          closeButtonClickSound();
          document.querySelector(".driver-popover-navigation-btns").style.display = "none";
          HTPplayer.classList.add("played");
          // Show explosion
          setTimeout(() => {
            document.querySelector(".driver-popover-navigation-btns").style.display = "none";
            // Play explosion sound
            playSoundEffect("explosionSound");
            HTPexplosion.style.display = "block";
            setTimeout(() => {
              HTPexplosion.style.display = "none";
              // Change player background image to player-crash.gif
              HTPplayer.style.backgroundImage =
                "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player-crash.gif')";
              document.querySelector(".driver-popover-navigation-btns").style.display = "flex";
            }, 1800);
          }, 500);
          htpdriver.moveNext();
        },
      },
    },
    {
      element: "#htp-car-crash-part",
      popover: {
        title: "OH NO!",
        description: "A small detour! It's alright, you can still make it on time. Let's go!",
        onPrevClick: () => {
          resetHTP();
          htpdriver.movePrevious();
        },
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("coinSound");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: ".htp-coin-bronze",
      popover: {
        title: "Bronze Present",
        description: "This is a bronze giftbox that adds an additional 50 points.",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("coinSound");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: ".htp-coin-silver",
      popover: {
        title: "Silver Present",
        description: "This is a silver giftbox that adds an additional 100 points.",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("coinSound");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: ".htp-coin-gold",
      popover: {
        title: "Gold Present",
        description: "This is a gold giftbox that adds an additional 150 points.",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("scoreCount");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: "#score",
      popover: {
        title: "Score",
        description: "This is your 'Romance Score'! Aim for the highest score to impress your date.",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("prize");
          htpdriver.moveNext();
        },
      },
    },
    {
      popover: {
        title: "That's All",
        description: "And that's it! Now, get going and impress your date!",
        onNextClick: () => {
          htpdriver.destroy();
          resetHTP();
          preStartGame();
        },
      },
    },
  ],
});

// SUPRISE
let clickCount = 0;

driveXmas.addEventListener("click", function () {
  clickCount++;
  if (clickCount === 5) {
    gameArea.classList.add("makecoin");
  }
});
