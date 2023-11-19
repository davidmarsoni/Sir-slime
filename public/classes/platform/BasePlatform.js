import Object from '../Object.js';
class BasePlatform extends Object{
   
    constructor(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight) {
        super(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
        this.isAnimated = false;
    }

    render(ctx){
        if(this.isRendered === false){
            this.debug ? this.debugRender(ctx) : null;
            return;
        }
        if(!this.textureLoaded && !this.debug){
            this.debug = true;
        }
        
        if(this.textureLoaded){
            ctx.drawImage(
                this.texture,  //sprite
                this.spriteSheetOffsetX,  //sprite sheet offset x
                this.spriteSheetOffsetY, //sprite sheet offset y
                this.spriteSheetWidth, //sprite sheet w
                this.spriteSheetHeight, //sprite sheet h
                Math.round(this.x),
                Math.round(this.y),
                this.width,
                this.height
            );
        }
        if(this.debug){
            this.debugRender(ctx);
        }
    }

    debugRender(ctx){
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.strokeStyle = "rgba(0,0,0,0.8)";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // show the top left corner of the platform
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(this.x, this.y, 8, 8);

        // show if the platform is rendered
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.font = "12px consolas";
        ctx.textAlign = "center";

        let text = this.isRendered ? "T" : "F";
        ctx.fillText(text, this.minX + 16, this.minY + 10);
    }

    collide(player){
        // Predictive X collision
        if(player.predictedX > this.x && player.predictedX - player.width < this.x + this.width) {
            // Predictive Y collision
            // [platform.y+3;platform.y+1] -> 1. tolerance for clip (define if goes through) | 2. hitbox
            if (player.y <= this.y+3 && player.predictedY >= this.y+1) {
                // If the player was above the platform and now is within it vertically
                player.predictedY = this.y+1;
                player.y_v = 0;
                player.jump = false;
            }
        }
    }

    move(){

    }
}

export default BasePlatform;