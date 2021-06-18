// VARIABLE DECLARATION
import { layout, Ghost } from "./template.js";
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const grid = document.querySelector(".grid");
const gameResultText = document.getElementById("game-result-text");
const width = 28;
const gridSquares = [];
let highScoreFromLS = JSON.parse(localStorage.getItem("highscore"));
let pacmanCurrentIndex = 490;
let score = 0;
let gameWon = false;
let extraCheck = true;
let highscore;

// CREATING GHOSTS
const ghosts = [
  new Ghost("blinky", 377, 250),
  new Ghost("pinky", 405, 400),
  new Ghost("inky", 378, 300),
  new Ghost("clyde", 406, 500),
];

/* 
========================
FUNCTIONS
========================
*/

// CREATE BOARD FUNCTION
const createBoard = () => {
  if (highScoreFromLS) {
    highscore = highScoreFromLS;
    highScoreDisplay.innerHTML = highscore;
  }
  for (let i = 0; i < layout.length; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
    gridSquares.push(square);

    if (layout[i] === 0) {
      gridSquares[i].classList.add("pacdot");
    } else if (layout[i] === 1) {
      gridSquares[i].classList.add("wall");
    } else if (layout[i] === 2) {
      gridSquares[i].classList.add("ghost-lair");
    } else if (layout[i] === 3) {
      gridSquares[i].classList.add("power-pellet");
    }
  }
  gridSquares[pacmanCurrentIndex].classList.add("pacman");
  ghosts.forEach((ghost) => {
    gridSquares[ghost.currentIndex].classList.add(ghost.className);
    gridSquares[ghost.currentIndex].classList.add("ghost");
  });
};

// CONTROLS FUNCTION
const controls = (event) => {
  gridSquares[pacmanCurrentIndex].classList.remove("pacman");
  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      if (
        !gridSquares[pacmanCurrentIndex - width].classList.contains(
          "ghost-lair"
        ) &&
        !gridSquares[pacmanCurrentIndex - width].classList.contains("wall") &&
        pacmanCurrentIndex - width >= 0
      ) {
        pacmanCurrentIndex -= width;
      }
      break;
    case "KeyA":
    case "ArrowLeft":
      if (
        !gridSquares[pacmanCurrentIndex - 1].classList.contains("ghost-lair") &&
        !gridSquares[pacmanCurrentIndex - 1].classList.contains("wall") &&
        pacmanCurrentIndex % width !== 0
      ) {
        pacmanCurrentIndex -= 1;
      }

      if (pacmanCurrentIndex === 364) {
        pacmanCurrentIndex = 391;
      }
      break;
    case "KeyS":
    case "ArrowDown":
      if (
        !gridSquares[pacmanCurrentIndex + width].classList.contains(
          "ghost-lair"
        ) &&
        !gridSquares[pacmanCurrentIndex + width].classList.contains("wall") &&
        pacmanCurrentIndex + width < width * width
      ) {
        pacmanCurrentIndex += width;
      }
      break;
    case "KeyD":
    case "ArrowRight":
      if (
        !gridSquares[pacmanCurrentIndex + 1].classList.contains("ghost-lair") &&
        !gridSquares[pacmanCurrentIndex + 1].classList.contains("wall") &&
        pacmanCurrentIndex % width < width - 1
      ) {
        pacmanCurrentIndex += 1;
      }

      if (pacmanCurrentIndex === 391) {
        pacmanCurrentIndex = 364;
      }
      break;
  }
  gridSquares[pacmanCurrentIndex].classList.add("pacman");

  // CALLING FUNCTIONS
  pacdotEaten();
  powerPelletEaten();
  checkGameOver();
  checkWinGame();
};

// MOVING GHOSTS FUNCTION
const moveGhost = (ghost) => {
  const directions = [-1, +1, -width, +width];
  let moveDirection = directions[Math.floor(Math.random() * directions.length)];

  ghost.timerId = setInterval(() => {
    if (
      !gridSquares[ghost.currentIndex + moveDirection].classList.contains(
        "wall"
      ) &&
      !gridSquares[ghost.currentIndex + moveDirection].classList.contains(
        "ghost"
      )
    ) {
      gridSquares[ghost.currentIndex].classList.remove(ghost.className);
      gridSquares[ghost.currentIndex].classList.remove("ghost", "scared-ghost");
      ghost.currentIndex += moveDirection;
      gridSquares[ghost.currentIndex].classList.add(ghost.className);
      gridSquares[ghost.currentIndex].classList.add("ghost");
    } else {
      moveDirection = directions[Math.floor(Math.random() * directions.length)];
    }

    // IF GHOST IS SCARED
    if (ghost.isScared) {
      gridSquares[ghost.currentIndex].classList.add("scared-ghost");
    }
    if (
      ghost.isScared &&
      gridSquares[ghost.currentIndex].classList.contains("pacman")
    ) {
      gridSquares[ghost.currentIndex].classList.remove(
        ghost.className,
        "ghost",
        "scared-ghost"
      );
      ghost.currentIndex = ghost.startIndex;
      gridSquares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      score += 100;
      displayScoreHTML();
    }

    // CALLING FUNCTIONS
    checkGameOver();
    checkWinGame();
  }, ghost.speed);
};

// DISPLAY SCORE FUNCTION
const displayScoreHTML = () => {
  scoreDisplay.innerHTML = score;
};

// PACDOT EATING FUNCTION
const pacdotEaten = () => {
  if (gridSquares[pacmanCurrentIndex].classList.contains("pacdot")) {
    gridSquares[pacmanCurrentIndex].classList.remove("pacdot");
    score++;
    displayScoreHTML();
  }
};

// POWER PELLET EATING FUNCTION
const powerPelletEaten = () => {
  if (gridSquares[pacmanCurrentIndex].classList.contains("power-pellet")) {
    gridSquares[pacmanCurrentIndex].classList.remove("power-pellet");
    score += 10;
    displayScoreHTML();
    ghosts.forEach((ghost) => (ghost.isScared = true));
    setTimeout(() => {
      ghosts.forEach((ghost) => (ghost.isScared = false));
    }, 10000);
  }
};

// GAME FINISHED FUNCTION
const gameDone = () => {
  ghosts.forEach((ghost) => clearInterval(ghost.timerId));
  document.removeEventListener("keydown", controls);
  gameResultText.style.display = "block";
  if (highScoreFromLS < score) {
    localStorage.setItem("highscore", JSON.stringify(score));
    highScoreFromLS = JSON.parse(localStorage.getItem("highscore"));
    highscore = highScoreFromLS;
    highScoreDisplay.innerHTML = highscore;
  }
};

// GAME OVER FUNCTION
const checkGameOver = () => {
  if (
    gridSquares[pacmanCurrentIndex].classList.contains("ghost") &&
    !gridSquares[pacmanCurrentIndex].classList.contains("scared-ghost")
  ) {
    gameDone();
    gameResultText.innerHTML = `<h2 id="game-over">Game Over</h2>`;
  }
};

// GAME WON FUNCTION
const checkWinGame = () => {
  for (let i = 0; i < gridSquares.length; i++) {
    if (
      gridSquares[i].classList.contains("pacdot") ||
      gridSquares[i].classList.contains("power-pellet")
    ) {
      extraCheck = false;
    }
  }
  if (extraCheck) {
    gameWon = true;
  } else {
    extraCheck = true;
  }
  if (gameWon) {
    gameDone();
    gameResultText.innerHTML = `<h2 id="game-won">You Won</h2>`;
  }
};

/* 
========================
CALLING FUNCTIONS
========================
*/
// CREATING BOARD
createBoard();

// ADDING CONTROLS
document.addEventListener("keydown", controls);

// MOVING GHOSTS
ghosts.forEach((ghost) => {
  moveGhost(ghost);
});

// END
