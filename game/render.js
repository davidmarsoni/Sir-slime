class Render {
    canvas;
    ctx;
    siteURL = "http://localhost/";
    backgroundIMAGE = new Image();
    patrolmenSPRITE = new Image();
    counter = 0;
    timer = 0;
    hitAnimationCounter = 0;

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.height = 720; // 720
        this.ctx.canvas.width = 1520; // 1280
        this.backgroundIMAGE.src = this.siteURL+"Sprites/BG.png";
        this.patrolmenSPRITE.src = this.siteURL+"Sprites/Patrolmen.png";
    }

    // Function to render the canvas
    rendercanvas(platforms, collisionBlocks){
        //ctx.fillStyle = "#F0F8FF";
        this.ctx.fillStyle = "#EBEBEB";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
       
        for (const collisionBlock of collisionBlocks){
            collisionBlock.debug = true;
            collisionBlock.render(this.ctx);
        }

        for (const platform of platforms) {
            platform.debug = true;
            platform.render(this.ctx);
        }
    }

    // Function to render the player
    // src https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
    renderplayer(player, playerWeapon, keys){
        // direction
        let spriteDirectionOffset;
        if (player.x_v < 0) {
            spriteDirectionOffset = player.width;
        } else {
            spriteDirectionOffset = 0;
        }

        

        let hitSpriteOffset = 0;

        if (player.isHit) {
            // Gérez l'animation du joueur touché ici
            hitSpriteOffset = player.width * 2; // Utilisez le deuxième sprite pour le joueur touché
            // Utilisez un compteur pour alterner entre les images
            if (this.hitAnimationCounter % 20 < 10) {
                hitSpriteOffset = 0; // Utilisez le premier sprite pour la première image
            }
            this.hitAnimationCounter++;
        }
        else{
            this.hitAnimationCounter = 0;
        }

        // animation
        let animationOffset = 0;
        if (player.jump){
            if (player.y_v > 0){
                //falling
                animationOffset = player.width*5;
            } else {
                //jumping
                animationOffset = player.width*4;
            }
        } else if (keys.left || keys.right) {
            // movement
            this.counter++;
            if (this.counter === 4) {
                this.counter = 0;
                this.timer++;
                if (this.timer === 4) {
                    this.timer = 0;
                }
            }
            animationOffset = this.timer * 32;
        } else if(keys.attack) {
            // attack
            animationOffset = player.width*6;
            player.weapon.render(this.ctx,player,spriteDirectionOffset);
            this.counter++;
            if (this.counter === 4) {
                keys.attack = false;
                this.counter = 0;
            }
        } else {
            this.counter = 0;
            this.timer = 0;
        }

        player.debug = true;
        player.render(this.ctx,spriteDirectionOffset + hitSpriteOffset,animationOffset);
    }

    renderpatrolmen(patrolmen) {
        for (const patrolman of patrolmen) {
            let spriteDirectionOffset;
            if (patrolman.direction) {
                spriteDirectionOffset = 0;
            } else {
                spriteDirectionOffset = 32;
            }
            patrolman.animTimer++;
            if(patrolman.animTimer===4){
                patrolman.animTimer = 0;
                patrolman.animStep++;
                if(patrolman.animStep === 4){
                    patrolman.animStep = 0;
                }
            }
            patrolman.debug = true;
            patrolman.render(this.ctx,spriteDirectionOffset);
        }
    }
}

export default Render;