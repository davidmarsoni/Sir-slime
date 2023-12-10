import Platform from './Platform.js';
class ActivationPlatform extends Platform{
    #triggerZoneX;
    #triggerZoneY;
    #activationTimer;
    #tmpActivationTimer = 0;
    #isActivated = false;
   
    constructor(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight,triggerZoneX=0,triggerZoneY=0,activationTimer=0){
        super(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
        this.#triggerZoneX = triggerZoneX;
        this.#triggerZoneY = triggerZoneY;
        this.#activationTimer = activationTimer;

        if(this.#triggerZoneX < 0 || this.#triggerZoneX === undefined){
            this.#triggerZoneX = 0;
            this.isRendered = true;
        }else{
            this.isRendered = false;
        }

        if(this.#triggerZoneY < 0 || this.#triggerZoneY === undefined){
            this.#triggerZoneY = 0;
            this.isRendered = true;
        }else{
            this.isRendered = false;
        }

        this.isAnimated = false;
    }

    get triggerZoneX() {
        return this.#triggerZoneX;
    }

    set triggerZoneX(value) {
        this.#triggerZoneX = value;
    }

    get activationTimer() {
        return this.#activationTimer;
    }
    
    set activationTimer(value) {
        this.#activationTimer = value;
    }

    get isActivated() {
        return this.#isActivated;
    }

    set isActivated(value) {
        this.#isActivated = value;
    }

    get triggerZoneY() {
        return this.#triggerZoneY;
    }

    set triggerZoneY(value) {
        this.#triggerZoneY = value;
    }

    get tmpActivationTimer() {
        return this.#tmpActivationTimer;
    }

    set tmpActivationTimer(value) {
        this.#tmpActivationTimer = value;
    }

 

    debugRender(ctx){
        super.debugRender(ctx);
        if(this.#triggerZoneX != null && this.#triggerZoneY != null){
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillRect(this.x-this.#triggerZoneX, this.y-this.#triggerZoneY, (this.#triggerZoneX*2+this.width), (this.#triggerZoneY*2+this.height));
            
            //add the time remaining
            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.font = "bold 12px Consolas";
            ctx.textAlign = "center";
            ctx.fillText(this.#tmpActivationTimer, this.x+this.width/2, this.y+this.height/2+10);
        }
    }

    collide(player){
        super.collide(player);
        if(this.#triggerZoneX != null && this.#triggerZoneY != null){
            if(player.InAPerimeter(this,this.#triggerZoneX,this.#triggerZoneY)){
                this.isRendered = true;
                this.isActivated = true;
                this.#tmpActivationTimer = this.#activationTimer;
            }else{
                if(this.isActivated === true){
                    this.#tmpActivationTimer--;
                    if(this.#tmpActivationTimer <= 0){
                        this.isActivated = false;
                        this.isRendered = false;
                    }
                }
            }
        }
    }
}

export default ActivationPlatform;