const canvas = document.querySelector("#sky"),

      canvasHeight = document.body.clientHeight,
      canvasWidth  = document.body.clientWidth;

      canvas.setAttribute("height", canvasHeight);
      canvas.setAttribute("width", canvasWidth);

let ctx = canvas.getContext("2d");

class Boid {

  constructor(x, y, dir, size) {

    this.x    = x; 
    this.y    = y; 
    this.dir  = dir; 
    this.size = size;
  }

}

class Flock {

  constructor() {

    this.flockSize  = 500;
    this.speed      = 5;
    this.boids      = [];

  }

  init() {

    this.populate();

    requestAnimationFrame(this.logic.bind(this));

  }

  populate() {

    for(let i = 0; i < this.flockSize; i++) {
      this.boids.push(new Boid(
        Math.floor(Math.random() * canvasWidth),
        Math.floor(Math.random() * canvasHeight),
        Math.random() * 360,
        (canvasHeight / canvasWidth) * 5
      ));
    }

  }

  draw() {

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for(let {x, y, size, dir} of this.boids) {

      ctx.beginPath();
      ctx.moveTo(x + (size / 2), y + (size / 2));
      ctx.lineTo((x + (size / 2)) + (10 * Math.cos((dir / 180) * Math.PI)),(y + (size / 2)) + (10 * Math.sin(( dir / 180) * Math.PI)));
      ctx.lineTo(x + (size * 2), y);
      ctx.fill();

    }

  }

  checkCollision(boid) {

    if(boid.x > canvasWidth)  boid.x = 0;
    if(boid.y > canvasHeight) boid.y = 0;
    if(boid.x < 0) boid.x = canvasWidth;
    if(boid.y < 0) boid.y = canvasHeight;

  }

  logic() {

    let center = {
      x: 0,
      y: 0
    },
    
    radius  = 50,
    count   = 0,
    distance = 0;

    for(let boid of this.boids) {

      this.boids.forEach(b => {
        distance = this.dist(boid, b);

        if(boid !== b && distance < radius) {

          center.x += b.x;
          center.y += b.y;
  
          count++;
  
        }
      });

      if(count > 1) {

        center.x /= count;
        center.y /= count;

      } else {

        center.x = Math.random() * canvasWidth;
        center.y = Math.random() * canvasHeight;

      }

      let difference  = Math.atan2(boid.y - center.y, boid.x - center.x) * (180.0 / Math.PI),
          newDir      = (((boid.dir - difference) % 360) + 540) % 360 - 180;

      boid.dir += newDir * 0.07;

      boid.x += 5 * Math.cos((boid.dir / 180) * Math.PI);
      boid.y += 5 * Math.sin((boid.dir / 180) * Math.PI);

      this.checkCollision(boid);
      
    }

    this.draw();

    requestAnimationFrame(this.logic.bind(this));

  }

  dist(a, b) {
    let x = Math.abs(a.x, b.x),
        y = Math.abs(a.y, b.y);

    return Math.sqrt((x * x) + (y * y));
  }
}

new Flock().init();
