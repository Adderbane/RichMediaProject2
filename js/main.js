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
	enemies: undefined,
	bullets: undefined,

    // methods
	init : function() {
		// initialize canvas
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
	    //Initialize game
		this.player = app.player;
		this.enemies = app.enemies;
		this.bullets = app.bullets;
		this.bullets.init();
		this.enemies.init();

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
            //Spawn enemies
	        if (myKeys.keydown[32]) {
	            app.main.enemies.spawnEnemy(getRandom(50, app.main.WIDTH - 50), -30);
	        }
		    this.player.update(dt);
			this.bullets.update(dt);
			this.enemies.update(dt);
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
			this.bullets.draw(this.ctx);
			this.enemies.draw(this.ctx);
		}
		else if (this.gameState == this.GAME_STATE.OVER) {
		    this.drawOver(this.ctx);
		}

		this.checkForCollisions();

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
		if (this.gameState == this.GAME_STATE.PLAY) {
			//check for collisions between bullets and enemies
			var bulletArray = app.main.bullets.getBullets();
			var enemyArray = app.main.enemies.getEnemies();
		   
		   //check for collisions with enemy
			for(var i = 0; i < bulletArray.length; i++){
				//only checks if bullet is active
				if (bulletArray[i].active) {
					for(var j = 0; j < enemyArray.length; j++){
						//only checks if enemy is active
						if (enemyArray[j].active) {
							//if intersection is detected, enemy loses hp and bullet becomes inactive
							if (bulletEnemyIntersect(bulletArray[i], enemyArray[j])) {
								app.main.enemies.loseHp(j);
								app.main.bullets.explode(i);
							}
						}
					}
				}
			}
		}
       
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
    }
}; // end app.main