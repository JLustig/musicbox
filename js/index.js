// Now some basic canvas stuff. Here we'll make a variable for the canvas and then initialize its 2d context for drawing
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

// Now setting the width and height of the canvas
var W = 760,
    H = 760;

// Applying these to the canvas element
canvas.height = H; canvas.width = W;

var Synth = function(audiolet,frequency,release,attack){
    console.log(frequency);
    console.log(release);
    console.log(attack);
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
    nrofballs=3,
    gravity = 0,
    bounceFactor = 1,
    audiolet,
    synth,
    frequency,
    release,
    attack;

function createBall(i){return {
  x: W/2,
  y: 50,
  
  radius: 15,
  color: 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')',
  
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
    this.frequency = parseInt(document.getElementById('frequency'+i).value);
    this.attack=parseFloat(document.getElementById('attack'+i).value);
    this.release=parseFloat(document.getElementById('release'+i).value);
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
    ball.y = H - ball.radius;
    ball.vy *= -bounceFactor;
    ball.play();
  }
  if(ball.y - ball.radius < 0) {
    ball.y = 0 + ball.radius;
    ball.vy *= -bounceFactor;
    ball.play();
  }
  ball.x += ball.vx;
  ball.vx += gravity;
  if(ball.x + ball.radius > W) {
    ball.x = W - ball.radius;
    ball.vx *= -bounceFactor;
    ball.play();
  }
  if(ball.x - ball.radius < 0) {
    ball.x = 0 + ball.radius;
    ball.vx *= -bounceFactor;
    ball.play();
  }
}

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
        output.appendChild(div);
    }
    /*
   <p>
    <label for="frequency">Frequency:</label>
    <input type="input" id="frequency" style="border:0; color:#f6931f; font-weight:bold;">
    </p>
    <div id="frequencyslider"></div>
    <p>
    <label for="release">Release</label>
    <input type="input" id="release" style="border:0; color:#f6931f; font-weight:bold;">
    </p>
    <div id="releaseslider"></div>
    <p>
    <label for="attack">Attack</label>
    <input type="input" id="attack" style="border:0; color:#f6931f; font-weight:bold;">
    </p>
    <div id="attackslider"></div>
*/
  $(function() {
    $( "#frequencyslider" + i ).slider({
        value:440,
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
        value:0.6,
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
        value:0.01,
        min: 0.001,
        max: 1,
        step: 0.001,
        slide: function( event, ui ) {
          $( "#attack" + i).val(ui.value);
        }
      });
      $( "#attack" + i).val( $( "#attackslider" + i).slider( "value" ) );
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
