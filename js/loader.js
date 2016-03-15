/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/
"use strict";

// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};


window.onload = function(){
    //if (app.main.debug) console.log("window.onload called");
    //app.sound.init();
    //app.main.sound = app.sound;
	app.main.init();
}

//Stop on blur
window.onblur = function () {
    //if(app.main.debug) console.log("blur at " + Date());
    app.main.pauseGame();
}

//Go on focus
window.onfocus = function () {
    //if (app.main.debug) console.log("focus at " + Date());
    app.main.resumeGame();
}