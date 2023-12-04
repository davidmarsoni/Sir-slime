import Heart from "../collectible/Heart.js";
import Fireballs from "../entity/Utility/fireballs.js";
class Render {
    canvas;
    ctx;
    siteURL = "http://localhost/";
    backgroundIMAGE = new Image();
    loadBackgroundFailed = false;
    counter = 0;
    timer = 0;
    debug = false;
    developerMode = false;
    heart ; 
   

    constructor(debug = false,developerMode = false) {
        this.debug = debug;
        this.developerMode = developerMode;
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
        this.renderObjects(loader.platforms, loader.collisionBlocks, loader.passageWays, loader.collectibles,loader.spikes);
        this.renderPlayer(loader.player, keys);
        this.renderEntities(loader.patrolmen, loader.bats, loader.fireballs);
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
    renderObjects(platforms, collisionBlocks, passageWays, collectibles,spikes){
       
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
        for (const spike of spikes) {
            spike.debug = this.debug;
            spike.render(this.ctx);
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

    renderEntities(patrolmen, bats, fireballs) {
        for (const patrolman of patrolmen) {
            patrolman.debug = this.debug;
            patrolman.render(this.ctx);
        }
        for (const bat of bats){
            bat.debug = this.debug;
            bat.render(this.ctx);
        }

        for (const fireball of fireballs){
            fireball.debug = this.debug;
            fireball.render(this.ctx);
        }

    }
    renderScorboard(loader){
        this.ctx.textAlign = "left";
        let x = 10;
        let y = 10;
        let width = 0;
        let height = 38;

        if(this.developerMode){
            this.ctx.fillStyle = "rgba(0,0,0,1)";
            this.ctx.font = "20px Consolas";
            width = 20+this.ctx.measureText("Developer mode").width;
            this.ctx.fillRect(x, y,width , height);
            this.ctx.fillStyle = "rgba(255,255,255,1)";
            this.ctx.font = "20px Consolas";
            x+=10;
            y+=25;
            this.ctx.fillText("Developer mode", x, y);
            //reset the position for the next text
            x-=10;
            y-=25;
            x+=width+10;
        }
       
        if(this.debug){
            this.ctx.fillStyle = "rgba(0,0,0,1)";
            this.ctx.font = "20px Consolas";
            width = 20+this.ctx.measureText("Debug mode").width;
            this.ctx.fillRect(x, y, width, height);
            this.ctx.fillStyle = "rgba(255,255,255,1)";
            this.ctx.font = "20px Consolas";
            x+=10;
            y+=25;
            this.ctx.fillText("Debug mode", x, y);

            //reset the position for the next text
            x-=10;
            y-=25;
            x+=width+10;
        }
        let coinsCollected = loader.player.numberOfCoinsCollected.toString().padStart(3, '0');
        let maxHealth = loader.player.maxHealth;
        let numberOfMaxHearts = loader.player.maxHealth/2;
        let numberOfHearts = loader.player.health/2;
        maxHealth % 2 === 1 ? maxHealth++ : null;
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        width = 10+this.ctx.measureText(loader.levelDisplayName).width+24+16+10+this.ctx.measureText(coinsCollected).width+10+10+maxHealth/2*20+8; 
        this.ctx.fillRect(x, y, width, height);

        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "20px Consolas";
        x+=10;
        y+=25;
        this.ctx.fillText(loader.levelDisplayName, x, y);

        // add the number of coins collected aside the title

        x+=this.ctx.measureText(loader.levelDisplayName).width+24;
        y-=15;
        this.collactible.spriteSheetOffsetX = 0;
        this.collactible.animStep = 0;
        this.collactible.x = x;
        this.collactible.y = y;
        this.collactible.render(this.ctx);
        x+=16+10;
        y+=15;
        //show the number of coins collected in this format : 000
        this.ctx.fillText(coinsCollected, x, y);

        x+=this.ctx.measureText(coinsCollected).width+10+10;
        
        this.collactible.spriteSheetOffsetX = 2;
        if (loader.player.maxHealth%2 === 1){
            numberOfMaxHearts++;
        }
        for (let i = 0; i < loader.player.maxHealth/2 ; i++){
            this.collactible.x = x+(i*20);
            this.collactible.y = y-14;
            this.collactible.render(this.ctx);
        }
        this.collactible.spriteSheetOffsetX = 1;
        
        if(loader.player.health%2 === 1){
            numberOfHearts--;
        }
        for (let i = 0; i < numberOfHearts ; i++){
            this.collactible.x = x+(i*20);
            this.collactible.y = y-14;
            this.collactible.render(this.ctx);
        }
        if(loader.player.health%2 === 1){
            this.collactible.spriteSheetOffsetX = 1;
            this.collactible.animStep = 1;
            this.collactible.x = x+(numberOfHearts*20)+10;
            this.collactible.y = y-14;
            this.collactible.render(this.ctx);
        }

        //add the number of lives at the top right corner
        x = this.ctx.canvas.width-10;
        y = 10;
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        let lives = loader.player.lives.toString().padStart(2, '0');
        width = 20+this.ctx.measureText("x"+lives).width;
        this.ctx.fillRect(x-width, y, width, height);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "20px Consolas";
        this.ctx.textAlign = "right";
        x-=10;
        y+=25;
        this.ctx.fillText("x"+lives, x, y);
        y-=25;
        x+=10;
        //add the score before the lives
        let score = loader.player.score.toString().padStart(6, '0');
        width = this.ctx.measureText(score).width;
        x= x-width;
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        this.ctx.fillRect(x-width-20, y, width+20, height);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "20px Consolas";
        this.ctx.textAlign = "right";
        x-=10;
        y+=25;
        this.ctx.fillText(score, x, y);
    }

    renderStart(loader){

        if (loader.StartScreenBackgroundImage != null){
            this.ctx.drawImage(loader.StartScreenBackgroundImage, 0,0, this.ctx.canvas.width, this.ctx.canvas.height)  
        }
        loader.startScreenButton.forEach(button => {
            if(button.screen === "start"){
                button.debug = true;
                button.render(this.ctx);
            }
           
        });
      
    }
    renderCommand(loader){
        console.log(loader + " Command info retrieved !");
        if (loader.CommandBackground != null){
            this.ctx.drawImage(loader.CommandBackground, 0,0, this.ctx.canvas.width, this.ctx.canvas.height)  
        }
    }
}

export default Render;