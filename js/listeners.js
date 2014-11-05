//Create eventlistener
var elem = document.getElementById('canvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('ctx'),
    elements = balls;


//Drag
// Add event listener for mouse events.
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

//Drop
elem.addEventListener('mouseup', function(event) {
    var x = event.pageX - elemLeft,
    y = event.pageY - elemTop;
    elements.forEach(function(element) {
      if(element.drag==true && !(y > element.y-15 && y < element.y+15 
            && x > element.x-15 && x < element.x+15)){
            console.log("drop");
        element.x=x;
        element.y=y;
        correctpaths();
        update(false);
      }
      element.drag=false;
    })


}, false);


//Change direction
var listener = function (event) {
  elements.forEach( function(element){
    if(element.arrow==true){
      element.drawarrow(event.pageX,event.pageY);
    }
  });
};

elem.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;
    elem.removeEventListener('mousemove', listener, false);
    // Collision detection
    elements.forEach(function(element) {
        console.log("outsideclick");
        element.arrow=false;
        if (y > element.y-15 && y < element.y+15 
            && x > element.x-15 && x < element.x+15) {
            console.log("insideclick");
            elem.addEventListener('mousemove', listener, false);
            element.arrow=true;
            return 0
        }
    });
    if(setblockcheck==true){
        setBlock(x,y);
    }

}, false);