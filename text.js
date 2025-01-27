const gameArea = document.getElementById("gameArea"),
  countdownDiv = document.getElementById("countdown"),
  tipsDiv = document.getElementById("tips"),
  player = document.getElementById("player"),
  startline = document.getElementById("startline"),
  scoreElement = document.getElementById("score"),
  coinElement = document.getElementById("coin"),
  gameOverElement = document.getElementById("gameOver"),
  finalScoreElement = document.getElementById("finalScore"),
  explosion = document.getElementById("explosion"),
  startMenu = document.getElementById("startMenu"),
  startButton = document.getElementById("startButton"),
  pauseButton = document.getElementById("pauseBtn"),
  leaderboardFormdiv = document.getElementById("formfinish"),
  leaderboardForm = document.getElementById("leaderboardForm"),
  pauseModal = document.getElementById("pauseModal"),
  formLoader = document.getElementById("form-loader"),
  submitError = document.getElementById("submit-error"),
  driveXmas = document.getElementById("drive-xmas"),
  driveXmasTitle = document.getElementById("game-menu-main");
let previousLane = null;
const musicButton = document.getElementById("music-setting"),
  effectButton = document.getElementById("effect-setting"),
  leaderboardButton = document.getElementById("leaderboardButton"),
  leaderboardModal = document.getElementById("leaderboardModal"),
  closeButton = document.getElementById("leaderboardClose"),
  winneriframe = document.getElementById("winner-iframe"),
  howtoplayButton = document.getElementById("howtoplayButton"),
  howtoplayModal = document.getElementById("howtoplayModal"),
  howtoplayClose = document.getElementById("howtoplayClose"),
  creditButton = document.getElementById("creditButton"),
  creditModal = document.getElementById("creditModal"),
  creditClose = document.getElementById("creditClose"),
  overlay = document.getElementById("overlay"),
  playerNameInput = document.getElementById("playerName"),
  playerEmailInput = document.getElementById("playerEmail"),
  HTPdiv = document.getElementById("htp-div"),
  HTPgameArea = document.getElementById("htpgameArea"),
  HTPplayer = document.getElementById("htpplayer"),
  HTPexplosion = document.getElementById("htpexplosion");
var gameInitLoader = document.getElementById("game-init-loader");
const initLoader = document.querySelector(".init-loader");
let lastFrameTime = 0;
const targetFPS = 120,
  frameDuration = 8.333333333333334;
let countdownInterval,
  goldCoinsCollected = 0,
  silverCoinsCollected = 0,
  bronzeCoinsCollected = 0,
  gameStarted = !1,
  speed = 2,
  playerX = 140;
const playerWidth = 54,
  playerHeight = 68;
let gametime;
const obstacles = [],
  coins = [],
  obstaclesWidth = 45,
  obstaclesHeight = 72;
let isDragging = !1,
  isGameOver = !1,
  animationId,
  obstacleInterval,
  coinInterval,
  scoreInterval;
const leaderboard = [];
let obstacleChangeInterval,
  obstacleSpawnRate = 2500,
  gameStartTimestamp,
  gameEndTimestamp;
const gameNonce = document.getElementById("game-nonce");
let currentNonce = null,
  isNonceInitialized = !1;
const obstacleTypes = ["obstacle-1", "obstacle-2", "obstacle-3", "obstacle-4", "obstacle-5"];
let gameScoreData = { newfinalScore: 0, score: 0 },
  isPaused = !1,
  backgroundPositionY = 0;
const canvas = document.getElementById("gameCanvas"),
  ctx = canvas.getContext("2d"),
  backgroundImage = new Image();
backgroundImage.src = "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/road.png";
let yOffset = 0,
  areSoundEffectsOn = !1,
  isMusicOn = !1,
  sounds = {},
  currentSoundEffect = null;
function preloadSounds() {
  (sounds.open = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/open.mp3")),
    (sounds.close = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/close.mp3")),
    (sounds.coinSound = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/coin-sound.mp3")),
    (sounds.explosionSound = new Audio(
      "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/explosion-sound.mp3"
    )),
    (sounds.titleMusic = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/title.mp3")),
    (sounds.backgroundMusic = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/ingame.mp3")),
    (sounds.passThroughSound1 = new Audio(
      "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound1.mp3"
    )),
    (sounds.passThroughSound2 = new Audio(
      "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound2.mp3"
    )),
    (sounds.passThroughSound3 = new Audio(
      "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound3.mp3"
    )),
    (sounds.passThroughSound4 = new Audio(
      "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/pass-through-sound4.mp3"
    )),
    (sounds.countdownSound = new Audio(
      "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/countdown-sound.mp3"
    )),
    (sounds.startSound = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/start-sound.mp3")),
    (sounds.prize = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/prize.mp3")),
    (sounds.scoreCount = new Audio("https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/score-count.mp3")),
    (sounds.laneChangeSound = new Audio(
      "https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/sound/lane-change-sound.mp3"
    ));
}
function checkOptions(e) {
  let t = getGameCookie("drive-game-music"),
    a = getGameCookie("drive-game-effect"),
    n = getGameCookie("drive-game-first"),
    o = getGameCookie("drive-game-cookies");
  "unset" === t && setGameCookie("music", (t = 0)),
    "unset" === a && setGameCookie("effect", (a = 0)),
    "unset" === n && setGameCookie("first", (n = 0)),
    "unset" === o && setGameCookie("cookies", (o = 0)),
    (isMusicOn = t),
    (areSoundEffectsOn = a);
  let s = document.getElementById("music-tick"),
    i = document.getElementById("effect-tick");
  0 == isMusicOn && (s.style.display = "none"), 0 == areSoundEffectsOn && (i.style.display = "none");
}
function toggleSoundIcon() {
  let e = document.getElementById("effect-tick");
  "none" === e.style.display
    ? ((areSoundEffectsOn = 1), setGameCookie("effect", 1), (e.style.display = "block"))
    : "" === e.style.display
    ? ((areSoundEffectsOn = 1), setGameCookie("effect", 0), (e.style.display = "none"))
    : ((areSoundEffectsOn = 0), setGameCookie("effect", 0), (e.style.display = "none"));
}
function playSoundEffect(e) {
  let t = sounds[e];
  t &&
    1 == areSoundEffectsOn &&
    ((currentSoundEffect = t),
    t.play().catch((t) => {
      console.error(`Error playing sound: ${e}`, t);
    }));
}
function playButtonClickSound() {
  (sounds.open.currentTime = 0), playSoundEffect("open");
}
function closeButtonClickSound() {
  (sounds.close.currentTime = 0), playSoundEffect("close");
}
function toggleMusicSetting() {
  let e = document.getElementById("music-tick");
  "none" === e.style.display
    ? ((isMusicOn = !0), playMusic(), setGameCookie("music", 1), (e.style.display = "block"))
    : "" === e.style.display
    ? ((isMusicOn = !1), playMusic(), setGameCookie("music", 0), (e.style.display = "none"))
    : ((isMusicOn = !1), sounds.titleMusic.pause(), setGameCookie("music", 0), (e.style.display = "none"));
}
function playMusic(e) {
  1 == isMusicOn && ((sounds.titleMusic.loop = !0), (sounds.titleMusic.currentTime = 0), sounds.titleMusic.play());
}
function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height),
    ctx.drawImage(backgroundImage, 0, yOffset, canvas.width, canvas.height),
    ctx.drawImage(backgroundImage, 0, yOffset - canvas.height, canvas.width, canvas.height),
    (yOffset += speed) >= canvas.height && (yOffset -= canvas.height);
}
function updatePlayerPosition() {
  playerX < 0 && (playerX = 0),
    playerX > gameArea.clientWidth - 54 && (playerX = gameArea.clientWidth - 54),
    (player.style.left = `${playerX}px`),
    (player.style.transition = "left 0.3s ease-in-out"),
    setTimeout(() => {
      player.style.transition = "";
    }, 300);
}
function createObstacle() {
  let e = document.createElement("div");
  e.className = "obstacle";
  let t = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  e.classList.add(t);
  let a = gameArea.clientWidth / 3,
    n = Math.floor(3 * Math.random()),
    o = Math.max(0, Math.min(gameArea.clientWidth - 45, n * a + (a - 45) / 2));
  (e.style.left = `${o}px`),
    (e.style.top = `-${gameArea.clientHeight}px`),
    (e.dataset.lane = n),
    (e.dataset.previousLane = n),
    gameArea.appendChild(e),
    obstacles.push(e);
}
function createCoin() {
  let e = document.createElement("div");
  e.className = "coin";
  let t = ["gold", "silver", "bronze"],
    a = t[Math.floor(Math.random() * t.length)];
  e.classList.add(`coin-${a}`);
  let n;
  switch (a) {
    case "gold":
      n = 150;
      break;
    case "silver":
      n = 100;
      break;
    case "bronze":
      n = 50;
  }
  e.dataset.value = n;
  let o, s, i, l;
  do (o = gameArea.clientWidth / 3), (i = (s = Math.floor(3 * Math.random())) * o + (o - 40) / 2), (l = -20);
  while (checkCoinOverlap(i, l));
  (e.style.left = `${i}px`), (e.style.top = `${l}px`), gameArea.appendChild(e), coins.push(e);
}
function checkCoinOverlap(e, t) {
  return obstacles.some((a) => {
    let n = a.getBoundingClientRect();
    return e < n.right && e + 20 > n.left && t < n.bottom && t + 20 > n.top;
  });
}
function checkCollision(e, t) {
  return e.left < t.right - 30 && e.right > t.left + 30 && e.top < t.bottom - 30 && e.bottom > t.top + 30;
}
function updateGame(e) {
  if (isGameOver) return;
  let t = e - lastFrameTime;
  t >= 8.333333333333334 &&
    ((lastFrameTime = e),
    drawBackground(),
    obstacles.forEach((e, t) => {
      let a = parseInt(e.style.top);
      e.style.top = `${a + speed}px`;
      let n = parseInt(e.dataset.lane),
        o = parseInt(e.dataset.previousLane);
      if (
        (n !== o &&
          (n < o
            ? (e.style.animation = "carleft 0.3s ease-in-out forwards")
            : (e.style.animation = "carright 0.3s ease-in-out forwards"),
          setTimeout(() => {
            e.style.animation = "";
          }, 300)),
        (e.dataset.previousLane = n),
        9e-4 > Math.random())
      ) {
        let s = parseInt(e.dataset.lane),
          i = e.getBoundingClientRect(),
          l = player.getBoundingClientRect(),
          r = gameScoreData.score > 1900 ? gameArea.clientHeight / 2 : 300;
        if (i.bottom < l.top - r) {
          let d;
          d = 0 === s ? 1 : 2 === s ? 1 : 0.5 > Math.random() ? 0 : 2;
          let c = gameArea.clientWidth / 3,
            u = Math.max(0, Math.min(gameArea.clientWidth - 45, d * c + (c - 45) / 2));
          (e.style.left = `${u}px`),
            (e.dataset.lane = d),
            (e.style.transition = "left 0.3s ease-in-out"),
            setTimeout(() => {
              e.style.transition = "";
            }, 300);
        }
      }
      a > gameArea.clientHeight && (gameArea.removeChild(e), obstacles.splice(t, 1)),
        checkCollision(player.getBoundingClientRect(), e.getBoundingClientRect()) && gameOver();
    }),
    coins.forEach((e, t) => {
      let a = parseInt(e.style.top);
      (e.style.top = `${a + speed}px`), a > gameArea.clientHeight && (gameArea.removeChild(e), coins.splice(t, 1));
      let n = e.className.split("-")[1];
      checkCollision(player.getBoundingClientRect(), e.getBoundingClientRect()) &&
        (gameArea.removeChild(e),
        coins.splice(t, 1),
        (gameScoreData.score += parseInt(e.dataset.value)),
        (coinElement.textContent = `+ ${e.dataset.value}`),
        coinElement.classList.add("show", n),
        setTimeout(() => {
          coinElement.classList.remove("show", n);
        }, 800),
        "gold" === n
          ? goldCoinsCollected++
          : "silver" === n
          ? silverCoinsCollected++
          : "bronze" === n && bronzeCoinsCollected++);
    }),
    (speed += 0.003),
    (scoreElement.textContent = `Score: ${gameScoreData.score}`)),
    (animationId = requestAnimationFrame(updateGame));
}
function playRandomPassThroughSound() {
  let e = [sounds.passThroughSound1, sounds.passThroughSound2, sounds.passThroughSound3, sounds.passThroughSound4],
    t = e[Math.floor(Math.random() * e.length)];
  1 == areSoundEffectsOn && t.play();
}
function setPlayerLane(e) {
  let t = gameArea.clientWidth / 3,
    a = Math.max(0, Math.min(2, Math.floor(e / t)));
  null !== previousLane &&
    a !== previousLane &&
    (a < previousLane
      ? (player.classList.add("player-left"),
        setTimeout(() => {
          player.classList.remove("player-left");
        }, 300))
      : (player.classList.add("player-right"),
        setTimeout(() => {
          player.classList.remove("player-right");
        }, 300))),
    (previousLane = a),
    (playerX = Math.max(0, Math.min(gameArea.clientWidth - 54, a * t + (t - 54) / 2))),
    updatePlayerPosition();
}
function startHTP() {
  gameStarted ||
    (setGameCookie("cookies", 1),
    hidePreview(howtoplayModal),
    htpdriver.drive(),
    (player.style.display = "none"),
    (HTPdiv.style.display = "block"),
    (startline.style.display = "none"),
    (startMenu.style.display = "none"));
}
function resetHTP() {
  HTPplayer.classList.remove("played"),
    (HTPplayer.style.backgroundImage =
      "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player.png')");
}
function preStartGame() {
  (gameInitLoader.style.display = "flex"),
    setTimeout(() => {
      (gameInitLoader.style.display = "none"), startGame();
    }, 2500);
}
function startGame() {
  if (gameStarted) return;
  stopGame(),
    (gameScoreData = { newfinalScore: 0, score: 0 }),
    (player.style.display = "block"),
    (HTPdiv.style.display = "none"),
    (startline.style.display = "block"),
    (player.style.display = "none"),
    (startMenu.style.display = "none"),
    (pauseButton.style.display = "none"),
    (submitError.style.display = "none"),
    driveXmas.classList.remove("entrance"),
    driveXmasTitle.classList.remove("entrance"),
    startline.classList.remove("started"),
    finalScoreElement.classList.remove("scale"),
    (player.style.backgroundImage =
      "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player.png')"),
    sounds.titleMusic.pause(),
    setGameCookie("first", 1),
    drawBackground(),
    (gameStarted = !0),
    (gameStarting = !0),
    (isPaused = !1),
    (isGameOver = !1),
    (gameScoreData.score = 0),
    (gametime = 0),
    (scoreElement.textContent = `Score: ${gameScoreData.score}`),
    (speed = 2),
    (obstacleSpawnRate = 1800),
    obstacles.forEach((e) => gameArea.removeChild(e)),
    coins.forEach((e) => gameArea.removeChild(e)),
    (obstacles.length = 0),
    (coins.length = 0),
    (gameOverElement.style.display = "none"),
    requestNewSecureKey();
  let e = getGameCookie("drive-game-name"),
    t = getGameCookie("drive-game-email");
  "unset" !== e && (playerNameInput.value = e),
    "unset" !== t && (playerEmailInput.value = t),
    setPlayerLane(gameArea.clientWidth / 2),
    player.classList.add("player-init");
  let a = 3;
  (countdownInterval = setInterval(() => {
    (countdownDiv.style.display = "flex"),
      (tipsDiv.style.display = "block"),
      (countdownDiv.textContent = a),
      playSoundEffect("countdownSound"),
      a--,
      (player.style.display = "block"),
      a < 0 &&
        (clearInterval(countdownInterval),
        (countdownDiv.textContent = "START"),
        setTimeout(() => {
          gameStarted &&
            ((countdownDiv.style.display = "none"),
            (tipsDiv.style.display = "none"),
            (countdownDiv.textContent = ""),
            (gameStarting = !1),
            1 == isMusicOn &&
              ((sounds.backgroundMusic.loop = !0),
              (sounds.backgroundMusic.currentTime = 0),
              sounds.backgroundMusic.play()),
            startline.classList.add("started"),
            gameArea.classList.remove("disabled"),
            (gameStartTimestamp = Math.floor(Date.now() / 1e3)),
            updateGame(),
            (obstacleInterval = setInterval(createObstacle, obstacleSpawnRate)),
            (obstacleSpawnRate = Math.max(1900, Math.min(3e3, 2200 * (750 / gameArea.clientHeight)))),
            (coinInterval = setInterval(createCoin, 3e3)),
            (scoreInterval = setInterval(() => {
              gameScoreData.score++, gametime++, gameScoreData.score % 70 == 0 && updateObstacleSpawnRate();
            }, 100)),
            (pauseButton.style.display = "block"),
            player.classList.remove("player-init"));
        }, 1e3));
  }, 1e3)),
    (goldCoinsCollected = 0),
    (silverCoinsCollected = 0),
    (bronzeCoinsCollected = 0);
}
function stopGame() {
  cancelAnimationFrame(animationId),
    clearInterval(obstacleInterval),
    clearInterval(coinInterval),
    clearInterval(scoreInterval),
    sounds.backgroundMusic.pause(),
    (gameStarted = !1),
    (gameStarting = !1),
    (isGameOver = !0),
    (isPaused = !1),
    obstacles.forEach((e) => gameArea.removeChild(e)),
    coins.forEach((e) => gameArea.removeChild(e)),
    (obstacles.length = 0),
    (coins.length = 0),
    (countdownDiv.textContent = ""),
    (gameOverElement.style.display = "none");
}
function initStart() {
  let e = getGameCookie("drive-game-first"),
    t = getGameCookie("drive-game-cookies");
  1 == isMusicOn && playMusic(), 0 == t ? showPreview(howtoplayModal) : 0 == e ? startHTP() : preStartGame();
}
function restartGame() {
  hidePreview(pauseModal), startGame();
}
function gameOver() {
  (gameStarted = !1),
    (gameStarting = !1),
    (isGameOver = !0),
    (gameEndTimestamp = Math.floor(Date.now() / 1e3)),
    cancelAnimationFrame(animationId),
    clearInterval(obstacleInterval),
    clearInterval(coinInterval),
    clearInterval(scoreInterval),
    sounds.backgroundMusic.pause(),
    playSoundEffect("explosionSound");
  let e = player.getBoundingClientRect(),
    t = obstacles.find((t) => checkCollision(e, t.getBoundingClientRect()));
  if (t) {
    let a = parseInt(t.dataset.lane),
      n = gameArea.clientWidth / 3;
    (playerX = a * n + (n - 54) / 2), updatePlayerPosition();
  }
  gameArea.classList.add("disabled"),
    (explosion.style.left = `${playerX - 26}px`),
    (explosion.style.top = `${player.offsetTop - 20}px`),
    (explosion.style.display = "block"),
    setTimeout(() => {
      (gameOverElement.style.display = "flex"),
        (scoreElement.textContent = "Score: ???"),
        (finalScoreElement.textContent = `${gameScoreData.score}`),
        (document.getElementById("goldCoinsSpan").textContent = goldCoinsCollected),
        (document.getElementById("silverCoinsSpan").textContent = silverCoinsCollected),
        (document.getElementById("bronzeCoinsSpan").textContent = bronzeCoinsCollected),
        endGame(gameScoreData.score),
        showLeaderboardForm(gameScoreData.score),
        (explosion.style.display = "none"),
        (player.style.backgroundImage =
          "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player-crash.gif')");
    }, 1500);
}
function endGame() {
  (gameScoreData.newfinalScore = gameScoreData.score), Object.freeze(gameScoreData);
}
function animateScore(e, t) {
  let a = 0,
    n = Math.ceil(e / 100),
    o = setInterval(() => {
      (a += n) >= e && ((a = e), clearInterval(o), t && t()), (finalScoreElement.textContent = `${a}`);
    }, 20);
}
function showLeaderboardForm(e) {
  showPreview(formfinish), (playerNameInput.maxLength = "12");
}
function checkAjaxObject() {
  return "undefined" != typeof ajax_object || (console.error("AJAX object not properly initialized"), !1);
}
function requestNewNonce() {
  checkAjaxObject() &&
    jQuery.ajax({
      type: "post",
      url: ajax_object.ajax_url,
      data: { action: "get_new_nonce" },
      success: function (e) {
        e.success && ((currentNonce = e.data.nonce), (isNonceInitialized = !0));
      },
      error: function (e, t, a) {
        console.error("Nonce request failed:", a);
      },
    });
}
function initializeNonce() {
  checkAjaxObject() &&
    jQuery.ajax({
      type: "post",
      url: ajax_object.ajax_url,
      data: { action: "get_new_nonce" },
      success: function (e) {
        e.success && ((currentNonce = e.data.nonce), (isNonceInitialized = !0));
      },
      error: function (e, t, a) {
        console.error("Initial nonce request failed:", a), setTimeout(initializeNonce, 5e3);
      },
    });
}
function gameCalculate() {
  let e =
    gameStartTimestamp +
    "." +
    gameEndTimestamp +
    "." +
    goldCoinsCollected +
    "." +
    silverCoinsCollected +
    "." +
    bronzeCoinsCollected;
  return e;
}
function requestNewSecureKey() {
  jQuery.ajax({
    type: "post",
    url: ajax_object.ajax_url,
    data: { action: "get_secure_key" },
    success: function (e) {
      e.success && (currentSecureKey = e.data.key);
    },
    error: function (e, t, a) {
      console.error("Secure key request failed:", a);
    },
  });
}
function submitFormButton() {
  if (!checkAjaxObject()) return;
  if (!isNonceInitialized) {
    initializeNonce(), alert("Please try again in a moment.");
    return;
  }
  let e = gameCalculate(),
    t = document.getElementById("form-loader"),
    a = playerNameInput.value,
    n = playerEmailInput.value;
  if (!a || !n) {
    alert("Please fill in all details.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)) {
    alert("Please enter a valid email address.");
    return;
  }
  if (!/^[a-zA-Z0-9\s]{1,12}$/.test(a)) {
    alert("Name can only contain letters, numbers, and spaces (max 12 characters).");
    return;
  }
  t.style.display = "flex";
  let o = {
    winner_name: a,
    winner_email: n,
    winner_id: e,
    winner_score: gameScoreData.newfinalScore,
    submit_winner: !0,
  };
  jQuery.ajax({
    type: "post",
    url: ajax_object.ajax_url,
    data: { action: "save_winner", security: currentNonce, secure_key: currentSecureKey, data: o },
    complete: function (e) {
      t.style.display = "none";
      let o = JSON.parse(e.responseText);
      o.success && "success" === o.data
        ? ((formLoader.style.display = "none"),
          (submitError.style.display = "none"),
          closeForm(),
          (playerNameInput.value = ""),
          (playerEmailInput.value = ""),
          setGameCookie("name", a),
          setGameCookie("email", n),
          (currentNonce = null),
          (isNonceInitialized = !1),
          (currentSecureKey = null),
          (submitError.style.display = "none"),
          requestNewNonce())
        : ((formLoader.style.display = "none"),
          (submitError.style.display = "block"),
          (submitError.textContent = o.data || "An error occurred. Please try again."));
    },
  });
}
function setupNonceRefresh() {
  setInterval(function () {
    requestNewNonce();
  }, 84e4);
}
function updateObstacleSpawnRate() {
  (obstacleSpawnRate = Math.max(500, obstacleSpawnRate - 80)),
    clearInterval(obstacleInterval),
    (obstacleInterval = setInterval(createObstacle, obstacleSpawnRate));
}
function showPreview(e) {
  playSoundEffect("select"),
    removePopClass(),
    e.classList.add("active"),
    e.classList.remove("closed"),
    (overlay.style.display = "block");
}
function hidePreview(e) {
  playSoundEffect("close"),
    removePopClass(),
    e.classList.remove("active"),
    e.classList.add("closed"),
    (overlay.style.display = "none");
}
function closeForm() {
  let e = document.querySelector(".gameOver-menu");
  (e.style.visibility = "hidden"),
    hidePreview(formfinish),
    playSoundEffect("scoreCount"),
    animateScore(gameScoreData.score, () => {
      finalScoreElement.classList.add("scale"),
        playSoundEffect("prize"),
        confetti({ particleCount: 400, spread: 250, origin: { y: 0.4 } }),
        (e.style.visibility = "visible");
    });
}
function removePopClass() {
  document.querySelectorAll(".pop-container").forEach((e) => {
    e.classList.remove("closed", "active");
  });
}
function mainMenu() {
  (startMenu.style.display = "flex"),
    driveXmas.classList.add("entrance"),
    driveXmasTitle.classList.add("entrance"),
    (gameOverElement.style.display = "none"),
    clearInterval(countdownInterval),
    stopGame(),
    playMusic();
}
function backtomainMenu() {
  stopGame(),
    clearInterval(countdownInterval),
    (startMenu.style.display = "flex"),
    driveXmas.classList.add("entrance"),
    driveXmasTitle.classList.add("entrance"),
    (gameOverElement.style.display = "none"),
    hidePreview(formfinish),
    hidePreview(pauseModal),
    playMusic();
}
function pauseMenu() {
  showPreview(pauseModal), pauseGame();
}
function unpauseMenu() {
  hidePreview(pauseModal), unpauseGame();
}
function pauseGame() {
  isPaused ||
    ((isPaused = !0),
    (gameStarted = !1),
    cancelAnimationFrame(animationId),
    clearInterval(obstacleInterval),
    clearInterval(coinInterval),
    clearInterval(scoreInterval),
    sounds.backgroundMusic.pause());
}
function unpauseGame() {
  isPaused &&
    (gameStarting
      ? restartGame()
      : ((isPaused = !1),
        (gameStarted = !0),
        updateGame(),
        1 == isMusicOn && sounds.backgroundMusic.play(),
        (obstacleInterval = setInterval(createObstacle, obstacleSpawnRate)),
        (coinInterval = setInterval(createCoin, 3e3)),
        (scoreInterval = setInterval(() => {
          gameScoreData.score++, gameScoreData.score % 70 == 0 && updateObstacleSpawnRate();
        }, 100))));
}
function setGameCookie(e, t) {
  document.cookie = `drive-game-${e}=${t}; path=/;`;
}
function getGameCookie(e) {
  let t = document.cookie.split("; "),
    a = "unset";
  return (
    t.forEach((t) => {
      let [n, o] = t.split("=");
      n === e && (a = o);
    }),
    a
  );
}
function getThursdayOfCurrentWeek() {
  let e = new Date(),
    t = e.getDay(),
    a = new Date(e);
  a.setDate(e.getDate() - ((t + 3) % 7));
  let n = a.getFullYear(),
    o = String(a.getMonth() + 1).padStart(2, "0"),
    s = String(a.getDate()).padStart(2, "0");
  return `${n}-${o}-${s}`;
}
function getNextThursday() {
  let e = new Date(),
    t = e.getDay(),
    a = 4 - t;
  a <= 0 && (a += 7);
  let n = new Date(e);
  n.setDate(e.getDate() + a);
  let o = n.getFullYear(),
    s = String(n.getMonth() + 1).padStart(2, "0"),
    i = String(n.getDate()).padStart(2, "0");
  return `${o}-${s}-${i}`;
}
document.addEventListener("DOMContentLoaded", function () {
  preloadSounds(), checkOptions(), updatePlayerPosition(), initializeNonce();
}),
  leaderboardButton.addEventListener("click", function () {
    let e = document.getElementById("leaderboard-overlay"),
      t = document.getElementById("leaderboardInner"),
      a = getGameCookie("drive-game-email"),
      n = getThursdayOfCurrentWeek(),
      o = getNextThursday();
    (e.style.display = "flex"),
      (t.innerHTML = ""),
      jQuery.ajax({
        type: "post",
        url: ajax_object.ajax_url,
        data: {
          action: "get_winner",
          data: { user_email: a, current_thursday: n, next_thursday: o },
          security: currentNonce,
        },
        complete: function (a) {
          (e.style.display = "none"), (t.innerHTML = JSON.parse(a.responseText).data);
        },
      });
  }),
  document.querySelectorAll(".game-button").forEach((e) => {
    let t = () => {
      e.classList.toggle("active");
    };
    e.addEventListener("click", t), e.addEventListener("touchstart", t);
  }),
  gameArea.addEventListener("mousedown", (e) => {
    if (!gameStarted) return;
    isDragging = !0;
    let t = gameArea.getBoundingClientRect();
    setPlayerLane(e.clientX - t.left);
  }),
  gameArea.addEventListener("mousemove", (e) => {
    if (gameStarted && isDragging) {
      let t = gameArea.getBoundingClientRect();
      setPlayerLane(e.clientX - t.left);
    }
  }),
  gameArea.addEventListener("mouseup", () => {
    isDragging = !1;
  });
let startX;
gameArea.addEventListener("touchstart", (e) => {
  if (!gameStarted) return;
  let t = e.touches[0],
    a = 0.2 * window.innerHeight;
  if (t.clientY > window.innerHeight - a) {
    isDragging = !0;
    let n = gameArea.getBoundingClientRect();
    setPlayerLane(t.clientX - n.left);
  } else startX = t.clientX;
}),
  gameArea.addEventListener("touchmove", (e) => {
    if (!gameStarted) return;
    let t = e.touches[0],
      a = 0.2 * window.innerHeight;
    if (t.clientY > window.innerHeight - a && isDragging) {
      e.preventDefault();
      let n = gameArea.getBoundingClientRect();
      setPlayerLane(t.clientX - n.left);
    }
  }),
  gameArea.addEventListener("touchend", (e) => {
    if (!gameStarted) return;
    let t = e.changedTouches[0],
      a = 0.2 * window.innerHeight;
    if (t.clientY <= window.innerHeight - a) {
      let n = t.clientX;
      startX - n > 10 ? setPlayerLane(playerX - 100) : n - startX > 10 && setPlayerLane(playerX + 100);
    }
    isDragging = !1;
  }),
  document.addEventListener("keydown", (e) => {
    "p" === e.key && pauseGame();
  }),
  document.querySelectorAll(".game-button").forEach((e) => {
    e.addEventListener("click", playButtonClickSound);
  }),
  window.addEventListener("load", function () {
    setTimeout(() => {
      (gameInitLoader.style.display = "none"),
        driveXmas.classList.add("entrance"),
        driveXmasTitle.classList.add("entrance");
    }, 3e3);
  }),
  window.addEventListener("blur", () => {
    document.hidden
      ? (gameStarted && pauseMenu(), 0 != isMusicOn && sounds.backgroundMusic.pause())
      : gameStarted && 0 != isMusicOn && sounds.backgroundMusic.play();
  }),
  document.addEventListener("visibilitychange", () => {
    document.hidden
      ? (gameStarted && pauseMenu(), 0 != isMusicOn && sounds.backgroundMusic.pause())
      : gameStarted && 0 != isMusicOn && sounds.backgroundMusic.play();
  }),
  history.pushState(null, null, location.href),
  (window.onpopstate = function (e) {
    history.pushState(null, null, location.href),
      gameStarted
        ? (pauseMenu(), history.pushState(null, null, location.href))
        : (removePopClass(), (overlay.style.display = "none"));
  });
const driver = window.driver.js.driver,
  htpdriver = driver({
    showProgress: !1,
    allowClose: !1,
    smoothScroll: !0,
    popoverClass: "HTParea",
    nextBtnText: "Next",
    prevBtnText: "Previous",
    doneBtnText: "Start",
    steps: [
      {
        popover: {
          title: "Welcome to AXS Drive: Heart Racer!",
          description: "Your partner is waiting! Before you start the game, here is some information you need to know",
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("passThroughSound3"), htpdriver.moveNext();
          },
        },
      },
      {
        element: "#htpplayer",
        popover: {
          title: "AXS Car a.k.a Your Car",
          description: "Late for your date! Tap left or right to change lanes and make it on time.",
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("passThroughSound1"), htpdriver.moveNext();
          },
        },
      },
      {
        element: ".htp-drag-area",
        popover: {
          title: "Car Control",
          description: "You can also drag to change lanes",
          onNextClick() {
            closeButtonClickSound(), htpdriver.moveNext();
          },
        },
      },
      {
        element: ".htp-swipe-area",
        popover: {
          title: "Car Control",
          description: "or swipe/tap a lane to switch.",
          onNextClick() {
            closeButtonClickSound(), htpdriver.moveNext();
          },
        },
      },
      {
        element: ".htp-obstacle",
        popover: {
          title: "Your Enemy",
          description: "Every car and every delay is a blow to your romantic plans! So hurry up!",
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("laneChangeSound"), htpdriver.moveNext();
          },
        },
      },
      {
        element: "#htp-car-crash-part",
        popover: {
          title: "Be Careful!",
          description: "What you should do? Dodge those cars! You don't want to be late for your date.",
          onNextClick() {
            closeButtonClickSound(),
              (document.querySelector(".driver-popover-navigation-btns").style.display = "none"),
              HTPplayer.classList.add("played"),
              setTimeout(() => {
                (document.querySelector(".driver-popover-navigation-btns").style.display = "none"),
                  playSoundEffect("explosionSound"),
                  (HTPexplosion.style.display = "block"),
                  setTimeout(() => {
                    (HTPexplosion.style.display = "none"),
                      (HTPplayer.style.backgroundImage =
                        "url('https://cdn.jsdelivr.net/gh/Joctory/xmas-joyride@main/v1/assets/player-crash.gif')"),
                      (document.querySelector(".driver-popover-navigation-btns").style.display = "flex");
                  }, 1800);
              }, 500),
              htpdriver.moveNext();
          },
        },
      },
      {
        element: "#htp-car-crash-part",
        popover: {
          title: "OH NO!",
          description: "A small detour! It's alright, you can still make it on time. Let's go!",
          onPrevClick() {
            resetHTP(), htpdriver.movePrevious();
          },
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("coinSound"), htpdriver.moveNext();
          },
        },
      },
      {
        element: ".htp-coin-bronze",
        popover: {
          title: "Bronze Present",
          description: "This is a bronze giftbox that adds an additional 50 points.",
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("coinSound"), htpdriver.moveNext();
          },
        },
      },
      {
        element: ".htp-coin-silver",
        popover: {
          title: "Silver Present",
          description: "This is a silver giftbox that adds an additional 100 points.",
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("coinSound"), htpdriver.moveNext();
          },
        },
      },
      {
        element: ".htp-coin-gold",
        popover: {
          title: "Gold Present",
          description: "This is a gold giftbox that adds an additional 150 points.",
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("scoreCount"), htpdriver.moveNext();
          },
        },
      },
      {
        element: "#score",
        popover: {
          title: "Score",
          description: "This is your 'Romance Score'! Aim for the highest score to impress your date.",
          onNextClick() {
            closeButtonClickSound(), playSoundEffect("prize"), htpdriver.moveNext();
          },
        },
      },
      {
        popover: {
          title: "That's All",
          description: "And that's it! Now, get going and impress your date!",
          onNextClick() {
            htpdriver.destroy(), resetHTP(), preStartGame();
          },
        },
      },
    ],
  });
let clickCount = 0;
driveXmas.addEventListener("click", function () {
  5 == ++clickCount && gameArea.classList.add("makecoin");
});
