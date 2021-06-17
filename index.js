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
  new Ghost("blinky", 347, 250),
  new Ghost("pinky", 403, 400),
  new Ghost("inky", 352, 300),
  new Ghost("clyde", 408, 500),
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
const controls = (e) => {
  gridSquares[pacmanCurrentIndex].classList.remove("pacman");
  switch (e.code) {
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
  pacdotEaten();
  powerPelletEaten();
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
