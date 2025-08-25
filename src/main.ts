const gameBoard = document.querySelector("#gameBoard") as HTMLCanvasElement;
const ctx = gameBoard.getContext("2d") as CanvasRenderingContext2D;
const scoreText = document.querySelector("#score") as HTMLDivElement;
const resultText = document.querySelector("#result") as HTMLDivElement;
const resetBtn = document.querySelector("#resetBtn") as HTMLButtonElement;

const musicBtn = document.querySelector("#musicBtn") as HTMLButtonElement;
const soundBtn = document.querySelector("#soundBtn") as HTMLButtonElement;

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const snakeColor = "#0D0D05";
const snakeBorder = "#9DAD86";
const foodColor = "#81382F";
const gap = 3;

const unitSize: number = 30;
let running: boolean = false;
let xVelocity: number = unitSize;
let yVelocity: number = 0;

let foodX: number;
let foodY: number;

let score: number = 0;

let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

let isMusicOn = false;
let isSoundOn = false;

const music = new Audio("/sounds/music.mp3");
music.loop = true;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

musicBtn.addEventListener("click", () => {
  isMusicOn = !isMusicOn;

  if (isMusicOn) {
    music.play();
  } else {
    music.pause();
  }

  const img = musicBtn.querySelector("img") as HTMLImageElement;
  img.setAttribute(
    "src",
    isMusicOn === false ? "/music-off.svg" : "/music.svg",
  );
});

soundBtn.addEventListener("click", () => {
  isSoundOn = !isSoundOn;
  const img = soundBtn.querySelector("img") as HTMLImageElement;
  img.setAttribute(
    "src",
    isSoundOn === false ? "/sound-off.svg" : "/sound.svg",
  );
});

function playLoseSound() {
  if (isSoundOn) {
    const loseSound = new Audio("/sounds/lose.mp3");
    loseSound.play();
  }
}

function playFoodSound() {
  if (isSoundOn) {
    const foodSound = new Audio("/sounds/food.mp3");
    foodSound.play();
  }
}

gameStart();

function gameStart() {
  running = true;
  scoreText.textContent = score.toString();
  createFood();
  drawFood();
  nextTick();
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 75);
  } else {
    playLoseSound();
    displayGameOver();
  }
}

function clearBoard() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  function randomFood(min: number, max: number): number {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
  ctx.beginPath();
  ctx.rect(foodX + gap + 1, foodY + gap + 1, unitSize - 10, unitSize - 10);

  ctx.fillStyle = foodColor;
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = foodColor;
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = snakeBorder;
  ctx.stroke();
}

function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);

  if (snake[0].x == foodX && snake[0].y == foodY) {
    playFoodSound();
    score += 1;
    scoreText.textContent = score.toString();
    createFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  snake.forEach((snakePart) => {
    ctx.beginPath();

    ctx.rect(
      snakePart.x + gap + 1,
      snakePart.y + gap + 1,
      unitSize - 5 - gap * 2,
      unitSize - 5 - gap * 2,
    );

    ctx.fillStyle = snakeColor;
    ctx.fill();

    ctx.lineWidth = 6;
    ctx.strokeStyle = snakeColor;
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = snakeBorder;
    ctx.stroke();
  });
}

function changeDirection(event: KeyboardEvent) {
  const keyPressed = event.key;
  const LEFT = "ArrowLeft";
  const UP = "ArrowUp";
  const RIGHT = "ArrowRight";
  const DOWN = "ArrowDown";

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case (keyPressed == LEFT && !goingRight) ||
      (keyPressed == "a" && !goingRight):
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case (keyPressed == UP && !goingDown) || (keyPressed == "w" && !goingDown):
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case (keyPressed == RIGHT && !goingLeft) ||
      (keyPressed == "d" && !goingLeft):
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case (keyPressed == DOWN && !goingUp) || (keyPressed == "s" && !goingUp):
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  resultText.textContent = `GAME OVER!`;
  running = false;
}

function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  resultText.textContent = "";
  gameStart();
}
