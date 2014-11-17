// *********************************
// The layout JS script for BeeSweeper 
// --------------------------------
//  Loads the timer and sound


var h1 = document.getElementById('timer-digits'),
    seconds = 0, minutes = 0, hours = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    h1.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    
    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}


function sfx(){

	var audio = document.createElement("audio");
	audio.src = "../JS_BeeSweeper/resources/beeswarm.ogg";
	audio.play();
}