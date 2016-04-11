//Enemies module
		
"use strict";

var app = app || {};

app.player = (function(){
	
    //Player drawing variables
	
	exhaust: undefined
	
    var posX = 0;
    var posY = 0;
    var width = 50;
    var height = 50;
    var sprite = new Image();
    sprite.src = 'media/blueship.png';
    
    //Player game variables
    var health = 0;
    var speed = 300;
	var radius = 15;
	var type = "player";
    var fireDelay = .25;
		
    //Player control variables
    var readyFire = true;
    var fireTimer = 0;
    
    //Initialize
    function init() {
        posX = app.main.WIDTH / 2;
        posY = app.main.HEIGHT - 50;
        radius = (width + height) / 4;
        health = 3;
		
		this.exhaust = new app.Emitter();
		this.exhaust.red = 225;
		this.exhaust.green = 50;
		this.exhaust.minXspeed = -.25;
		this.exhaust.minYspeed = 1;
		this.exhaust.maxXspeed = .25;
		this.exhaust.maxYspeed = 2;
		this.exhaust.lifetime = 500;
		this.exhaust.expansionRate = 0.05;
		this.exhaust.numParticles = 200;
		this.exhaust.xRange =1;
		this.exhaust.yRange=0.5;
		this.exhaust.useCircles = true;
		this.exhaust.useSquares = false;
		
		this.exhaust.createParticles(this.exhaust.emitterPoint());
    }

    //Update the player
    function update(dt){
        //Input
        if(myKeys.keydown[65] || myKeys.keydown[37]){
            posX -= speed * dt;
        }
        if(myKeys.keydown[68] || myKeys.keydown[39]){
            posX += speed * dt;
        }
        if (myKeys.keydown[87] || myKeys.keydown[38]) {
            posY -= speed * dt;
        }
        if (myKeys.keydown[83] || myKeys.keydown[40]) {
            posY += speed * dt;
        }

        if(myKeys.keydown[32]){
            fire();
        }
			
        //Update firing
        if(!readyFire) fireTimer += dt;
        if (fireTimer >= fireDelay){
            fireTimer = 0;
            readyFire = true;
        }
			
        //Check for collisions with wall
        if(width/2.0 + posX >= app.main.WIDTH){
            posX = app.main.WIDTH - width/2;
        }
        else if(posX - width/2 <= 0){
            posX = width/2;
        }
        if (height/2 + posY >= app.main.HEIGHT) {
            posY = app.main.HEIGHT - height / 2;
        }
        else if (posY - height/2 <= 0) {
            posY = height / 2;
        }
    }
		
    //Fire logic, can only be called once per fireDelay seconds
    function fire(){
        if (readyFire){
            //Fire
            app.main.bullets.spawnBullet(posX, posY - height);
            fireTimer = 0;
            readyFire = false;
			createjs.Sound.play("fireSound");
        }

    }
		
    //Draw the player
    function draw(ctx) {
        ctx.save();
        ctx.translate(posX, posY);
        ctx.globalAlpha = "1.0";
        ctx.rotate(-1 * Math.PI / 2);
        ctx.drawImage(sprite, -height / 2, -width / 2, width, height);
        ctx.restore();
        ctx.save();
		ctx.globalAlpha = "0.5";
        for (var i = 0; i < health; i++) {
            ctx.fillStyle = "red";
			ctx.save();
			ctx.translate(70 * i +20, app.main.HEIGHT - 30);
			ctx.rotate(-1 * Math.PI / 2);
			ctx.drawImage(sprite, 0, 0, width, height);
            //ctx.fillRect(70 * i + 20, app.main.HEIGHT - 70, 50, 50);
			ctx.restore();
        }
        ctx.restore();
		debugger;
		this.exhaust.updateAndDraw(ctx, {x:posX, y:posY + height/2 - 10 });
    }
	
	function getType(){
		return type;
	}
	
	function loseHp(){
		health -=1;
		if (health <= 0){
		    app.main.gameState = app.main.GAME_STATE.OVER;
		    app.main.ready = false;
		    app.main.timer = 0;
		}
	}
	
	function getRadius() {
		return radius;
	}
	
	function getPosX() {
		return posX;
	}
	
	function getPosY(){
		return posY;
	}
	
	//Export interface
	return {
	    init: init,
		update:update,
		draw:draw,
		getType:getType,
		getRadius:getRadius,
		getPosX:getPosX,
		getPosY:getPosY,
		loseHp:loseHp
	};
}());
