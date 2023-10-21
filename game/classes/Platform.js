import Object from './Object.js';
class Platform extends Object{
   
    constructor(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight) {
        super(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
    }

    render(ctx){
        if(!this.debug){
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
        } else{
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export default Platform;