// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main = {
	//  properties
    WIDTH : 640, 
    HEIGHT: 640,
    canvas: undefined,
    ctx: undefined,
   	lastTime: 0, // used by calculateDeltaTime() 
   	paused: false,
   	debug: false,
    animationID: 0,

    //Game properties
    gameState: undefined,
    GAME_STATE: Object.freeze({
        BEGIN: 0,
        PLAY: 1,
        OVER: 2,
    }),

    player: undefined,

    //Modules
    //sound: undefined,

    // methods
	init : function() {
		console.log("app.main.init() called");
		// initialize canvas
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
	    //Initialize game
		this.player = this.makePlayer();

	    //Hook up mouse
		this.canvas.onmousedown = this.doMousedown.bind(this);

        //Load level
        this.reset();

		// start the game loop
		this.update();
	},

	reset: function(pass) {
	    if (pass) {

	    }
	    this.gameState = this.GAME_STATE.PLAY;
	},
	
	update: function(){
		// 1) LOOP
		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));

	 	// 2) PAUSED?
	    // if so, bail out of loop
	 	if (this.paused) {
	 	    this.drawPauseScreen(this.ctx);
	 	    return;
	 	}
	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	 
	 	// 4) UPDATE
	    if (this.gameState == this.GAME_STATE.BEGIN) {
		    
		}
		else if (this.gameState == this.GAME_STATE.PLAY) {
		    this.player.update(dt);
		}
		else if (this.gameState == this.GAME_STATE.OVER) {
		    
		}

		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
	
	    //Draw
		if (this.gameState == this.GAME_STATE.BEGIN) {
		    this.drawIntro(this.ctx);
		}
		else if (this.gameState == this.GAME_STATE.PLAY) {
		    this.player.draw(this.ctx);
		}
		else if (this.gameState == this.GAME_STATE.OVER) {
		    this.drawOver(this.ctx);
		}

		// iii) draw HUD
		this.drawHUD(this.ctx);
		
		// iv) draw debug info
		if (this.debug){
			// draw dt in bottom right corner
			this.fillText(this.ctx, "dt: " + dt.toFixed(3), this.WIDTH - 150, this.HEIGHT - 10, "18pt courier", "white");
		}
	},
	
	fillText: function(ctx, string, x, y, css, color) {
		ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		ctx.font = css;
		ctx.fillStyle = color;
		ctx.fillText(string, x, y);
		ctx.restore();
	},
	
	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},

	drawPauseScreen: function(ctx){
	    ctx.save();
	    ctx.fillStyle = "black";
	    ctx.fillRect(0,0, this.WIDTH, this.HEIGHT);
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    this.fillText(this.ctx, "...PAUSED...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
	    ctx.restore();
	},

    circleHitLeftRight: function (c){
        if (c.x <= c.radius || c.x >= this.WIDTH - c.radius) return true;
    },
	
    circleHitTopBottom: function (c) {
        if (c.y < c.radius || c.y > this.HEIGHT - c.radius) return true;
    },

    drawHUD: function (ctx) {
        ctx.save();

        ctx.restore();
    },

    doMousedown: function (e) {
        //this.sound.playBGAudio();
        //Unpause on click
        if (this.paused) {
            this.paused = false;
            this.update();
            return;
        }

        var mouse = getMouse(e);
    },

    checkForCollisions: function () {
       
    },

    pauseGame: function(){
        this.paused = true;
        //this.sound.stopBGAudio();
        cancelAnimationFrame(this.animationID);
        this.update();
    },

    resumeGame: function() {
        cancelAnimationFrame(this.animationID);
        this.paused = false;
        //this.sound.playBGAudio();
        this.update();
    },

    toggleDebug: function () {
        this.debug = !(this.debug);
    },

    makePlayer: function () {
        var player = new Object();
		
		//Player drawing variables
        player.posX = this.WIDTH/2;
        player.posY = this.HEIGHT - 50;
		player.width = 30;
		player.height = 30;
		
		//Player game variables
        player.health = 3;
		player.speed = 50;
		player.fireDelay = 1;
		
		//Player control variables;
		player.readyFire = true;
		player.fireTimer = 0;
         
		//Update the player
		player.update = function(dt){
			//Input
			if(myKeys.keydown[65]){
				this.posX -= this.speed * dt;
			}
			if(myKeys.keydown[68]){
				this.posX += this.speed * dt;
			}
			if(myKeys.keydown[74]){
				this.fire();
			}
			
			//Update firing
			if(!this.readyFire) this.fireTimer += dt;
			if (this.fireTimer >= this.fireDelay){
				this.fireTimer = 0;
				this.readyFire = true;
			}
			
			//Check for collisions
		}
		
		//Fire logic, can only be called once per fireDelay seconds
		player.fire = function (){
			if (this.readyFire){
				//Fire
				console.log("Pew pew pew");
				this.fireTimer = 0;
				this.readyFire = false;
			}
		}
		
		//Draw the player
        player.draw = function (ctx) {
            ctx.save();
			ctx.translate(this.posX, this.posY);
            ctx.fillStyle = "white";
            ctx.globalAlpha = "1.0";
            ctx.fillRect(-15, -15, this.width, this.height);
            ctx.restore();
        }
		
		Object.seal(player);
		
        return player;
    }

}; // end app.main