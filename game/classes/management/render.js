class Render {
    canvas;
    ctx;
    siteURL = "http://localhost/";
    backgroundIMAGE = new Image();
    loadBackgroundFailed = false;
    counter = 0;
    timer = 0;

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.height = 720; // 720
        this.ctx.canvas.width = 1520; // 1280
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
    renderObjects(platforms, collisionBlocks, passageWays){
       
        for (const collisionBlock of collisionBlocks){
            collisionBlock.debug = true;
            collisionBlock.render(this.ctx);
        }

        for (const platform of platforms) {
            platform.debug = true;
            platform.render(this.ctx);
        }

        for (const passageWay of passageWays) {
            passageWay.debug = true;
            passageWay.render(this.ctx);
        }
    }

    // Function to render the player
    renderPlayer(player, keys){
        player.debug = true;
        player.render(this.ctx, keys);
    }

    renderEntities(patrolmen, bats) {
        for (const patrolman of patrolmen) {
            patrolman.debug = true;
            patrolman.render(this.ctx);
        }
        for (const bat of bats){
            bat.debug = true;
            bat.render(this.ctx);
        }
    }
    renderScorboard(loader){
        //create a score board for the player
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        let x = this.ctx.canvas.width-280;
        let y = this.ctx.canvas.height-130;
        this.ctx.fillRect(x, y, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "20px Consolas";
        x += 5;
        y += 20;
        this.ctx.fillText("Level   : " + loader.levelName, x, y);
        this.ctx.fillText("Health  : ",x, y+20);
        for (let i = 0; i < loader.player.maxHealth; i++){
            this.ctx.fillStyle = "rgba(160,160,160,1)";
            this.ctx.fillRect(x+112+(i*1), y+10, 1, 10);
        }
        for (let i = 0; i < loader.player.currenthealth; i++){
            this.ctx.fillStyle = "rgba(255,255,255,1)";
            this.ctx.fillRect(x+112+(i*1), y+10, 1, 10);
        }
        this.ctx.fillText("Lives   : ", x, y+40);
        for (let i = 0; i < loader.player.lives; i++){
            this.ctx.fillStyle = "rgba(255,0,0,1)";
            this.ctx.fillRect(x+112+(i*20), y+30, 10, 10);
        }
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        let remainingEnemies = loader.numberOfEnnemies; //TODO: get the remaining enemies
        this.ctx.fillText("Ennemies : "+remainingEnemies , x, y+60);
        this.ctx.fillText("-------------", x, y+80);
        this.ctx.fillText("Position: x:" + loader.player.x +" y:"+loader.player.y , x, y+100);
        // help part 
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, 580,  20);
        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.ctx.font = "14px Consolas";
        this.ctx.fillText("Help : a => change level, f => force reload, p => pause, o => level image", 5, 13);
    }
}

export default Render;