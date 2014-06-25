// Now some basic canvas stuff. Here we'll make a variable for the canvas and then initialize its 2d context for drawing
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

// Now setting the width and height of the canvas
var W = 760,
    H = 760;

// Applying these to the canvas element
canvas.height = H; canvas.width = W;

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

var balls = [],
    nrofballs=4,
    startx=[10,0,5],
    starty=[10,-10,0],
    gravity = 0,
    bounceFactor = 1,
    audiolet,
    synth,
    frequency,
    release,
    attack;

function createBall(i,startvel){return {
  x: W/2,
  y: H/2,
  drag:false,
  
  radius: 15,
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

  play: function() {
    this.frequency = parseFloat(document.getElementById('frequency'+i).value);
    this.attack=parseFloat(document.getElementById('attack'+i).value);
    this.release=parseFloat(document.getElementById('release'+i).value);
    //this.vx=parseInt(document.getElementById('vx'+i).value);
    //this.vy=parseInt(document.getElementById('vy'+i).value);
    this.synth = new Synth( this.audiolet,this.frequency,this.release,this.attack);
    this.synth.connect( this.audiolet.output );
  }

};}

// When we do animations in canvas, we have to repaint the whole canvas in each frame. Either clear the whole area or paint it with some color. This helps in keeping the area clean without any repetition mess.
function clearCanvas() {
  ctx.clearRect(0, 0, W, H);
}

function bounce(ball){
  ball.y += ball.vy;
  ball.vy += gravity;
  if(ball.y + ball.radius > H) {
    ball.play();
    ball.y = H - ball.radius;
    ball.vy *= -bounceFactor;
  }
  if(ball.y - ball.radius < 0) {
    ball.play();
    ball.y = 0 + ball.radius;
    ball.vy *= -bounceFactor;
  }
  ball.x += ball.vx;
  ball.vx += gravity;
  if(ball.x + ball.radius > W) {
    ball.play();
    ball.x = W - ball.radius;
    ball.vx *= -bounceFactor;
  }
  if(ball.x - ball.radius < 0) {
    ball.play();
    ball.x = 0 + ball.radius;
    ball.vx *= -bounceFactor;
  }
}

function update(move) {
  clearCanvas();
  for(j=0;j<balls.length;j++){
    balls[j].draw();
    if(move==true){
      bounce(balls[j]);
    }
  }
}

// in setInterval, 1000/x depicts x fps! So, in this casse, we are aiming for 60fps for smoother animations.

function stop() {
    clearInterval(refreshIntervalID);
}
function start(){
  refreshIntervalID = setInterval(function(){update(true);}, 1000/60);
}

//Create eventlistener
var elem = document.getElementById('canvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('ctx'),
    elements = balls;

// Add event listener for `click` events.
elem.addEventListener('mousedown', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    // Collision detection
    elements.forEach(function(element) {
        if (y > element.y-15 && y < element.y+15 
            && x > element.x-15 && x < element.x+15) {
            console.log("drag");
            element.drag=true;

        }
    });

}, false);

elem.addEventListener('mouseup', function(event) {
    var x = event.pageX - elemLeft,
    y = event.pageY - elemTop;
    console.log("drop");
    elements.forEach(function(element) {
      if(element.drag==true){
        element.x=x;
        element.y=y;
        element.drag=false;
        update(false);
      }
    })


}, false);


//Slidebar JQuery UI
function createSliders(i){
    var output = document.getElementById('buttoncontainer');
    var val="";

    var ballbutton = document.createElement("button");
    ballbutton.setAttribute("id","ballbutton"+i);
    ballbutton.innerHTML="Ball " +i;
    output.appendChild(ballbutton);

    output = document.getElementById('slidercontainer');

    if(!document.getElementById('slidercontainer'+i))
    {
        var div = document.createElement("div");
        div.innerHTML="Ball nr: " +i;
        div.setAttribute("id","sliderview"+i);
        div.setAttribute("style","display:none;");

        //Frequency
        var p = document.createElement("p");
        div.appendChild(p);
        var frequencylabel = document.createElement("label");
        frequencylabel.setAttribute("for","frequency"+i);
        frequencylabel.innerHTML="Frequency:";
        var frequencyinput = document.createElement("input");
        frequencyinput.setAttribute("type","input");
        frequencyinput.setAttribute("id","frequency"+i);
        var frequencyslider = document.createElement("div");
        frequencyslider.setAttribute("id","frequencyslider"+i)
        p.appendChild(frequencylabel);
        p.appendChild(frequencyinput);
        p.appendChild(frequencyslider);

        //Release
        var p = document.createElement("p");
        div.appendChild(p);
        var releaselabel = document.createElement("label");
        releaselabel.setAttribute("for","release"+i);
        releaselabel.innerHTML="Release:";
        var releaseinput = document.createElement("input");
        releaseinput.setAttribute("type","input");
        releaseinput.setAttribute("id","release"+i);
        var releaseslider = document.createElement("div");
        releaseslider.setAttribute("id","releaseslider"+i)
        p.appendChild(releaselabel);
        p.appendChild(releaseinput);
        p.appendChild(releaseslider);

        //Attack
        var p = document.createElement("p");
        div.appendChild(p);
        var attacklabel = document.createElement("label");
        attacklabel.setAttribute("for","attack"+i);
        attacklabel.innerHTML="Attack:";
        var attackinput = document.createElement("input");
        attackinput.setAttribute("type","input");
        attackinput.setAttribute("id","attack"+i);
        var attackslider = document.createElement("div");
        attackslider.setAttribute("id","attackslider"+i)
        p.appendChild(attacklabel);
        p.appendChild(attackinput);
        p.appendChild(attackslider);

        /*Velocity
        var p = document.createElement("p");
        div.appendChild(p);
        var velocitylabel = document.createElement("label");
        velocitylabel.setAttribute("for","velocity"+i);
        velocitylabel.innerHTML="Velocity";
        var vxinput = document.createElement("input");
        var vyinput = document.createElement("input");
        vxinput.setAttribute("type","input");
        vxinput.setAttribute("id","vx"+i);
        vyinput.setAttribute("type","input");
        vyinput.setAttribute("id","vy"+i);
        var vxslider=document.createElement("div");
        vxslider.setAttribute("id","vxslider"+i);
        var vyslider=document.createElement("div");
        vyslider.setAttribute("id","vyslider"+i)
        p.appendChild(velocitylabel);
        p.appendChild(vxinput);
        p.appendChild(vxslider);
        p.appendChild(vyinput);
        p.appendChild(vyslider);
        output.appendChild(div);*/

        //Velocitybuttons
        var increasevbutton = document.createElement("button");
        increasevbutton.setAttribute("id","increasevbutton"+i);
        increasevbutton.innerHTML="Increase speed";
        div.appendChild(increasevbutton);
        var decreasevbutton = document.createElement("button");
        decreasevbutton.setAttribute("id","decreasevbutton"+i);
        decreasevbutton.innerHTML="Decrease speed";
        div.appendChild(decreasevbutton);

        output.appendChild(div);

    }

  $(function() {
    $( "#frequencyslider" + i ).slider({
        value:246.94,
        min: 0,
        max: 1000,
        step: 1,
        slide: function( event, ui ) {
          $( "#frequency" + i ).val(ui.value + " Hz" );
        }
      });
      $( "#frequency" + i).val( $( "#frequencyslider" + i).slider( "value" ) + " Hz" );
    });
  $(function() {
    $( "#releaseslider" + i).slider({
        value:0.5,
        min: 0.01,
        max: 10,
        step: 0.01,
        slide: function( event, ui ) {
          $( "#release" + i ).val(ui.value );
        }
      });
      $( "#release" + i ).val( $( "#releaseslider" + i).slider( "value" ) );
    });
  $(function() {
    $( "#attackslider" + i ).slider({
        value:0.005,
        min: 0.001,
        max: 1,
        step: 0.001,
        slide: function( event, ui ) {
          $( "#attack" + i).val(ui.value);
        }
      });
      $( "#attack" + i).val( $( "#attackslider" + i).slider( "value" ) );
    });

  //FIX ME: A better way of adjusting speed is needed, the if-clauses does nothing right now, problem is if we change speed with addition the ball trajectory may change
  $(document).ready(function(){
    $("#increasevbutton"+i).click(function(){
      if(balls[i].vx<0){
        balls[i].vx*=2;        
      }else{
        balls[i].vx*=2;
      }
      if(balls[i].vy<0){
        balls[i].vy*=2;
      }else{
        balls[i].vy*=2;
      }
    });
  });

  $(document).ready(function(){
    $("#decreasevbutton"+i).click(function(){
      if(balls[i].vx<0){
        balls[i].vx/=2;        
      }else{
        balls[i].vx/=2;
      }
      if(balls[i].vy<0){
        balls[i].vy/=2;
      }else{
        balls[i].vy/=2;
      }
    });
  });

  //Hide & Show buttons
  $(document).ready(function(){
    $("#ballbutton"+i).click(function(){
      for(j=0;j<nrofballs;j++){
        $("#sliderview"+j).hide();
      }
      $("#sliderview"+i).show();
    });
  });
}

for (i=0;i<nrofballs;i++){
  balls.splice(i,0,createBall(i));
  console.log(balls);
  createSliders(i);
}
