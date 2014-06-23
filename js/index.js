// Now some basic canvas stuff. Here we'll make a variable for the canvas and then initialize its 2d context for drawing

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

// Now setting the width and height of the canvas
var W = 760,
    H = 500;

// Applying these to the canvas element
canvas.height = H; canvas.width = W;

//Slidebar JQuery UI

$(function() {
  $( "#slider" ).slider({
      value:440,
      min: 0,
      max: 1000,
      step: 1,
      slide: function( event, ui ) {
        $( "#frequency" ).val(ui.value + " Hz" );
      }
    });
    $( "#frequency" ).val( $( "#slider").slider( "value" ) + " Hz" );
  });



var Synth = function(audiolet){
    var frequency = parseInt(document.getElementById('frequency').value);
    console.log(frequency);
    var attack=0.01;
    var release=0.6;
    AudioletGroup.apply(this, [audiolet, 0, 1]);
    // Basic wave
    this.sine = new Sine(audiolet, frequency);

    // Gain envelope
    this.gain = new Gain(audiolet);
    this.env = new PercussiveEnvelope(audiolet, 1, attack, release,
      function() {
        this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
      }.bind(this)
    );
    this.envMulAdd = new MulAdd(audiolet, 0.2, 0);

    // Main signal path
    this.sine.connect(this.gain);
    this.gain.connect(this.outputs[0]);

    // Envelope
    this.env.connect(this.envMulAdd);
    this.envMulAdd.connect(this.gain, 0, 1);
};
extend(Synth, AudioletGroup);


// First of all we'll create a ball object which will contain all the methods and variables specific to the ball.
// Lets define some variables first

var balls = [],
    nrofballs=3,
    gravity = 0,
    bounceFactor = 1,
    audiolet,
    synth;

// The ball object
// It will contain the following details
// 1) Its x and y position
// 2) Radius and color
// 3) Velocity vectors
// 4) the method to draw or paint it on the canvas

function createBall(){return {
  x: W/2,
  y: 50,
  
  radius: 15,
  color: "#DC3D24",
  
  // Velocity components
  vx: Math.random() * (10 - 1) + 1,
  vy: Math.random() * (10 - 1) + 1,
  audiolet : new Audiolet(),

  draw: function() {
    // Here, we'll first begin drawing the path and then use the arc() function to draw the circle. The arc function accepts 6 parameters, x position, y position, radius, start angle, end angle and a boolean for anti-clockwise direction.
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  },

  play: function() {
    this.synth = new Synth( this.audiolet);
    this.synth.connect( this.audiolet.output );
  }

};}

// When we do animations in canvas, we have to repaint the whole canvas in each frame. Either clear the whole area or paint it with some color. This helps in keeping the area clean without any repetition mess.
function clearCanvas() {
  ctx.clearRect(0, 0, W, H);
}

function bounce(ball){
    // Now, lets make the ball move by adding the velocity vectors to its position
  ball.y += ball.vy;
  // Lets add some acceleration
  ball.vy += gravity;
  //Perfect! Now, lets make it rebound when it touches the floor
  if(ball.y + ball.radius > H) {
    // First, reposition the ball on top of the floor and then bounce it!
    ball.y = H - ball.radius;
    ball.vy *= -bounceFactor;
    ball.play();
    // The bounceFactor variable that we created decides the elasticity or how elastic the collision will be. If it's 1, then the collision will be perfectly elastic. If 0, then it will be inelastic.
  }
  if(ball.y - ball.radius < 0) {
    // First, reposition the ball on top of the floor and then bounce it!
    ball.y = 0 + ball.radius;
    ball.vy *= -bounceFactor;
    ball.play();
    // The bounceFactor variable that we created decides the elasticity or how elastic the collision will be. If it's 1, then the collision will be perfectly elastic. If 0, then it will be inelastic.
  }

    // Now, lets make the ball move by adding the velocity vectors to its position
  ball.x += ball.vx;
  // Lets add some acceleration
  ball.vx += gravity;
  //Now, lets make it rebound when it touches the floor
  if(ball.x + ball.radius > W) {
    // First, reposition the ball on top of the floor and then bounce it!
    ball.x = W - ball.radius;
    ball.vx *= -bounceFactor;
    ball.play();
    // The bounceFactor variable that we created decides the elasticity or how elastic the collision will be. If it's 1, then the collision will be perfectly elastic. If 0, then it will be inelastic.
  }
  if(ball.x - ball.radius < 0) {
    // First, reposition the ball on top of the floor and then bounce it!
    ball.x = 0 + ball.radius;
    ball.vx *= -bounceFactor;
    ball.play();
    // The bounceFactor variable that we created decides the elasticity or how elastic the collision will be. If it's 1, then the collision will be perfectly elastic. If 0, then it will be inelastic.
  }
}

// A function that will update the position of the ball is also needed. Lets create one
function update() {
  clearCanvas();
  for(j=0;j<balls.length;j++){
    balls[j].draw();
    bounce(balls[j]);
  }
}

// in setInterval, 1000/x depicts x fps! So, in this casse, we are aiming for 60fps for smoother animations.

function stop() {
    clearInterval(refreshIntervalID);
}
function start(){
  refreshIntervalID = setInterval(update, 1000/60);
}

for (i=0;i<nrofballs;i++){
  balls.splice(i,0,createBall());
  console.log(balls);
}
