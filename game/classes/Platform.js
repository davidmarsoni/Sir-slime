import Object from './Object.js';
class Platform extends Object{
   
    constructor(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight) {
        super(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
    }

    render(ctx){
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
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        if(this.debug){
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(this.x, this.y, 8, 8);
        }
    }

    collide(player){
        // ]platform.x;platform.x+platform.width[
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
}

export default Platform;