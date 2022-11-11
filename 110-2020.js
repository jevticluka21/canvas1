// Inicijalizacija kanvasa

let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = '#fff'
let c = canvas.getContext('2d');
//inicijalizujemo promenljive x,y
var mouse = {
  x: innerWidth/2,
  y: innerHeight/2
}
//pratimo kretanje kursora
window.addEventListener('mousemove', e => {
  mouse.x = event.x;
  mouse.y = event.y;
})
//Stavljamo velicinu canvasa da bude velicine rezolucije monitora
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // init();
})

let colorArray = ['#4A849F','#1B3440','#B4D6C6','#F2845C']
//Funkcija krug za crtanje kruga
function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: dx,
    y: dy,
  }
  this.radius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.mass = 1;
  this.opacity = 0.2;
}
//Crtanje kruga
Circle.prototype.draw = function() {
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.save();
  c.globalAlpha = this.opacity;
  c.fillStyle = this.color;
  c.fill();
  c.restore();
  c.strokeStyle = this.color;
  c.stroke();
  c.closePath();
}
//Funkcija za kretanje krugova
Circle.prototype.update = function() {
if (this.x + this.radius > innerWidth || this.x - this.radius < 0) 
  this.velocity.x = -this.velocity.x;

if (this.y + this.radius > innerHeight || this.y - this.radius < 0)
  this.velocity.y = -this.velocity.y;

this.x += this.velocity.x;
this.y += this.velocity.y;

for (let i = 0; i < circleArray.length; i++) {
  if (this == circleArray[i]) continue;

  if (getDistance(this.x, this.y, circleArray[i].x, circleArray[i].y) <= this.radius + circleArray[i].radius) {
    resolveCollision(this, circleArray[i]);
  }
}

// interakcija sa drugim krugovima
if (mouse.x - this.x < 80 && mouse.x - this.x > -80 && mouse.y - this.y < 120  && mouse.y - this.y > -120) {
  if (this.opacity < 1)
  this.opacity += 0.1;
} else if (this.opacity > 0.2) {  
  this.opacity -= 0.1;
}
}


// detekcija kolizije

//Rotiranje u slucaju kolizije
function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

//Menja koordinate i ubrzanje krugova u slucaju kolizije
function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Sprecava slucajna preklapanja krugova
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // ovde uzimamo uglove izmedju sudarenih krugova
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

     
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Konacna brzina nakon izracunavanaja ugla i brzine sudara
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
  }
}  

// Pitagorina teorema 
function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
  // return Math.sqrt(xDistance**2 + yDistance**2)
}

// Implementacija
let circleArray = [];
let circle;
function init() {
  for (let i = 0; i < 100; i++) {
    let radius = 15;
    let x = Math.random() * (innerWidth - radius * 2) + radius;
    let y = Math.random() * (innerHeight - radius * 2) + radius;
    let dx = (Math.random() - 0.5) * 5;
    let dy = (Math.random() - 0.5) * 5;

    // vodimo racuna da se krugovi ne preklapaju
    for (let j = 0; j < circleArray.length; j++) {
      if (getDistance(x, y, circleArray[j].x, circleArray[j].y) < 2* radius) {
        // generisemo nove vrednosti
        x = Math.random() * (innerWidth - radius * 2) + radius;
        y = Math.random() * (innerHeight - radius * 2) + radius;

        // restartujemo loop
        j = -1;        
      }
    }

    circle = new Circle(x, y, dx, dy, radius);
    circleArray.push(circle)
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  
  circleArray.forEach(circle => {
    circle.draw();
    circle.update();
  })    
}

init()
animate();
