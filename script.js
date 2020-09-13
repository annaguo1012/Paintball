// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global createCanvas, key, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, text, mouseX, mouseY, 
          strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, noFill, ellipseMode, cos, sin
          triangle, mouseButton, LEFT, RIGHT, quad, circle, createFileInput, createImg, mousePressed, mouseReleased, rotate,randomGaussian, atan */

// obstacles is an array of obstacles
// paintBalls is an array of paintballs that have not splattered
let tempX1,
  tempY1,
  tempX2,
  tempY2,
  X1,
  X2,
  Y1,
  Y2,
  color1,
  color2,
  color3,
  color4,
  currentColor;
let obstacle = [];
let paintBalls = [];
let testBall;
//gravity
let g = 1;

function setup() {
  // Canvas & color settings
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100);
  background(95);
  currentColor = (0, 0, 0);
  //ne(1,1,100,100)
  //ll(color(255,204,0))
  //lipse(mouseX, mouseY,50)
}

function draw() {
  background(95);
  fill(0, 0, 0);
  noStroke();
  text("Press A to release ball", 10, 30);
  text("hold and drag mouse to place obstacle", 10, 50);
  //stroke(0)
  //line(0,height - 250, width, height-250)
  drawPalettes();

  for (var i = 0; i < paintBalls.length; i++) {
    if (paintBalls[i]) {
      //push()
      var validBall = paintBalls[i].display();
      //pop()
      if (validBall == -1) {
        paintBalls.splice(i, 1);
      }
    }
  }
  for (var j = 0; j < obstacle.length; j++) {
    obstacle[j].draw();
  }
  //if(testBall)testBall.display();

  //elasticLine();
  //solidLine();
}

function keyPressed() {
  if (key == "a") {
    //new Ball(mouseX, mouseY)
    //line(1,1,100,100)
    paintBalls.push(new Ball(mouseX, mouseY, 30));

    //fill(color(255,204,0))
    //ellipse(mouseX, mouseY, 50)
    //testBall = new Ball(mouseX, mouseY);
  }

  //press c to clear
  else if (key == "c") {
    obstacle = [];
    paintBalls = [];
    background(95);
  }
}

function mousePressed() {
  if (mouseY >= 25 && mouseY <= 75) {
    if (mouseX >= width - 75 && mouseX <= width - 25) {
      currentColor = color1;
    }
    if (mouseX >= width - 150 && mouseX <= width - 100) {
      currentColor = color2;
    }
    if (mouseX >= width - 225 && mouseX <= width - 175) {
      currentColor = color3;
    }
    if (mouseX >= width - 300 && mouseX <= width - 250) {
      currentColor = color4;
    }
  } 
  if (mouseButton === LEFT || mouseButton === RIGHT) {
    
    X1 = mouseX;
    Y1 = mouseY;
  }
}

function mouseReleased() {
 
  if (mouseButton === LEFT) {
    //line(50, 50, 50, 150)  
    obstacle.push(new Line(X1, Y1, mouseX, mouseY, "solid"));
  } else if (mouseButton === RIGHT) {
    obstacle.push(new Line(X1, Y1, mouseX, mouseY, "elastic"));
  }

}
function drawPalettes() {
  //line(1,1,100,100)
  color1 = color(44, 100, 100);
  color2 = color(199, 100, 94);
  color3 = color(79, 100, 73);
  color4 = color(13, 86, 95);
  noStroke();
  fill(color1);
  ellipse(width - 50, 50, 50);
  fill(color2);
  ellipse(width - 125, 50, 50);
  fill(color3);
  ellipse(width - 200, 50, 50);
  fill(color4);
  ellipse(width - 275, 50, 50);
  stroke(200);
}

class Line {
  constructor(x1, y1, x2, y2, type) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.slope = (y2 - y1) / (x2 - x1);
    this.type = type;
  }

  draw() {
    stroke(167);
    if (this.type === "solid") {
      strokeWeight(4);
      stroke(63);
      if (
        sqrt(
          (this.x1 - this.x2) * (this.x1 - this.x2) +
            (this.y1 - this.y2) * (this.y1 - this.y2)
        ) > 40
      ) {
        line(this.x1, this.y1, this.x2, this.y2);
      }
    } else if (this.type === "elastic") {
      strokeWeight(2);
      stroke(114);
      if (
        sqrt(
          (this.x1 - this.x2) * (this.x1 - this.x2) +
            (this.y1 - this.y2) * (this.y1 - this.y2)
        ) > 40
      ) {
        line(this.x1, this.y1, this.x2, this.y2);
      }
    }
  }
}
class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.radius = radius;
    this.color = currentColor;
    this.live = true;
  }
  display() {
    //3 cases: passes thru floor, gone. Hits something, becomes splatter. Else, its still live and moving
    if (this.passedThruFloor()) {
      return -1;
    }
    if (this.collisionCheck() || !this.live) {
      this.splatter();
      this.live = false;
      return -1;
    } else if (this.live) {
      this.yVelocity += g;
      this.x += this.xVelocity;
      this.y += this.yVelocity;

      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, this.radius);
      //ellipse(50,50,50);
    }
  }

  splatter() {
    //todo
    //on hit produce a lot of small paintballs of varying position of small size to mimic splatter effect

    for (var i = 0; i < (this.radius / 12) * (this.radius / 12); i++) {
      paintBalls.push(
        new Paint(
          this.x + Math.floor(randomGaussian(0, 0.1) * 30),
          this.y + Math.floor(randomGaussian(0, 0.3) * this.radius + 40), //get rid of +15 when angles
          //below is angle, change later
          atan2(this.yVelocity / this.xVelocity),
          //-3.14/4,
          15,
          this.color,
          sqrt(
            this.xVelocity * this.xVelocity + this.yVelocity * this.yVelocity
          )
        )
      );
    }
  }
  collisionCheck() {
    /*
    for(var b = 0; b < obstacle.length; b++){
      
    }
    */
    //first try with checking position each time
    var xIntersect = false;
    var yIntersect = false;
    for (var a = 0; a < obstacle.length; a++) {
      if (obstacle[a].x1 < obstacle[a].x2) {
        if (this.x + this.radius >= obstacle[a].x1 && this.x - this.radius <= obstacle[a].x2) {
            xIntersect = true;
        }
      }
      else{
        if(obstacle[a].x1 < obstacle[a].x2){
          xIntersect = true;
        }
      }
      if(xIntersect){
        if (obstacle[a].y1 < obstacle[a].y2) {
        if (this.y + this.radius >= obstacle[a].y1 && this.y - this.radius <= obstacle[a].y2) {
            yIntersect = true;
        }
      }
      else{
        if (this.y + this.radius <= obstacle[a].y1 && this.y - this.radius >= obstacle[a].y2) {
            yIntersect = true;
        }
      }
      }          
      if (yIntersect) {
            if (obstacle[a].type == "elastic") {
              return false;
            } else {
              return true;
        }
      }
    }
    if (this.y > height - 150) {
      return true;
    } else {
      return false;
    }
  }
  passedThruFloor() {
    //todo
    return false;
  }
}

class Paint {
  constructor(x, y, angle, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.angle = angle;
    this.radius = radius;
    this.color = color;
    this.ticker = 0;
  }
  display() {
    //push();
    fill(this.color);

    noStroke();
    //ellipseMode(CORNERS)
    //console.log(sin(this.angle))
    //ellipse(this.x-cos(this.angle)*this.radius, this.y-sin(this.angle)*this.radius, this.x+cos(this.angle)*this.radius*3, this.y+sin(this.angle)*this.radius*3);
    //pop();
    //ellipseMode(CENTER)

    push();
    //translate(this.x+ Math.floor(randomGaussian(0,0.1) * (30)), this.y+ Math.floor(randomGaussian(0,0.3) * (this.radius)+15))
    translate(this.x, this.y);
    rotate(this.angle);
    ellipse(0, 0, this.radius, this.radius * 3);

    //ellipse(this.x, this.y, this.radius, this.radius*3)
    pop();
  }
}
