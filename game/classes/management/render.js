import Heart from "../collactiables/Heart.js";
class Render {
    canvas;
    ctx;
    siteURL = "http://localhost/";
    backgroundIMAGE = new Image();
    loadBackgroundFailed = false;
    counter = 0;
    timer = 0;
    debug = false;
    heart ;

    constructor(debug = false) {
        this.debug = debug;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.height = 720; 
        this.ctx.canvas.width = 1520; 
        this.collactible = new Heart(0,0, 16,16,"assets/sprites/hud.png");
        this.collactible.isAnimated = false;
        this.collactible.isAlive = false;
    }
    render(loader,quickObjectCreation,keys){
        //if the song is not playing play it
        
        this.renderCanvas(loader.backgroundImage);
        this.renderObjects(loader.platforms, loader.collisionBlocks, loader.passageWays, loader.collectibles);
        this.renderPlayer(loader.player, keys);
        this.renderEntities(loader.patrolmen, loader.bats);
        this.renderScorboard(loader);

        //render the quick object creation
        quickObjectCreation.render(this.ctx);
    }

    renderCanvas(backgroundImage){
        //test the type of the backgroundImage
        if (backgroundImage != null){
            this.ctx.drawImage(backgroundImage, 0,0, this.ctx.canvas.width, this.ctx.canvas.height)  
        } else {
            this.ctx.fillStyle ="rgba(240,240,240,1)";
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        }    
    }
    renderObjects(platforms, collisionBlocks, passageWays, collectibles){
       
        for (const collisionBlock of collisionBlocks){
            collisionBlock.debug = this.debug;
            collisionBlock.render(this.ctx);
        }
        
        for (const platform of platforms) {
            platform.debug = this.debug;
            platform.render(this.ctx);
        }

        for (const passageWay of passageWays) {
            passageWay.debug = this.debug;
            passageWay.render(this.ctx);
        }
        for (const collectible of collectibles) {
            collectible.debug = this.debug;
            collectible.render(this.ctx);
        }

    }

    // Function to render the player
    renderPlayer(player, keys){
        if (!player) {
            console.error('Player object is null');
            return;
        }
        player.debug = this.debug;
        player.render(this.ctx, keys);
    }

    renderEntities(patrolmen, bats) {
        for (const patrolman of patrolmen) {
            patrolman.debug = this.debug;
            patrolman.render(this.ctx);
        }
        for (const bat of bats){
            bat.debug = this.debug;
            bat.render(this.ctx);
        }
    }
    renderScorboard(loader){
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        let x = 10;
        let y = 10;
       
        if(this.debug){
            this.ctx.fillRect(x, y, 100+this.ctx.measureText("debug").width, 38);
            this.ctx.fillStyle = "rgba(255,255,255,1)";
            this.ctx.font = "20px Consolas";
            x+=10;
            y+=25;
            this.ctx.fillText("Debug mode", x, y);

            x-=10;
            y-=25;
            x+=90+this.ctx.measureText("debug").width;
        }
        
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        this.ctx.fillRect(x, y, 112+this.ctx.measureText(loader.levelName).width+loader.player.maxHealth*10, 38);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "20px Consolas";
        //contour des lettres en noir
        x+=10;
        y+=25;
        this.ctx.fillText(loader.levelName, x, y);

        // add the number of coins collected aside the title

        x+=this.ctx.measureText(loader.levelName).width+20;
        y-=14;
        this.collactible.spriteSheetOffsetX = 0;
        this.collactible.animStep = 0;
        this.collactible.x = x;
        this.collactible.y = y;
        this.collactible.render(this.ctx);
        //show the number of coins collected in this format : 000
        let coinsCollected = loader.player.numberOfCoinsCollected.toString().padStart(3, '0');
        this.ctx.fillText(" "+coinsCollected, x+16, y+15);


        //add heart for the health
        x+=55+20;
        y+=14;
        this.collactible.spriteSheetOffsetX = 2;
        let numberOfHearts = loader.player.maxHealth/2;
        if (loader.player.maxHealth%2 === 1){
            numberOfHearts++;
        }
        for (let i = 0; i < loader.player.maxHealth/2 ; i++){
            this.collactible.x = x+(i*20);
            this.collactible.y = y-14;
            this.collactible.render(this.ctx);
        }
        this.collactible.spriteSheetOffsetX = 1;
        let numberOftHearts = loader.player.health/2;
        if(loader.player.health%2 === 1){
            numberOftHearts--;
        }
        for (let i = 0; i < numberOftHearts ; i++){
            this.collactible.x = x+(i*20);
            this.collactible.y = y-14;
            this.collactible.render(this.ctx);
        }
        if(loader.player.health%2 === 1){
            this.collactible.spriteSheetOffsetX = 1;
            this.collactible.animStep = 1;
            this.collactible.x = x+(numberOftHearts*20)+10;
            this.collactible.y = y-14;
            this.collactible.render(this.ctx);
        }

        //add the number of lives at the top right corner
        x = this.ctx.canvas.width-20;
        y = 10;
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        let lives = loader.player.lives.toString().padStart(2, '0');
        this.ctx.fillRect(x-this.ctx.measureText(lives).width-22, y, this.ctx.measureText(lives).width+28, 38);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "bold 20px Consolas";
        this.ctx.textAlign = "right";
       
        this.ctx.fillText("x"+lives, x-2, y+25);
        
        //add the score before the lives
        let score = loader.player.score.toString().padStart(6, '0');
        x -= this.ctx.measureText(score).width-4;
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        this.ctx.fillRect(x-this.ctx.measureText(score).width-20, y, this.ctx.measureText(score).width+26, 38);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "bold 20px Consolas";
        this.ctx.textAlign = "right";
        this.ctx.fillText(score, x-6, y+25);
    }

    renderStart(backgroundImage){
        
        if (backgroundImage != null){
            this.ctx.drawImage(backgroundImage, 0,0, this.ctx.canvas.width, this.ctx.canvas.height)  
        } 
    }
}

export default Render;