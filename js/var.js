// Set width and height of the canvas
var W = 625,
    H = 625;

// Now some basic canvas stuff. Here we'll make a variable for the canvas and then initialize its 2d context for drawing
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

//Create in-memory only canvas to use for caching at a later stage
var cachecanvas = document.createElement("canvas"),
    cache = cachecanvas.getContext("2d");

// Applying these to the canvas element
canvas.height = H; canvas.width = W;
cachecanvas.height = H; cachecanvas.width = W;

var balls = [],
    nrofballs=3,
    ballradius=12.5,
    startx=[10,0,5],
    starty=[10,-10,0],
    gravity = 0,
    bounceFactor = 1,
    audiolet,
    synth,
    key,
    octave,
    frequency,
    release,
    attack,
    nrofshapes=25,
    paused=true,
    validX=[],
    validY=[];