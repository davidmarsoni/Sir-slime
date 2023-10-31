class Render {
    canvas;
    ctx;
    siteURL = "http://localhost/";
    backgroundIMAGE = new Image();
    loadBackgroundFailed = false;
    counter = 0;
    timer = 0;
    debug = false;

    constructor(debug = false) {
        this.debug = debug;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.height = 720; 
        this.ctx.canvas.width = 1520; 
    }
    render(loader,quickObjectCreation,keys){
        this.renderCanvas(loader.backgroundImage);
        this.renderObjects(loader.platforms, loader.collisionBlocks, loader.passageWays, loader.collacteables);
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
    renderObjects(platforms, collisionBlocks, passageWays, collacteables){
       
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
        for (const collacteable of collacteables) {
            collacteable.debug = this.debug;
            collacteable.render(this.ctx);
        }

    }

    // Function to render the player
    renderPlayer(player, keys){
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
        //create a score board for the player
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        let x = this.ctx.canvas.width-280;
        let y = this.ctx.canvas.height-160;
        this.ctx.fillRect(x, y, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "20px Consolas";
        x += 5;
        y += 20;
        this.ctx.fillText("Level   : " + loader.levelName, x, y);
        this.ctx.fillText("Health  : ",x, y+20);
        for (let i = 0; i < loader.player.maxHealth; i++){
            this.ctx.fillStyle = "rgba(160,160,160,1)";
            this.ctx.fillRect(x+112+(i*16), y+10, 16, 10);
        }
        for (let i = 0; i < loader.player.currenthealth; i++){
            this.ctx.fillStyle = "rgba(255,255,255,1)";
            this.ctx.fillRect(x+112+(i*16), y+10, 16, 10);
        }
        this.ctx.fillText("Lives   : ", x, y+40);
        for (let i = 0; i < loader.player.lives; i++){
            this.ctx.fillStyle = "rgba(255,0,0,1)";
            this.ctx.fillRect(x+112+(i*20), y+30, 10, 10);
        }
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.fillText("Score   : "+loader.player.score, x, y+60);
        let remainingEnemies = loader.numberOfEnnemies; //TODO: get the remaining enemies
        this.ctx.fillText("Ennemies : "+remainingEnemies , x, y+80);
        this.ctx.fillText("-------------", x, y+100);
        this.ctx.fillText("Position: x:" + loader.player.x +" y:"+loader.player.y , x, y+120);
        // help part 
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, 135,  20);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "14px Consolas";
        this.ctx.fillText("key 'h' for help", 5, 13);
    }

    renderStart(backgroundImage){
        
        if (backgroundImage != null){
            this.ctx.drawImage(backgroundImage, 0,0, this.ctx.canvas.width, this.ctx.canvas.height)  
        } 
    }
}

export default Render;