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
	soundtrack: undefined,

    //BG
	background: undefined,
	bgOffset: 0,

    //Game properties
    gameState: undefined,
    GAME_STATE: Object.freeze({
        BEGIN: 0,
        PLAY: 1,
        OVER: 2
    }),
    score: 0,

    //Timer (delays state switching
    timer: 0,
    delay: 1.5,
    ready: true,

    //Modules
    //sound: undefined,
	enemies: undefined,
	bullets: undefined,
	player: undefined,
    explosions: undefined,

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
		this.explosions = app.explosions;
		this.bullets.init();
		this.enemies.init();
		this.explosions.init();
	

        //Background
		this.background = new Image();
		this.background.src = 'media/stars.jpg';
		createjs.Sound.play("soundtrack",{loop: -1, volume: 0.5} );
		
	    //Hook up mouse
		this.canvas.onmousedown = this.doMousedown.bind(this);
		
	    //Load level
		this.gameState = this.GAME_STATE.BEGIN;
        this.reset();

		// start the game loop
		this.update();
		
		
	},

	reset: function() {
	    //Reset game variables
	    this.bullets.init();
	    this.player.init();
	    this.enemies.init();
	    this.explosions.init();
	    this.score = 0;
	},
	
	update: function(){
		// 1) LOOP
		// schedule a call to update()
	 	this.animationID = requestAnimationFrame(this.update.bind(this));

	 	// 2) PAUSED?
	    // if so, bail out of loop
	 	if (this.paused) {
	 	    if(this.gameState == this.GAME_STATE.PLAY) this.drawPauseScreen(this.ctx);
	 	    return;
	 	}
	 	
	 	// 3) HOW MUCH TIME HAS GONE BY?
	 	var dt = this.calculateDeltaTime();
	 	this.timer += dt;
	 	if (this.timer >= this.delay) {
	 	    this.ready = true;
	 	}
	 	 
	    // 4) UPDATE
	 	if (this.gameState == this.GAME_STATE.BEGIN) {
	 	    if (myKeys.keydown[32] && this.ready) {
	 	        this.gameState = this.GAME_STATE.PLAY;
	 	        this.ready = false;
	 	        this.timer = 0;
	 	    }
	 	}
	 	else if (this.gameState == this.GAME_STATE.PLAY && !this.paused) {
	 	    //Spawn enemies
	 	    //if (myKeys.keydown[74]) {
	 	    //app.main.enemies.spawnEnemy(getRandom(50, app.main.WIDTH - 50), -30);
	 	    //}
	 	    this.player.update(dt);
	 	    this.bullets.update(dt);
	 	    this.enemies.update(dt);
	 	    this.explosions.update(dt);
	 	}
	 	else if (this.gameState == this.GAME_STATE.OVER) {
	 	    if (myKeys.keydown[32] && this.ready) {
	 	        this.gameState = this.GAME_STATE.BEGIN;
	 	        this.reset();
	 	        this.ready = false;
	 	        this.timer = 0;
	 	    }

	 	}

		// 5) DRAW	
		// i) draw background
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
		this.drawBG(this.ctx);
		this.bgOffset--;
		if (this.bgOffset == -402) {
		    this.bgOffset = 0;
		}
	
	    //Draw
		if (this.gameState == this.GAME_STATE.BEGIN) {
		    this.drawIntro(this.ctx);
		}
		else if (this.gameState == this.GAME_STATE.PLAY) {
		    this.player.draw(this.ctx);
			this.bullets.draw(this.ctx);
			this.enemies.draw(this.ctx);
			this.explosions.draw(this.ctx);
			this.drawHUD(this.ctx);
		}
		else if (this.gameState == this.GAME_STATE.OVER) {
		    this.drawOver(this.ctx);
		    this.drawHUD(this.ctx);
		}
		


		this.checkForCollisions();
		
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
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    this.fillText(this.ctx, "...PAUSED...", this.WIDTH/2, this.HEIGHT/2, "40pt courier", "white");
	    ctx.restore();
	},

	drawIntro: function(ctx){
	    ctx.save();
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    this.fillText(this.ctx, "SPACE BATTLE", this.WIDTH / 2, (this.HEIGHT / 2) - 80, "40pt courier", "white");
	    this.fillText(this.ctx, "Movement: WASD or Arrow Keys", this.WIDTH / 2, this.HEIGHT / 2, "20pt courier", "white");
	    this.fillText(this.ctx, "Fire: Spacebar", this.WIDTH / 2, this.HEIGHT / 2 + 40, "20pt courier", "white");
	    this.fillText(this.ctx, "Press Spacebar to begin...", this.WIDTH / 2, (this.HEIGHT / 2) + 80, "20pt courier", "white");
	    ctx.restore();
	},

	drawOver: function(ctx){
	    ctx.save();
	    ctx.textAlign = "center";
	    ctx.textBaseline = "middle";
	    this.fillText(this.ctx, "GAME OVER", this.WIDTH / 2, this.HEIGHT / 2, "40pt courier", "white");
	    this.fillText(this.ctx, "Press Spacebar return to main menu...", this.WIDTH / 2, this.HEIGHT / 2 + 40, "20pt courier", "white");
	    ctx.restore();
	},

	drawBG: function (ctx) {
	    ctx.save();
	    for (var i = 0; i < 2; i++) {
	        for (var j = -1; j < 2; j++) {
	            ctx.drawImage(this.background, i * 402, j * 402 - this.bgOffset, 402, 402);
	        }
	    }
	    ctx.restore();
	},

    drawHUD: function (ctx) {
        ctx.save();
        this.fillText(ctx, "Score: " + this.score, 10, 30, "20pt courier", "white");
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
			/*
			var collisionArray = new Array();
			
			//adding active bullets and enemies to collision array
			for (var i = 0; i < bulletArray.length; i ++) {
				if (bulletArray[i].active) {
					collisionArray.push(bulletArray[i]);
				}
			}
			
			for (var i = 0; i < enemyArray.length; i ++) {
				if (enemyArray[i].active) {
					collisionArray.push(enemyArray[i]);
				}
			}
			//looping through collision array to check for collisions
			for(var i = 0; i < collisionArray.length; i++){
				//check against all objects stored in array after i
				if (i + 1 < collisionArray.length) {
					//store type to check against other objects in array
					collisionArray
					
					for(var j = i+1; j < collisionArray.length; j++){
						switch(collisionArray[i].getType){
							case "bullet":
								if (collisionArray[j].getType() == "enemy") {
									collisionArray[j].loseHp();
									collisionArray[i].explode();
									this.score+=5;
								}
								break;
						}
					}
				}
			}
		   */
			
		   /*
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
								this.score += 5;
							}
						}
					}
				}
			}
			*/
		   
		   if (this.debug) console.log(this.player.getPosX())
			//check for collisions with enemy
			for(var i = 0; i < enemyArray.length; i++){
				//only checks if enemy is active
				if (enemyArray[i].active) {
					for(var j = 0; j < bulletArray.length; j++){
						//only checks if bullet is active
						if (bulletArray[j].active) {
							//if intersection is detected, enemy loses hp and bullet becomes inactive
							if (bulletEnemyIntersect(bulletArray[j], enemyArray[i])) {
								this.enemies.loseHp(i);
								this.bullets.explode(j);
								this.score += 5;
								return;
							}
						}
					}
					
					//if collision is detected both player and enemy lose hp
					if (enemyPlayerIntersect(enemyArray[i], this.player)) {
						this.player.loseHp();
						this.enemies.loseHp(i);
						this.score -=2;
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