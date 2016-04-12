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

var manifest;
var preload;

window.onload = function(){

    
    manifest = [
        {id: "fireSound", src: "media/laserBlast.mp3"}, //http://soundbible.com/472-Laser-Blasts.html
       {id: "explosionSound", src:"media/explosion2.mp3" }, //http://soundbible.com/456-Explosion-2.html
       {id: "soundtrack", src: "media/Fastest.mp3"} //http://www.newgrounds.com/audio/listen/663687
    ];
    //debugger;
    app.Emitter();
    
    app.main.queue = new createjs.LoadQueue(false);
    app.main.queue.installPlugin(createjs.Sound);
    app.main.queue.loadManifest(manifest);
    app.main.queue.on("complete", function(e){
    app.main.init();
    });
}

//Stop on blur
window.onblur = function () {
    app.main.pauseGame();
}

//Go on focus
window.onfocus = function () {
    
    app.main.resumeGame();
}