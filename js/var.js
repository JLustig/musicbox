// Set width and height of the canvas
var W = 625,
    H = 625;

// Now some basic canvas stuff. Here we'll make a variable for the canvas and then initialize its 2d context for drawing
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

//Create in-memory only canvas to use for caching at a later stage
var gridcachecanvas = document.createElement("canvas"),
    gridcache = gridcachecanvas.getContext("2d");

var shapecachecanvas = document.createElement("canvas"),
	shapecache = shapecachecanvas.getContext("2d");

// Applying these to the canvas element
canvas.height = H; canvas.width = W;
gridcachecanvas.height = H; gridcachecanvas.width = W;
shapecachecanvas.height = H; shapecachecanvas.width = W;

var balls = [],
	blocks = [],
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
    nrofgridshapes=25,
    paused=true,
    validX=[],
    validY=[],
    setblockcheck=false;