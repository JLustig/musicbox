var Synth = function(audiolet,frequency,release,attack){
    //console.log(frequency);
    //console.log(release);
    //console.log(attack);
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

function createBall(i,startvel){return {
  x: W/2,
  y: H/2,
  drag:false,
  scale:"min",
  arrow:false,
  
  radius: ballradius,
  color: 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')',
  
  // Velocity components
  vx:startx[i],
  vy:starty[i],
  audiolet : new Audiolet(),

  draw: function() {
    // Here, we'll first begin drawing the path and then use the arc() function to draw the circle. The arc function accepts 6 parameters, x position, y position, radius, start angle, end angle and a boolean for anti-clockwise direction.
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  },

  drawarrow: function(endX,endY) {
    var startX=this.x;
    var startY=this.y;
    var angle=Math.asin((endY-startY)/Math.sqrt(Math.pow(endX-startX,2)+Math.pow(endY-startY,2)))*(180/Math.PI);
    //FIX ME: A better way to calculate length of diagonals
    if(angle>-22.5 & angle<22.5){
      endY=startY;
    }else if(angle<-67.5 || angle>67.5){
      endX=startX;
    }else if((endX>startX & endY>startY) || (endX<startX & endY<startY)){
      endX=endY-startY+startX;
    }else{
      endX=-endY+startY+startX;
    }
    console.log(angle);
    console.log(Math.min(endY-startY,this.radius));
    console.log("drawing",startX,startY,"to",endX,endY);
    clearCanvas();
    drawGrid();
    ctx.beginPath();
    ctx.moveTo(startX, startY); 
    ctx.lineTo(endX, endY); 
    ctx.stroke(); 
    ctx.closePath();
    balls.forEach(function(ball){ball.draw()});
    //Rounding to nearest lower integer
    this.vx=((endX-startX)/10) | 0;
    this.vy=((endY-startY)/10) | 0;
  },

  //Plays some sweet tune when the ball bounces
  play: function() {
    //this.frequency = parseFloat(document.getElementById('frequency'+i).value);
    this.attack=parseFloat(document.getElementById('attack'+i).value);
    this.release=parseFloat(document.getElementById('release'+i).value);
    this.key=String(document.getElementById('key'+i).value);
    this.octave=parseInt(document.getElementById('octave'+i).value);
    //console.log(this.key);
    //console.log(this.scale);
    //console.log(this.octave);
    this.frequency = notes[ this.key ][ this.scale ][ this.octave ];
    //this.vx=parseInt(document.getElementById('vx'+i).value);
    //this.vy=parseInt(document.getElementById('vy'+i).value);
    this.synth = new Synth( this.audiolet,this.frequency,this.release,this.attack);
    this.synth.connect( this.audiolet.output );
  }

};}

function createBlock(x,y){return{
  x:x,
  y:y,

  draw: function(){
    ctx.drawImage(shapecachecanvas,0,0,W/nrofgridshapes,H/nrofgridshapes,this.x,this.y,W/nrofgridshapes,H/nrofgridshapes);   
  }
};}

function createOctagon(context,x,y,width,height,facShort,facLong){
      context.moveTo(x + width*facShort, y);
      context.lineTo(x, y + height*facShort);
      context.lineTo(x, y + height*facLong);
      context.lineTo(x + width*facShort, y + height);
      context.lineTo(x + width*facLong, y + height);
      context.lineTo(x + width, y + height*facLong);
      context.lineTo(x + width, y + height*facShort);
      context.lineTo(x + width*facLong, y);
      context.lineTo(x + width*facShort, y);
}

//Creates the grid (which is then put into the cached canvas)
function createGrid(){
  var facShort = 0.3,
    facLong = 1 - facShort;
  var x=0;
  var y=0;
  var height=H/nrofgridshapes;
  var width=W/nrofgridshapes;
  gridcache.beginPath();
  var cnt = 0;
    gridcache.strokeStyle='rgba(0,0,0,0.7)';
  for(j=width;j<=W;j+=width){
    for(i=height;i<=H;i+=height){
      cnt++;
      createOctagon(gridcache,x,y,width,height,facShort,facLong);
      y+=height;
    }
    y=0;
    x+=width;
  }
  gridcache.stroke();
  console.log(cnt);
  gridcache.closePath();  
}
createGrid();

//Draws the grid from the gridcached canvas to the main canvas
function drawGrid() {
  ctx.drawImage(gridcachecanvas,0,0);
}

function createShapes() {
  var facShort = 0.3,
    facLong=1-facShort,
    height=H/nrofgridshapes,
    width=W/nrofgridshapes,
    x=0,
    y=0;
  shapecache.beginPath();
  shapecache.strokeStyle='rgba(0,0,0,0000.1';
  shapecache.fillStyle='#545454';
  createOctagon(shapecache,x,y,width,height,facShort,facLong);
  shapecache.stroke();
  shapecache.fill();
  shapecache.closePath;
}
createShapes();


function setBlock(x,y) {
  balls.forEach(function(ball){
    console.log(ball.x,ball.y,x,y)
    if(ball.x==x & ball.y==y){
      return 0
    }
  })
  ctx.drawImage(shapecachecanvas,0,0,W/nrofgridshapes,H/nrofgridshapes,x,y,W/nrofgridshapes,H/nrofgridshapes);
  console.log("block");
  blocks.splice(blocks.length+1,0,createBlock(x,y));
  createBlock();
  correctpaths();
  update(false);
}

// When we do animations in canvas, we have to repaint the whole canvas in each frame. Either clear the whole area or paint it with some color. This helps in keeping the area clean without any repetition mess.
function clearCanvas() {
  ctx.clearRect(0, 0, W, H);
}

function bounce(ball){
  ball.y += ball.vy;
  ball.vy += gravity;
  ball.x += ball.vx;
  ball.vx += gravity;
  if(ball.y + ball.radius > H) {
    ball.play();
    ball.y = H - ball.radius;
    ball.vy *= -bounceFactor;
  }else if(ball.y - ball.radius < 0) {
    ball.play();
    ball.y = 0 + ball.radius;
    ball.vy *= -bounceFactor;
  }
  else if(ball.x + ball.radius > W) {
    ball.play();
    ball.x = W - ball.radius;
    ball.vx *= -bounceFactor;
  }
  else if(ball.x - ball.radius < 0) {
    ball.play();
    ball.x = 0 + ball.radius;
    ball.vx *= -bounceFactor;
  }//else if()
}

//Forces the balls to align within the shapes of the grid
function correctpaths(){

  balls.forEach(function(ball){
    var diff = ball.x % (W/nrofgridshapes);
    ball.x -= diff-(W/nrofgridshapes)/2;
    diff = ball.y % (H/nrofgridshapes);
    ball.y-=diff-(H/nrofgridshapes)/2;
  })
  blocks.forEach(function(block){
    diff = block.x % (W/nrofgridshapes);
    block.x-=diff;
    diff = block.y % (H/nrofgridshapes);
    block.y-=diff;
  })
}

function update(move) {
  clearCanvas();
  drawGrid();
  for(j=0;j<balls.length;j++){
    if(move==true){
      bounce(balls[j]);
    }
    balls[j].draw();
  }
  for(k=0;k<blocks.length;k++){
    blocks[k].draw();
  }
}

function stop() {
    clearInterval(refreshIntervalID);
    paused=true;
    correctpaths();
    update(false);
}
function start(){
  if(paused){
    correctpaths();
    // in setInterval, 1000/x depicts x fps! So, in this case, we are aiming for 60fps
    refreshIntervalID = setInterval(function(){update(true);}, 1000/60);
    paused=false;
  }
}

drawGrid();
for (i=0;i<nrofballs;i++){
  balls.splice(i,0,createBall(i));
  console.log(balls);
  createSliders(i);
}
