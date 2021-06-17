// VARIABLE DECLARATION
import { layout, Ghost } from "./template.js";
const scoreDisplay = document.getElementById("score");
const grid = document.querySelector(".grid");
const gameResultText = document.getElementById("game-result-text");
const width = 28;
const gridSquares = [];
let pacmanCurrentIndex = 490;
let score = 0;

// CREATING GHOSTS
const ghosts = [
  new Ghost("blinky", 377, 250),
  new Ghost("pinky", 405, 400),
  new Ghost("inky", 378, 300),
  new Ghost("clyde", 406, 500),
];

// CREATING CREATE BOARD FUNCTION
const createBoard = () => {
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

// CALLING CREATE BOARD
createBoard();

// ADDING CONTROLS
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
};
document.addEventListener("keydown", controls);

// PACDOT EATING FUNCTION
const pacdotEaten = () => {
  if (gridSquares[pacmanCurrentIndex].classList.contains("pacdot")) {
    gridSquares[pacmanCurrentIndex].classList.remove("pacdot");
    score++;
    scoreDisplay.innerHTML = score;
  }
};

// POWER PELLET EATING FUNCTION
const powerPelletEaten = () => {
  if (gridSquares[pacmanCurrentIndex].classList.contains("power-pellet")) {
    gridSquares[pacmanCurrentIndex].classList.remove("power-pellet");
    score += 10;
    scoreDisplay.innerHTML = score;
    ghosts.forEach((ghost) => (ghost.isScared = true));
    setTimeout(() => {
      ghosts.forEach((ghost) => (ghost.isScared = false));
    }, 10000);
  }
};

// MOVING GHOSTS
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
      scoreDisplay.innerHTML = score;
    }

    // CALLING FUNCTIONS
    checkGameOver();
  }, ghost.speed);
};
ghosts.forEach((ghost) => {
  moveGhost(ghost);
});

// CHECKING FOR GAME OVER
const checkGameOver = () => {
  if (
    gridSquares[pacmanCurrentIndex].classList.contains("ghost") &&
    !gridSquares[pacmanCurrentIndex].classList.contains("scared-ghost")
  ) {
    ghosts.forEach((ghost) => clearInterval(ghost.timerId));
    document.removeEventListener("keydown", controls);
    gameResultText.innerHTML = `<h2 id="game-over">Game Over</h2>`;
    gameResultText.style.display = "block";
  }
};
