import Button from "../Button.js";
import Heart from "../collectible/Heart.js";
import firebase from "./Firebase.js";
class Render {
    canvas;
    ctx;
    debug = false;
    developerMode = false;
    heart;

    constructor(debug = false,developerMode = false) {
        this.debug = debug;
        this.developerMode = developerMode;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.height = 720; 
        this.ctx.canvas.width = 1520; 
        this.collectible = new Heart(0,0, 16,16,"assets/sprites/hud.png");
        this.collectible.isAnimated = false;
        this.collectible.isAlive = false;
    }

    render(loader,quickObjectCreation,keys){
        //if the song is not playing play it
        this.renderCanvas(loader.backgroundImage);
        this.renderObjects(loader.platforms, loader.collisionBlocks, loader.passageWays, loader.collectibles,loader.spikes);
        this.renderEntities(loader.patrolmen, loader.bats,loader.fireballs, loader.boss);
        this.renderPlayer(loader.player, keys);
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

    renderEntities(patrolmen, bats, fireballs, boss) {
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
        if (boss != null){
            boss.debugCascade(this.debug);
            boss.render(this.ctx);
        }
    }
    renderScorboard(loader){
        let width = 0;
        let height = 34;
        // render mods
        if(this.debug){
           width += this.#drawText("Debug mode", 20, height);
           width += 10;
        }
        if(this.developerMode){
            width += this.#drawText("Developer mode", 20 + width, height);
            width += 10;
        }
        width += this.#drawText(loader.levelDisplayName, 20 + width, height);

        //draw number of coins collected
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(width+10,10, 40, height+1);
        this.collectible.spriteSheetOffsetX = 0;
        this.collectible.animStep = 0;
        this.collectible.x = 20 + width;
        this.collectible.y = height - 14;
        this.collectible.render(this.ctx);
        width += 30;
        
        // draw the number of coin collected
        width += this.#drawText(loader.player.numberOfCoinsCollected.toString().padStart(3, '0'), 20 + width, height);
        width += 10;

        // draw the heal
        this.#drawHealth(loader.player.health,loader.player.maxHealth, 20 + width, height);

        //draw score and lives
        width = this.ctx.canvas.width;
        height = 34;
        width -= this.#drawText("x"+loader.player.lives.toString().padStart(2, '0'), width, height,true);
        width -= 10;
        width -= this.#drawText(loader.player.score.toString().padStart(6, '0'), width, height,true);

        let x = this.ctx.canvas.width;
        let y = this.ctx.canvas.height-20;
        height = 34;

        let pseudo = firebase.isUserSignedIn() ? firebase.getUserInfo() : "Guest";
        width = this.#drawText(pseudo, x, y,true);
        x -= width + 10;

        let buttonText = firebase.isUserSignedIn() ? "Disconnect" : "Connect";
        width = this.#drawText(buttonText, x, y,true, firebase.isUserSignedIn() ? "#7B0000" :"#00621B");

        loader.connectButton.x = x-width-10;
        loader.connectButton.y = y-24;
        loader.connectButton.width = width;
        loader.connectButton.height = height;
        loader.connectButton.debug = this.debug;
        loader.connectButton.render(this.ctx);
    }

    #drawHealth(health,maxHealth, x, y){
        let width = 16 + 20 * Math.floor(maxHealth/2) + (maxHealth % 2 === 1 ? 20 : 0);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(x-10, y-24, width, 36);
        //draw the full life
        this.#drawHearts(x,y, Math.floor(maxHealth/2), maxHealth % 2 === 1, 2);
        //draw the remaining life
        this.#drawHearts(x,y, Math.floor(health/2), health % 2 === 1, 1, 1);
    }

    #drawHearts(x,y,NumberOfHeart, hasHalfHeart, spriteSheetOffsetX, currentLife = false) {
        this.collectible.spriteSheetOffsetX = spriteSheetOffsetX;
        this.collectible.animStep = 0;
        this.collectible.y = y - 14;
        for(let i = 0; i < NumberOfHeart; i++){
            this.collectible.x = x + i * 20;
            this.collectible.render(this.ctx);
        }

        if (hasHalfHeart){
            currentLife && this.collectible.animStep++;
            this.collectible.x = x + NumberOfHeart * 20;
            this.collectible.render(this.ctx);
        }
    }

    #drawText(text, x, y,removeWidth = false,backgroundcolor = "black",textColor = "white"){
        this.ctx.fillStyle = backgroundcolor;
        this.ctx.font = "20px Consolas";
        let width =  Math.round(this.ctx.measureText(text).width) + 20;
        let height = Math.round(this.ctx.measureText("M").width) + 24;
        removeWidth && (x -= width);
        this.ctx.fillRect(x-10, y-24, width, height);
        this.ctx.fillStyle = textColor;
        this.ctx.fillText(text, x, y);

        return width;
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

    renderModalWindow(modalWindow){
        modalWindow.render(this.ctx);
    }
}

export default Render;