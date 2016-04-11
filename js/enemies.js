//Enemies module
		
"use strict";

var app = app || {};

app.enemies = (function(){
	
	//Enemy variables
	var startHealth = 1;
	var speed = 70;
	var speedVary = 10;
	var enemies = undefined;
	var width = 40;
	var height = 40;
	var type = "enemy";
	var sprite = new Image();
	sprite.src = 'media/alien.png';
	var spawnRate = 975;
	
	//Enemy methods
	function init(){
		enemies = new Array();	
	}
	//make enemy objects
	//having speed here allows for enemy objects to travel in different directions
	function spawnEnemy(x, y) {
	    for (var i = 0; i < enemies.length; i++) {
	        if (enemies[i].active == false) {
	            enemies[i] = genEnemy(x, y);
                return
	        }
	    }
	    enemies.push(genEnemy(x, y));
	}

    //Returns an enemy object
	function genEnemy(x, y)	{
	    if (Math.floor(Math.random() * 2)) {
			var diffScaling = app.main.score/100;
	        return { posX: x, posY: y, active: true, xSpeed: -1 * getRandom(speed - speedVary + diffScaling, speed + speedVary + diffScaling), ySpeed: getRandom(speed - speedVary + diffScaling, speed + speedVary + diffScaling), radius: 20, hp: startHealth };
	    }
	    else return { posX: x, posY: y, active: true, xSpeed: getRandom(speed - speedVary, speed + speedVary), ySpeed: getRandom(speed - speedVary, speed + speedVary), radius: 20, hp: startHealth };
	}

	//takes int = to specific enemy's pos in array
	//changes active to false
	function die(j) {
	    app.main.explosions.spawnExp(enemies[j].posX, enemies[j].posY);
		createjs.Sound.play("explosionSound");
		enemies[j].active = false;
	}
	
    //Update enemies
	function update(dt){
		for(var i = 0; i < enemies.length; i++){
			if (enemies[i].active) {
			    enemies[i].posX += enemies[i].xSpeed * dt;
			    enemies[i].posY += enemies[i].ySpeed * dt;
				if (enemies[i].posX+width/2 > app.main.WIDTH || enemies[i].posX-width/2 < 0) {
					enemies[i].xSpeed *= -1;
				}
				if (enemies[i].posY - height / 2 > app.main.HEIGHT) {
				    enemies[i].active = false;
				}
			}
		}
		
	    //Spawn enemies
		if (getRandom(1, 1000) > spawnRate - app.main.score/20) {
		    spawnEnemy(getRandom(50, app.main.WIDTH - 50), -30);
		}

	}
	
	function getEnemies(){
		return enemies;
	}
	
	//takes int = to specific enemy's pos in array
	//then lowers hp of enemy by 1, if hp = 0 calls die function
	function loseHp(j){
		enemies[j].hp -=1;
		if (enemies[j].hp <=0) {
			this.die(j);
		}
	}
	
	//Draw enemies
	function draw(ctx) {
		for(var i = 0; i < enemies.length; i++){
			if (enemies[i].active) {
				ctx.save();
				ctx.translate(enemies[i].posX, enemies[i].posY);
				ctx.drawImage(sprite, -width/2, -height/2, width, height);
				ctx.restore();
			}
		}
	}
	
	function getType(){
		return enemy;
	}
	
	//Export interface
	return {
		init: init,
		die: die,
		spawnEnemy: spawnEnemy,
		update: update,
		draw: draw,
		getEnemies: getEnemies,
		loseHp: loseHp,
		getType: getType
	};
}());
