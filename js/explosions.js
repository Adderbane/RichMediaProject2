//Explosion module
		
"use strict";

var app = app || {};

app.explosions = (function(){
	
	//Explosion variables
    var type = "explosion";
    var explosions = undefined;
    var speed = 0.5;

    //Image variables
    var sprite = new Image();
    sprite.src = 'media/explosion.png';
    var height = 30;
    var width = 30;
    var gridx = 9;
    var gridy = 9;
    var spriteWidth = 300;
    var spriteHeight = 300;

    //Constructor
    function Explosion(x, y) {
        this.posX = x;
        this.posY = y;
        this.frame = 0;
        this.active = true;
        this.life = 0;
    }

    //Initialize
    function init() {
        explosions = new Array();
    }

    //Add explosion
    function spawnExp(x, y) {
        for (var i = 0; i < explosions.length; i++) {
            if (explosions[i].active == false) {
                explosions[i] = new Explosion(x, y);
                return
            }
        }
        explosions.push(new Explosion(x, y));
    }
    
    //Update
    function update(dt) {
        for (var i = 0; i < explosions.length; i++) {
            if (explosions[i].active) {
                explosions[i].life += dt;
                if (explosions[i].life >= speed/(gridx*gridy)) {
                    explosions[i].frame++;
                    explosions[i].life = 0;
                }
                if (explosions[i].frame == (gridx * gridy))
                {
                    explosions[i].active = false;
                }
            }
        }
    }

    //Draw
    function draw(ctx) {
        for (var i = 0; i < explosions.length; i++) {
            if (explosions[i].active) {
                var boom = explosions[i];
                ctx.save();
                ctx.translate(explosions[i].posX, explosions[i].posY);
                ctx.drawImage(sprite, (explosions[i].frame % gridx) * (spriteWidth / gridx), Math.floor(explosions[i].frame / gridx) * (spriteHeight / gridy), (spriteWidth / gridx), (spriteHeight / gridy), -width / 2, -height / 2, width, height);
                ctx.restore();
            }
        }
    }

	//Export interface
	return {
		init: init,
		update: update,
		draw: draw,
        spawnExp: spawnExp
	};
}());
