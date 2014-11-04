//Slidebar JQuery UI
function createSliders(i){
    var output = document.getElementById('buttoncontainer');
    var val="";

    var ballbutton = document.createElement("button");
    ballbutton.setAttribute("id","ballbutton"+i);
    ballbutton.innerHTML="Ball " +i;
    ballbutton.setAttribute("style","background-color:"+balls[i].color);
    output.appendChild(ballbutton);

    output = document.getElementById('slidercontainer');

    if(!document.getElementById('slidercontainer'+i))
    {
        var div = document.createElement("div");
        div.innerHTML="Ball nr: " +i;
        div.setAttribute("id","sliderview"+i);
        div.setAttribute("style","display:none;");

        //FIX ME: Implement better way to choose major or minor scale, maybe selectbox
        //Scale
        var p = document.createElement("p");
        div.appendChild(p);
        var minbutton = document.createElement("button");
        minbutton.setAttribute("id","minbutton"+i);
        minbutton.innerHTML="Minor";
        p.appendChild(minbutton);
        var majbutton = document.createElement("button");
        majbutton.setAttribute("id","majbutton"+i);
        majbutton.innerHTML="Major";
        p.appendChild(majbutton);

        //Key
        var p = document.createElement("p");
        div.appendChild(p);
        var keylabel=document.createElement("label");
        keylabel.setAttribute("for","key"+i);
        keylabel.innerHTML="Note: ";
        var keyinput = document.createElement("input");
        keyinput.setAttribute("type","input");
        keyinput.setAttribute("id","key"+i);
        var keyslider = document.createElement("div");
        keyslider.setAttribute("id","keyslider"+i)
        p.appendChild(keylabel);
        p.appendChild(keyinput);
        p.appendChild(keyslider);

        //Octave (?)
        var p = document.createElement("p");
        div.appendChild(p);
        var octavelabel=document.createElement("label");
        octavelabel.setAttribute("for","octave"+i);
        octavelabel.innerHTML="Octave: ";
        var octaveinput = document.createElement("input");
        octaveinput.setAttribute("type","input");
        octaveinput.setAttribute("id","octave"+i);
        var octaveslider = document.createElement("div");
        octaveslider.setAttribute("id","octaveslider"+i)
        p.appendChild(octavelabel);
        p.appendChild(octaveinput);
        p.appendChild(octaveslider);

        /*Frequency
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
        p.appendChild(frequencyslider); */

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

  $(function() {
    $( "#octaveslider" + i ).slider({
        value:0,
        min: 0,
        max: 9,
        step: 1,
        slide: function( event, ui ) {
          $( "#octave" + i).val(ui.value);
        }
      });
      $( "#octave" + i).val( $( "#octaveslider" + i).slider( "value" ) );
    });

var availablekeys = ["a", "d", "e"];
  $(function() {
    $( "#keyslider" + i ).slider({
        value:0,
        min: 0,
        max: 2,
        step: 1,
        slide: function( event, ui ) {
          $( "#key" + i).val(availablekeys[ui.value]);
        }
      });
      $( "#key" + i).val( availablekeys[ $( "#keyslider" + i).slider( "value" )] );
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

  $(document).ready(function(){
    $("#minbutton"+i).click(function(){
      balls[i].scale="min";
    });
  });
  $(document).ready(function(){
    $("#majbutton"+i).click(function(){
      balls[i].scale="maj";
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