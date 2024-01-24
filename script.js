class SnakeGame {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.xPos = 0;
    this.yPos = 0;
    this.width = 50;
    this.height = 50;
    this.command = null;

    this.imgSnake = this.createImage("head.png");
    this.imgBody = this.createImage("body.png");
    this.imgFood = this.createImage("food.png");

    this.foodX = this.randomCoord();
    this.foodY = this.randomCoord();

    this.body = new Map();
    this.snakeHeap = 1;

    this.setupEventListeners();
    this.start();
  }

  createImage(src) {
    const img = document.createElement("img");
    img.src = src;
    return img;
  }

  setupEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        this.command = e.key;
      }
    });
  }

  start() {
    this.body.set("body1", { x: 150, y: 250 });
    this.xPos = this.body.get("body1").x;
    this.yPos = this.body.get("body1").y;
    setInterval(() => this.gameLoop(), 300);
  }

  gameLoop() {
    switch (this.command) {
      case "ArrowUp":
        this.move("up");
        break;
      case "ArrowDown":
        this.move("down");
        break;
      case "ArrowRight":
        this.move("right");
        break;
      case "ArrowLeft":
        this.move("left");
        break;
      default:
        break;
    }

    this.checkEat(this.xPos, this.yPos);
    this.throughWalls(this.xPos, this.yPos);
    this.draw();
  }

  draw() {
    this.body.forEach((e) => {
      if (e.x === this.xPos && e.y === this.yPos) {
        this.ctx.drawImage(this.imgSnake, e.x, e.y, this.width, this.height);
      } else {
        this.ctx.drawImage(this.imgBody, e.x, e.y, this.width, this.height);
      }
    });
    this.ctx.drawImage(
      this.imgFood,
      this.foodX,
      this.foodY,
      this.width,
      this.height
    );
  }

  move(arrow) {
    this.ctx.clearRect(
      this.body.get(`body${this.snakeHeap}`).x,
      this.body.get(`body${this.snakeHeap}`).y,
      this.width,
      this.height
    );

    for (let i = this.snakeHeap; i >= 1; i--) {
      if (i === 1) {
        switch (arrow) {
          case "up":
            this.body.set(`body1`, {
              x: this.body.get(`body1`).x,
              y: this.body.get(`body1`).y - this.height,
            });
            this.updateXY();
            break;
          case "down":
            this.body.set(`body1`, {
              x: this.body.get(`body1`).x,
              y: this.body.get(`body1`).y + this.height,
            });
            this.updateXY();
            break;
          case "left":
            this.body.set(`body1`, {
              x: this.body.get(`body1`).x - this.width,
              y: this.body.get(`body1`).y,
            });
            this.updateXY();
            break;
          case "right":
            this.body.set(`body1`, {
              x: this.body.get(`body1`).x + this.width,
              y: this.body.get(`body1`).y,
            });
            this.updateXY();
            break;
        }
        break;
      }
      this.body.set(`body${i}`, {
        x: this.body.get(`body${i - 1}`).x,
        y: this.body.get(`body${i - 1}`).y,
      });
    }
  }

  updateXY() {
    this.xPos = this.body.get("body1").x;
    this.yPos = this.body.get("body1").y;
  }

  randomCoord() {
    let random = Math.floor(Math.random() * 750);
    return random % this.width === 0 ? random : this.randomCoord();
  }

  checkEat(x, y) {
    if (x === this.foodX && y === this.foodY) {
      this.foodX = this.randomCoord();
      this.foodY = this.randomCoord();
      this.snakeHeap += 1;
      this.body.set(`body${this.snakeHeap}`, {
        x: this.body.get(`body${this.snakeHeap - 1}`).x,
        y: this.body.get(`body${this.snakeHeap - 1}`).y,
      });
    }
  }

  throughWalls(x, y) {
    if (x < 0) {
      this.body.set("body1", {
        x: this.canvas.width - this.width,
        y: this.body.get("body1").y,
      });
      this.xPos = this.canvas.width - this.width;
    } else if (x > this.canvas.width - this.width) {
      this.body.set("body1", { x: 0, y: this.body.get("body1").y });
      this.xPos = 0;
    } else if (y < 0) {
      this.body.set("body1", {
        x: this.body.get("body1").x,
        y: this.canvas.height - this.height,
      });
      this.yPos = this.canvas.height - this.height;
    } else if (y > this.canvas.height - this.height) {
      this.body.set("body1", { x: this.body.get("body1").x, y: 0 });
      this.yPos = 0;
    }
  }
}

const snakeGame = new SnakeGame();
