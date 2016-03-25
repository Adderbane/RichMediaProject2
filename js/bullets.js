//Bullets module
		
"use strict";

var app = app || {};

app.bullets = (function(){
	
	var bullets = undefined;
	var speed = 300;
	
	//Methods
	function init(){
		bullets = new Array();
	}
	
	//Make bullet objects (evil = enemy bullet)
	function spawnBullet(x,y){
		bullets.push({posX:x, posY:y, active: true, evil: false});
	}
	
	function update(dt){
		for(var i = 0; i < bullets.length; i++){
			if(bullets[i].active){
				bullets[i].posY -= speed * dt;
				if(bullets[i].posY <= 0) bullets[i].active = false;
			}
		}
	}
	
	function draw(ctx){
		for(var i = 0; i < bullets.length; i++){
			if (bullets[i].active){
				ctx.save();
				ctx.translate(bullets[i].posX, bullets[i].posY);
				ctx.fillStyle = "red";
				ctx.fillRect(-5, 5, 10, 10);
				ctx.restore();
			}
		}
	}
	
	//Export interface
	return {
		init: init,
		spawnBullet: spawnBullet,
		update: update,
		draw: draw
	};
}());
