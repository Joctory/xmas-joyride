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

let countdownInterval; // Declare this at the top with other variables

// Variable to track coins collected
let goldCoinsCollected = 0;
let silverCoinsCollected = 0;
let bronzeCoinsCollected = 0;

let gameStarted = false;
let score = 0;
let speed = 2;
let playerX = 140;
const playerWidth = 54;
const playerHeight = 68;

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
let obstacleSpawnRate = 2000; // Initial spawn rate in milliseconds

const obstacleTypes = ["obstacle-1", "obstacle-2", "obstacle-3", "obstacle-4", "obstacle-5"];

// Delete
// const failed = new Audio("sound/failed.mp3");

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
let areSoundEffectsOn = true; // Assume sound effects are on by default
let isMusicOn = true; // Assuming this is the 'on' icon
let sounds = {}; // Object to hold all audio objects

// Global variable to hold the currently playing sound effect
let currentSoundEffect = null;

// Preload the sound effects when the page loads
function preloadSounds() {
  sounds.open = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/open.mp3"
  );
  sounds.close = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/close.mp3"
  );
  sounds.coinSound = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/coin-sound.mp3"
  );
  sounds.explosionSound = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/explosion-sound.mp3"
  );
  sounds.titleMusic = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/title.mp3"
  );
  sounds.backgroundMusic = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/ingame.mp3"
  );
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
  sounds.startSound = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/start-sound.mp3"
  );
  sounds.prize = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/prize.mp3"
  );
  sounds.scoreCount = new Audio(
    "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/score-count.mp3"
  );
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
  if (effectTick.style.display === "none" || effectTick.style.display === "") {
    areSoundEffectsOn = 1;
    setGameCookie("effect", 1);
    effectTick.style.display = "block"; // Show the tick image
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
    Math.min(
      gameArea.clientWidth - obstaclesWidth,
      lane * laneWidth + (laneWidth - obstaclesWidth) / 2
    )
  );
  obstacle.style.left = `${x}px`;
  obstacle.style.top = "-150px";
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
    return (
      x < obstacleRect.right &&
      x + 20 > obstacleRect.left &&
      y < obstacleRect.bottom &&
      y + 20 > obstacleRect.top
    );
  });
}

function checkCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function updateGame() {
  if (isGameOver) return;

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
    if (Math.random() < 0.002) {
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
        const newX = Math.max(
          0,
          Math.min(
            gameArea.clientWidth - obstaclesWidth,
            newLane * laneWidth + (laneWidth - obstaclesWidth) / 2
          )
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
    const coinType = coin.className.split("-")[1]; // Get the type of coin from its class

    // Update the collision detection part in the updateGame function
    if (checkCollision(player.getBoundingClientRect(), coin.getBoundingClientRect())) {
      gameArea.removeChild(coin);
      coins.splice(index, 1);
      score += parseInt(coin.dataset.value);
      coinElement.textContent = `+ ${coin.dataset.value}`;
      coinElement.classList.add("show", coinType);
      setTimeout(() => {
        coinElement.classList.remove("show", coinType);
      }, 800);
      playSoundEffect("coinSound");

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
    Math.min(
      gameArea.clientWidth - playerWidth,
      newLane * laneWidth + (laneWidth - playerWidth) / 2
    )
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
  HTPplayer.style.backgroundImage =
    "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player.png')";
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
  player.style.display = "block";
  HTPdiv.style.display = "none";
  startline.style.display = "block";
  player.style.display = "none";
  startMenu.style.display = "none";
  pauseButton.style.display = "none";

  driveXmas.classList.remove("entrance");
  driveXmasTitle.classList.remove("entrance");
  startline.classList.remove("started");
  finalScoreElement.classList.remove("scale");
  player.style.backgroundImage =
    "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player.png')";
  sounds.titleMusic.pause();
  setGameCookie("first", 1);
  drawBackground();
  gameStarted = true;
  gameStarting = true;
  isPaused = false;
  isGameOver = false;
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  speed = 2;
  obstacleSpawnRate = 2000; // Reset spawn rate
  obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));
  coins.forEach((coin) => gameArea.removeChild(coin));
  obstacles.length = 0;
  coins.length = 0;
  gameOverElement.style.display = "none";

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
  cancelAnimationFrame(animationId);
  clearInterval(obstacleInterval);
  clearInterval(coinInterval);
  clearInterval(scoreInterval);

  sounds.backgroundMusic.pause();

  // Play explosion sound
  playSoundEffect("explosionSound");

  // Get the current obstacle's lane
  const playerRect = player.getBoundingClientRect();
  const collidedObstacle = obstacles.find((obstacle) =>
    checkCollision(playerRect, obstacle.getBoundingClientRect())
  );

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
    finalScoreElement.textContent = `${score}`;

    // Display collected coins
    document.getElementById("goldCoinsSpan").textContent = goldCoinsCollected;
    document.getElementById("silverCoinsSpan").textContent = silverCoinsCollected;
    document.getElementById("bronzeCoinsSpan").textContent = bronzeCoinsCollected;

    showLeaderboardForm(score);
    explosion.style.display = "none";
    // Change player background image to player-crash.gif
    player.style.backgroundImage = "url('assets/player-crash.gif')";
  }, 1500); // Adjust this time based on your explosion GIF duration
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
  document.getElementById("leaderboardForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const playerName = playerNameInput.value;
    const playerEmail = playerEmailInput.value;
    if (playerName) {
      formLoader.style.display = "flex";
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
          formLoader.style.display = "none";
          submitError.style.display = "none";
          hidePreview(formfinish);
          playerNameInput.value = ""; // Clear the input field
          playerEmailInput.value = ""; // Clear the input field
          setGameCookie("name", playerName);
          setGameCookie("email", playerEmail);
        },
        error: function (xhr, status, error) {
          // Handle error response
          console.error(error);
          formLoader.style.display = "none";
          submitError.style.display = "block";
          alert("An error occurred while submitting the score.");
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

function closeForm() {
  const gameovermenu = document.querySelector(".gameOver-menu");
  gameovermenu.style.visibility = "hidden";
  hidePreview(formfinish);
  playSoundEffect("scoreCount");
  animateScore(score, () => {
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
        score++;
        // Increase obstacle spawn rate every 10 seconds
        if (score % 20 === 0) {
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
leaderboardButton.addEventListener("click", function () {
  const loaderoverlay = document.getElementById("leaderboard-overlay");
  const leaderboardInner = document.getElementById("leaderboardInner");
  const userEmail = getGameCookie("drive-game-email");
  loaderoverlay.style.display = "flex";
  let useremail = { user_email: userEmail };
  leaderboardInner.innerHTML = "";
  jQuery.ajax({
    type: "post",
    url: `${window.location.origin}/wp-admin/admin-ajax.php`,
    data: {
      action: "get_winner",
      data: useremail,
    },
    complete: function (response) {
      loaderoverlay.style.display = "none";
      // console.log(JSON.parse(response.responseText).data);
      leaderboardInner.innerHTML = JSON.parse(response.responseText).data;
    },
  });
  // winneriframe.src = "/christmas-joyride-leaderboard.html?gamemail=" + userEmail;
  // winneriframe.setAttribute("scrolling", "no");
  // winneriframe.style.overflow = "hidden";
});

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
    pauseGame();
  }
});

// Don't start the game immediately
document.addEventListener("DOMContentLoaded", function () {
  preloadSounds();
  checkOptions();
  updatePlayerPosition();
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
  if (gameStarted) {
    pauseMenu();
  }
});

// Detect if user not active
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (gameStarted) {
      pauseMenu();
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
        title: "Welcome to AXS Drive: Xmas Joyride!",
        description: "Before you start the game, here is some information you need to know",
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
        title: "AXS Car",
        description:
          "You need to deliver alot of presents,tap the lane or drag the car to change the lane",
        onNextClick: () => {
          closeButtonClickSound();
          playSoundEffect("passThroughSound1");
          htpdriver.moveNext();
        },
      },
    },
    {
      element: ".htp-obstacle",
      popover: {
        title: "Your Enemy",
        description: "These cars on the road are the one who slow down your delivery",
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
        title: "Careful!",
        description:
          "Be careful to avoid any other cars on the road, avoid them to prevent your delivery!",
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
        description:
          "The car crashed, means that you had failed your delivery, but it's ok let us continue!",
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
        description: "This is a bronze present which add additional 50 scores",
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
        description: "This is a silver present which add additional 100 scores",
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
        description: "This is a gold present which add additional 150 scores",
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
        description: "This is your scores, get the highest scores as you can!",
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
        description: "And that is all, go ahead and start your delivery to save the world.",
        onNextClick: () => {
          htpdriver.destroy();
          resetHTP();
          preStartGame();
        },
      },
    },
  ],
});
