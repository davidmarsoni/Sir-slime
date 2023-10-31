import GameObject from "../GameObject.js";
class Collectable extends GameObject {
    #animStep = 0;
    #animTimer = 0;
    #spriteSheetOffsetX = 0;

    constructor(x, y, width, height, texturepath,spriteSheetOffsetX) {
        super(x, y, width, height, texturepath);
        this.#spriteSheetOffsetX = spriteSheetOffsetX;
    }

    get animStep() {
        return this.#animStep;
    }

    set animStep(value) {
        this.#animStep = value;
    }

    get spriteSheetOffsetX() {
        return this.#spriteSheetOffsetX;
    }

    set spriteSheetOffsetX(value) {
        this.#spriteSheetOffsetX = value;
    }

    get animTimer() {
        return this.#animTimer;
    }

    set animTimer(value) {
        this.#animTimer = value;
    }

    collide(player) {

        if(this.isAlive === false){
            return;
        }
        if(player.x >= this.x
            && player.x - player.width < this.x + this.width
            && player.y > this.y
            && player.y - player.height <= this.y + this.height){
            
            this.isAlive = false;
            this.isRendered = false;   
            this.collect(player);
        }
    }

    collect(player) {
    }

    render(ctx) {
        if(this.isRendered === false){
            return;
        }

        this.animTimer++;
        if(this.animTimer===8){
            this.animTimer = 0;
            this.animStep++;
            if(this.animStep === 4){
                this.animStep = 0;
            }
        }

        if(this.debug){
            ctx.fillStyle = 'rgba(230,230,230,0.75)';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(this.x, this.y, 4, 4);
        }
        ctx.drawImage(
            this.texture,
            this.spriteSheetOffsetX*this.width,
            this.width*this.animStep,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

}

export default Collectable;