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

    renderEntities(patrolmen) {
        for (const patrolman of patrolmen) {
            patrolman.debug = true;
            patrolman.render(this.ctx);
        }
    }
}

export default Render;