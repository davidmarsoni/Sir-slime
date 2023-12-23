import Object from "../Object.js";

class Collectable extends Object {
    #animStep = 0;
    #animTimer = 0;
    #sound = null;
    #isAlive;
    #soundPath;

    constructor(x, y, width, height, texturepath, spriteSheetOffsetX, soundPath) {
        super(x, y, width, height, texturepath, spriteSheetOffsetX, 0, width, height);
        this.#isAlive = true;
        this.soundPath = soundPath;
    }
    get animStep() { return this.#animStep; }
    set animStep(value) { this.#animStep = value; }

    get animTimer() { return this.#animTimer; }
    set animTimer(value) { this.#animTimer = value; }

    get sound() { return this.#sound; }
    set sound(value) { this.#sound = value; }

    get soundPath() { return this.#soundPath; }
    
    set soundPath(value) {
        this.#soundPath = value;
        this.#sound = new Audio(value);
        this.#sound.volume = 0.1;
        this.#sound.onerror = () => {
            console.log("failed to load sound for " + this.constructor.name);
            this.#sound = null;
        };
    }

    get isAlive() { return this.#isAlive; }
    set isAlive(value) { this.#isAlive = value; }

    collide(player) {

        if (this.isAlive === false) {
            return;
        }
        if (player.x >= this.x
            && player.x - player.width < this.x + this.width
            && player.y > this.y
            && player.y - player.height <= this.y + this.height) {

            this.isRendered = false;
            this.isAlive = false;
            this.playSound && this.sound != null && this.sound.play();
            this.collect(player);
        }
    }

    collect(player) {
    }

    render(ctx) {
        if (this.isRendered === false) {
            return;
        }

        if (this.isAnimated === true) {
            this.animTimer++;
            if (this.animTimer === 8) {
                this.animTimer = 0;
                this.animStep++;
                if (this.animStep === 4) {
                    this.animStep = 0;
                }
            }
        }
        if (this.debug) {
            ctx.fillStyle = 'rgba(230,230,230,0.75)';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(this.x, this.y, 4, 4);
        }

        if (this.textureLoaded === true) {
            ctx.drawImage(
                this.texture,
                this.spriteSheetOffsetX * this.width,
                this.width * this.animStep,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }
}

export default Collectable;