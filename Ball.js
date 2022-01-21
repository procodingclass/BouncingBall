class Ball {
  constructor(x, y, r) {
    var options = { restitution: 0.4};

    this.body = Bodies.rectangle(x, y, r, r, options);

    this.x = x;
    this.y = y;
    this.r = r;
    this.image = loadImage("ball.png");

    World.add(world, this.body);
  }

  overlap(x2, y2, w2, h2) {
    var x1 = this.body.position.x;
    var y1 = this.body.position.y;
    var w1 = this.r;
    var h1 = this.r;
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
      return false;
    }

    return true;
  }

  display() {
    var pos = this.body.position;
    var angle = this.body.angle;
    if(gameState !== "end"){
      push();
      translate(pos.x, pos.y);
      rotate(angle);
      imageMode(CENTER);
      image(this.image, 0, 0, this.r, this.r);
      pop();
    }
  }
}
