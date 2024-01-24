class SnakeGame {
  constructor(command) {
    this.canvas = document.querySelector("canvas");
    this.buttonUp = document.querySelector(".up");
    this.buttonDown = document.querySelector(".down");
    this.buttonLeft = document.querySelector(".left");
    this.buttonRight = document.querySelector(".right");
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

    this.intervalID;

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
        if (this.command === null) {
          this.command = e.key;
        } else {
          if (
            (this.command === "ArrowUp" &&
              e.key === "ArrowDown" &&
              this.snakeHeap !== 1) ||
            (this.command === "ArrowDown" &&
              e.key === "ArrowUp" &&
              this.snakeHeap !== 1) ||
            (this.command === "ArrowLeft" &&
              e.key === "ArrowRight" &&
              this.snakeHeap !== 1) ||
            (this.command === "ArrowRight" &&
              e.key === "ArrowLeft" &&
              this.snakeHeap !== 1)
          ) {
            // If opposite arrow keys are pressed, return nothing
            // console.log("Oposite");
          } else {
            // Update command if not opposite arrow keys
            this.command = e.key;
          }
        }
      }
    });
  }

  start() {
    this.body.set("body1", { x: 150, y: 250 });
    this.xPos = this.body.get("body1").x;
    this.yPos = this.body.get("body1").y;
    this.intervalID = setInterval(() => this.gameLoop(), 300);
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
    this.buttonController();
    this.checkEat(this.xPos, this.yPos);
    this.throughWalls(this.xPos, this.yPos);
    this.draw();
  }

  buttonController() {
    this.buttonUp.addEventListener("click", () => (this.command = "ArrowUp"));
    this.buttonDown.addEventListener(
      "click",
      () => (this.command = "ArrowDown")
    );
    this.buttonLeft.addEventListener(
      "click",
      () => (this.command = "ArrowLeft")
    );
    this.buttonRight.addEventListener(
      "click",
      () => (this.command = "ArrowRight")
    );
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
    this.ctx.clearRect(0, 0, 800, 800);

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
    this.body.forEach((v, k) => {
      if (k !== "body1" && x === v.x && y === v.y && this.body.size > 2) {
        // this.command = "falied";
        clearInterval(this.intervalID);
        this.body.clear();
        this.snakeHeap = 1;
        this.start();
      }
    });
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

// function sound(src) {
//   let sound = document.createElement("audio");
//   sound.src = "eat.mp3";
//   sound.setAttribute("preload", "auto");
//   sound.setAttribute("controls", "none");
//   sound.style.display = "none";
//   document.body.appendChild(sound);
//   sound.play();
// }

// window.addEventListener("click", () => {
//   sound();
// });

const snakeGame = new SnakeGame();
