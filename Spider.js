class Spider {
    constructor(x, y, width, height, img) {
        var options ={
            mass : 6
        }
      
      this.body = Bodies.rectangle(x, y, width, height, options);
      this.width = width;
      this.height = height;
      this.image = img;
  
      World.add(world, this.body);
    }
  
    display() {
      var pos = this.body.position;
    
      push();
      translate(pos.x, pos.y);
      
      imageMode(CENTER);
      image(this.image, 0, 0, this.width, this.height);
      pop();
    }
  }
  