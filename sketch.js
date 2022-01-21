const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var engine, world;
var ball, ringImg, homeImg;
var spider, spiderImg;
var gameState = "initial";
var numOfRings = 0;

var bricks = [
  { x: 600, y: 20, w: 1200, h: 40 }, //upperbrick
  { x: 550, y: 450, w: 1200, h: 40 }, // lowerbrick 1
  { x: 15, y: 235, w: 40, h: 390 }, // left brick
  { x: 300, y: 165, w: 200, h: 250 },
  { x: 700, y: 420, w: 50, h: 25 },
  { x: 730, y: 395, w: 50, h: 25 },
  { x: 760, y: 370, w: 50, h: 25 },
  { x: 920, y: 420, w: 50, h: 25 },
  { x: 890, y: 395, w: 50, h: 25 },
  { x: 850, y: 370, w: 50, h: 25 },
  { x: 800, y: 150, w: 250, h: 40 },
  { x: 945, y: 105, w: 40, h: 130 },
  { x: 1100, y: 350, w: 100, h: 160 },
  { x: 1900, y: 450, w: 1400, h: 40 }, // lowerbrick 2
  { x: 1900, y: 20, w: 1400, h: 40 }, //upperbrick 2
  { x: 1250, y: 350, w: 100, h: 160 },
  { x: 1425, y: 290, w: 250, h: 40 },
  { x: 1700, y: 290, w: 150, h: 40 },
  { x: 1700, y: 330, w: 80, h: 40 },
  { x: 1700, y: 330, w: 80, h: 40 },
  { x: 1980, y: 290, w: 250, h: 40 },
  { x: 2155, y: 350, w: 100, h: 160 },
  { x: 1900, y: 60, w: 250, h: 40 },
  { x: 1900, y: 100, w: 200, h: 40 },
  { x: 1900, y: 140, w: 150, h: 40 },
  { x: 2500, y: 190, w: 200, h: 300 }, // right brick
];

var rings = [
  { x: 300, y: 380, isCollected: false },
  { x: 800, y: 90, isCollected: false },
  { x: 810, y: 320, isCollected: false },
  { x: 1180, y: 130, isCollected: false },
  { x: 1500, y: 380, isCollected: false },
  { x: 1950, y: 380, isCollected: false },
  { x: 1950, y: 220, isCollected: false },
  { x: 1700, y: 220, isCollected: false },
  { x: 2300, y: 200, isCollected: false },
];
var allbricks = [];
var vY = -2;

function preload() {
  ringImg = loadImage("ring.png");
  homeImg = loadImage("home.png");
  spiderImg = loadImage("spider.png");
  brickImg = loadImage("brick.png");
  collectRing = loadSound("collect.mp3");
}

function setup() {
  canvas = createCanvas(950, 470);
  engine = Engine.create();
  world = engine.world;

  ball = new Ball(50, height / 2, 50);

  spider = new Spider(2300, height / 2, 50, 50, spiderImg);

  for (var i in bricks) {
    var brick = new Box(
      bricks[i].x,
      bricks[i].y,
      bricks[i].w,
      bricks[i].h,
      brickImg,
      true
    );
    allbricks.push(brick);
  }
}

function draw() {
  background("#84ffff");
  Engine.update(engine);

  ball.display();
  displayBricks();

  playerControls();
  spiderControls();
  ringControls();

  if (ball.body.position.x > 850) {
    gameState = "win";
  }
  showMessages();
  console.log();
}

function playerControls() {
  if (keyIsDown(RIGHT_ARROW) && (gameState === "play" || gameState === "initial")) {
    
    if (gameState === "initial") {
      gameState = "play";
    }

    if (ball.body.position.x < 470 || allbricks[3].body.position.x <= -1300) {
      moveBody(ball.body, 3, "x");
    }

    if (allbricks[3].body.position.x > -1300) {
      // Loop for bricks or Bricks
      for (var i = 0; i < allbricks.length; i++) {
        moveBody(allbricks[i].body, -3, "x");
      }
      moveBody(spider.body, -3, "x");
      // Loop for rings
      for (var j = 0; j < rings.length; j++) {
        rings[j].x -= 3;
      }
    }
  }

  if (keyIsDown(LEFT_ARROW) && gameState === "play") {
    if (ball.body.position.x > 470 || allbricks[3].body.position.x >= 300) {
      moveBody(ball.body, -3, "x");
    }

    if (allbricks[3].body.position.x < 300) {
      for (var i = 0; i < allbricks.length; i++) {
        moveBody(allbricks[i].body, 3, "x");
      }
      moveBody(spider.body, 3, "x");
      // move the rings
      for (var j = 0; j < rings.length; j++) {
        rings[j].x += 3;
      }
    }
  }

  if (keyIsDown(UP_ARROW)) {
    Matter.Body.applyForce(
      ball.body,
      { x: ball.body.position.x, y: ball.body.position.y },
      { x: 0, y: -0.004 }
    );
  }
}

function spiderControls() {
  spider.display();

  if (spider.body.position.y <= 80) {
    vY = 2;
  }

  if (spider.body.position.y >= 400) {
    vY = -2;
  }

  Matter.Body.setVelocity(spider.body, { x: 0, y: vY });

  var spider_overlap = ball.overlap(
    spider.body.position.x,
    spider.body.position.y,
    50,
    50
  );
  if (spider_overlap) {
    // World.remove(world,ball.body);
    gameState = "end";
  }
}

function ringControls() {
  for (var i = 0; i < rings.length; i++) {
    imageMode(CENTER);
    image(ringImg, rings[i].x, rings[i].y, 40, 80);

    var overlaped = ball.overlap(rings[i].x, rings[i].y, 40, 80);
    if (overlaped) {
      rings.splice(i, 1);
      numOfRings = numOfRings + 1;
      collectRing.play();
    }
  }
}

function showMessages() {
  textSize(23);
  stroke(15);
  fill("black");
  if (gameState === "initial") {
    text("PRESS RIGHT ARROW TO MOVE THE BALL", width / 3.5, height / 2);
  }

  if (gameState === "win") {
    text("AWESOME YOU WIN!", width / 3, height / 2);
  }
  if (gameState === "end") {
    text("GAME OVER", width / 3, height / 2);
  }

  image(ringImg, 55, 80, 10, 20);
  text(numOfRings, 70, 87);
}

function displayBricks() {
  for (var i = 0; i < allbricks.length; i++) {
    allbricks[i].display();
  }
  if (allbricks[3].body.position.x < -1300) {
    push();
    imageMode(CENTER);
    image(homeImg, 900, 385, 100, 90);
    pop();
  }
}
function moveBody(body, position, direction) {
  if (direction === "x") {
    Matter.Body.setPosition(body, {
      x: body.position.x + position,
      y: body.position.y,
    });
  }
  if (direction === "y") {
    Matter.Body.setPosition(body, {
      x: body.position.x,
      y: body.position.y + position,
    });
  }
}
