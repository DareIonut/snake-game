let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
let xPos,
  yPos,
  width = 50,
  height = 50;
let command;
let imgSnake = document.createElement("img");
imgSnake.src = "head.png";
let imgBody = document.createElement("img");
imgBody.src = "body.png";
let img = document.createElement("img");
img.src = "food.png";
let foodX = randomCoord();
let foodY = randomCoord();
window.addEventListener("keydown", (e) => {
  if (
    e.key == "ArrowUp" ||
    e.key == "ArrowDown" ||
    e.key == "ArrowLeft" ||
    e.key == "ArrowRight"
  ) {
    command = e.key;
  }
});

const body = new Map();
let snakeHeap = 1;

start();

function start() {
  body.set("body1", { x: 150, y: 250 });
  xPos = body.get("body1").x;
  yPos = body.get("body1").y;
  setInterval(gameLoop, 300);
}

function gameLoop() {
  switch (command) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowLeft":
      move("left");
      break;
    default:
      break;
  }
  checkEat(xPos, yPos);
  throughWalls(xPos, yPos);
  draw();
}

function draw() {
  body.forEach((e) => {
    if (e.x == xPos && e.y == yPos) {
      ctx.drawImage(imgSnake, e.x, e.y, width, height);
    } else {
      ctx.drawImage(imgBody, e.x, e.y, width, height);
    }
  });
  ctx.drawImage(img, foodX, foodY, width, height);
}

function move(arrow) {
  ctx.clearRect(
    body.get(`body${snakeHeap}`).x,
    body.get(`body${snakeHeap}`).y,
    50,
    50
  );

  for (let i = snakeHeap; i >= 1; i--) {
    if (i == 1) {
      switch (arrow) {
        case "up":
          body.set(`body1`, {
            x: body.get(`body1`).x,
            y: body.get(`body1`).y - 50,
          });
          updateXY();
          break;
        case "down":
          body.set(`body1`, {
            x: body.get(`body1`).x,
            y: body.get(`body1`).y + 50,
          });
          updateXY();
          break;
        case "left":
          body.set(`body1`, {
            x: body.get(`body1`).x - 50,
            y: body.get(`body1`).y,
          });
          updateXY();
          break;
        case "right":
          body.set(`body1`, {
            x: body.get(`body1`).x + 50,
            y: body.get(`body1`).y,
          });
          updateXY();
          break;
      }

      break;
    }
    body.set(`body${i}`, {
      x: body.get(`body${i - 1}`).x,
      y: body.get(`body${i - 1}`).y,
    });
  }
}

function updateXY() {
  xPos = body.get("body1").x;
  yPos = body.get("body1").y;
}

function randomCoord() {
  let random = Math.floor(Math.random() * 750);
  return random % 50 == 0 ? random : randomCoord();
}

function checkEat(x, y) {
  if (x == foodX && y == foodY) {
    foodX = randomCoord();
    foodY = randomCoord();
    snakeHeap = snakeHeap + 1;
    body.set(`body${snakeHeap}`, {
      x: body.get(`body${snakeHeap - 1}`).x,
      y: body.get(`body${snakeHeap - 1}`).y,
    });
  }
}

function throughWalls(x, y) {
  if (x < 0) {
    body.set("body1", { x: 800, y: body.get("body1").y });
    xPos = 800;
  } else if (x > 800) {
    body.set("body1", { x: 0, y: body.get("body1").y });
    xPos = 0;
  } else if (y < 0) {
    body.set("body1", { x: body.get("body1").x, y: 800 });
    yPos = 800;
  } else if (y > 800) {
    body.set("body1", { x: body.get("body1").x, y: 0 });
    yPos = 0;
  }
}
