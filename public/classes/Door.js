import Object from "./Object.js";
import GameObjectLogic from "./GameObjectLogic.js";

class Door extends Object{
    #triggerZone ;
    #trigrerZoneImage = null;
    #isTriggerZoneImageLoaded = false;
    #timeToOpen = 0;
    #timerToOpen = 0;
    #doorIsOpen = false;
    #DoorPhase = 0; // 0 = closed, 1 = opening, 2 = open
    #LeverPhase = 0; // 0 = closed, 1 = opening 1, 2 = opening 2, 3 = open

    constructor(x, y, width, height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight, trrigerZoneX, trrigerZoneY, trrigerZoneWidth, trrigerZoneHeight,trigerZoneImagePath,timeToOpen) {
        super(x, y, width, height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
        this.#trigrerZoneImage = new Image();
        this.#trigrerZoneImage.src = trigerZoneImagePath;

        this.#trigrerZoneImage.onload = () => {
            this.#isTriggerZoneImageLoaded = true;
        };
        this.#triggerZone = new GameObjectLogic(trrigerZoneX,trrigerZoneY,trrigerZoneWidth,trrigerZoneHeight);

        this.#timeToOpen = timeToOpen;
        this.#timerToOpen = timeToOpen;
    }

    get timeToOpen() {return this.#timeToOpen;}
    set timeToOpen(value) {this.#timeToOpen = value;}

    get timerToOpen() {return this.#timerToOpen;}
    set timerToOpen(value) {this.#timerToOpen = value;}

    collide(player) {
        //if the player is in the trigger zone
        if(player.InAPerimeter(this.#triggerZone) && this.#timerToOpen > 0){
            //if the door is not already open
           
            this.#timerToOpen--;
            this.#DoorPhase = 1;
            if(this.#timerToOpen / this.#timeToOpen > 0.75){
                this.#LeverPhase = 1;
            }else if(this.#timerToOpen / this.#timeToOpen > 0.25){
                this.#LeverPhase = 2;
            }
            
            if(this.#timerToOpen === 0){
                this.#doorIsOpen = true;
                this.#DoorPhase = 2;
                this.#LeverPhase = 3;
            }
        }

        if(this.#doorIsOpen === false){
            if(
                (player.predictedX >= this.x
                && player.predictedX - player.width < this.x + this.width
                && player.predictedY > this.y
                && player.predictedY - player.height <= this.y + this.height + 1)){
                
                // If the player come from the top
                if(player.y <= this.y + 1){
                    player.y_v = 0;
                    player.predictedY = this.y + 1;
                    player.jump = false;
                } else {
                    // If the player is coming from the left
                    if(player.x <= this.x){
                        player.predictedX = this.x;
                    }
                    // If the player is coming from the right
                    else {
                        player.predictedX = this.x + this.width + player.width;
                    }
                }
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
                this.spriteSheetOffsetY+this.#DoorPhase * this.spriteSheetHeight,
                this.spriteSheetWidth,
                this.spriteSheetHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }

        if(this.#isTriggerZoneImageLoaded === true){
            ctx.drawImage(
                this.#trigrerZoneImage,
                0,
                this.#LeverPhase * this.#triggerZone.width,
                this.#triggerZone.width,
                this.#triggerZone.height,
                this.#triggerZone.x,
                this.#triggerZone.y,
                this.#triggerZone.width,
                this.#triggerZone.height
            );
        }

        if(this.debug){
            //render the door in purple
            ctx.fillStyle = 'rgba(255,0,255,0.5)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            //add the anchor point in black
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(this.x, this.y, 8, 8);

            //render the trigger zone in green and show the remaining time upper the door
            ctx.fillStyle = 'rgba(0,255,0,0.5)';
            ctx.fillRect(this.#triggerZone.x, this.#triggerZone.y, this.#triggerZone.width, this.#triggerZone.height);
           
            ctx.fillStyle = 'black';
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            let text = (this.#timerToOpen / this.#timeToOpen) * 100;
            text = Math.round(text);
            if(text <= 0){
                text = "Door open";
            }else{
                text = text + "%";
            }
           
            ctx.fillText(text, this.x + this.width/2, this.y - 5);
        }
    }
}

export default Door;