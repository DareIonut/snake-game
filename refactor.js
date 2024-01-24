const canvas = document.querySelector("canvas").getContext("2d");
const canvasSquareSize = 800;
const randomCoord = () => {
  let random = Math.floor(Math.random() * 750);
  return random % 100 == 0 ? random : randomCoord();
};

let keySwitch;
window.addEventListener("keydown", (e) => {
  keySwitch = e.key;
});

const snakeBody = [];

class Snake {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  draw() {
    canvas.fillStyle = "black";
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    switch (keySwitch) {
      case "ArrowUp":
        this.y -= 100;
        break;
      case "ArrowDown":
        this.y += 100;
        break;
      case "ArrowRight":
        this.x += 100;
        break;
      case "ArrowLeft":
        this.x -= 100;
      default:
        break;
    }
  }
}

class Food extends Snake {
  constructor(width, height, x, y) {
    super(width, height, x, y);
  }
  draw() {
    canvas.fillStyle = "red";
    canvas.fillRect(this.x, this.y, this.width, this.height);
  }
  changeCoord() {
    this.x = randomCoord();
    this.y = randomCoord();
  }
}

const snake = new Snake(100, 100, 100, 100);
snake.draw();

const food = new Food(100, 100, randomCoord(), randomCoord());

function loop() {
  canvas.clearRect(0, 0, canvasSquareSize, canvasSquareSize);
  if (snake.x == food.x && snake.y == food.y) {
    food.changeCoord();
    snakeBody.push(snake);
    console.log(snakeBody);
  }
  for (body of snakeBody) {
    body.update();
    body.draw();
  }
  snake.update();
  snake.draw();
  food.draw();
}

setInterval(loop, 300);
