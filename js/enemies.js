//Enemies module
		
"use strict";

var app = app || {};

app.enemies = (function(){
	
	//Enemy variables
	var startHealth = 1;
	var speed = 50;
	var enemies = undefined;
	
	//Enemy methods
	function init(){
		enemies = new Array();
		
	}
	//make enemy objects
	//having speed here allows for enemy objects to travel in different directions
	function spawnEnemy(x,y){
		enemies.push({posX:x, posY:y, active: true, speed: speed})
		
	}
	
	function die(){
		
	}
	
	function update(dt){
		for(var i = 0; i < enemies.length; i++){
			if (enemies[i].active) {
				enemies[i].posX += enemies[i].speed * dt;
				if (enemies[i].posX > app.main.WIDTH || enemies[i].posX < 0) {
					enemies[i].speed *= -1;
				}
			}
		}
		
	}
	
	function draw(ctx) {
		for(var i = 0; i < enemies.length; i++){
			if (enemies[i].active) {
				ctx.save();
				ctx.translate(enemies[i].posX, enemies[i].posY);
				ctx.fillStyle = "yellow";
				ctx.strokeStyle ="white";
				ctx.fillRect(-20, 20, 40, 40);
				ctx.strokeRect(-20,20,40,40);
				ctx.restore();
			}
		}
	}
	
	//Export interface
	return {
		init: init,
		die: die,
		spawnEnemy: spawnEnemy,
		update: update,
		draw: draw
	};
}());
