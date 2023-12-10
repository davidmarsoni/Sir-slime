import Platform from './Platform.js';
class BasePlatform extends Platform{
   
    constructor(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight) {
        super(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
        this.isAnimated = false;
    }
}

export default Platform;