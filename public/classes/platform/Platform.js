import BasePlatform from './BasePlatform.js';
class Platform extends BasePlatform{
   
    constructor(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight) {
        super(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
        this.isAnimated = false;
    }
}

export default Platform;