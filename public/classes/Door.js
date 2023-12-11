import Object from "./Object.js";

class Door extends Object{
    #triggerZoneX = 0;
    #triggerZoneY = 0;
    #triggerZoneWidth = 0;
    #triggerZoneHeight = 0;
    #timeToOpen = 0;
    #timerToOpen = 0;
    #passageWayTo = "";

    constructor(x, y, width, height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight, trrigerZoneX, trrigerZoneY, trrigerZoneWidth, trrigerZoneHeight, timeToOpen, passageWayTo) {
        super(x, y, width, height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);

        this.#triggerZoneX = trrigerZoneX;
        this.#triggerZoneY = trrigerZoneY;
        this.#triggerZoneWidth = trrigerZoneWidth;
        this.#triggerZoneHeight = trrigerZoneHeight;
        this.#timeToOpen = timeToOpen;
        this.#passageWayTo = passageWayTo;
    }

    get passageWayTo() {
        return this.#passageWayTo;
    }
    set passageWayTo(value) {
        this.#passageWayTo = value;
    }

    collide(player) {
        if(player.x >= this.#triggerZoneX
            && player.x - player.width < this.#triggerZoneX + this.#triggerZoneWidth
            && player.y > this.#triggerZoneY
            && player.y - player.height <= this.#triggerZoneY + this.#triggerZoneHeight){
            this.timerToOpen++;

            if(this.timerToOpen >= this.timeToOpen){
                player.addLevelCompleted();
                return true;
            }
        }
    }

    render(ctx) {
        if(this.isRendered === false){
            return;
        }

        if(this.textureLoaded === true){
            ctx.drawImage(
                this.texture,
                this.spriteSheetOffsetX,
                this.spriteSheetOffsetY,
                this.spriteSheetWidth,
                this.spriteSheetHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }

        if(this.debug){
            //render the door in purple
            ctx.fillStyle = 'rgba(255,0,255,0.75)';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            //render the trigger zone in green and show the remaining time upper the door
            ctx.fillStyle = 'rgba(0,255,0,0.75)';
            ctx.fillRect(this.#triggerZoneX, this.#triggerZoneY, this.#triggerZoneWidth, this.#triggerZoneHeight);
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.font = "12px Arial";
            ctx.fillText(this.#timeToOpen - this.#timerToOpen + "/"+this.#timeToOpen, this.#triggerZoneX, this.#triggerZoneY - 10);


        }
    }
}

export default Door;