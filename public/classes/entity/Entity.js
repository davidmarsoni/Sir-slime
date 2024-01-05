import GameObject from "../GameObject.js";

class Entity extends GameObject {
    #spriteDirectionOffset = 0;
    #animationOffset = 0;
    #spriteSheetWidth = 32;
    #spriteSheetHeight = 32;
    #speed = 0;
    #damage = 0;
    #isAlive = true;

    constructor(x, y, width, height, texturepath, speed, damage) {
        super(x, y, width, height, texturepath);
        this.#speed = speed;
        this.#damage = damage;
    }

    get spriteDirectionOffset() { return this.#spriteDirectionOffset; }
    set spriteDirectionOffset(value) { this.#spriteDirectionOffset = value; }
    get animationOffset() { return this.#animationOffset; }
    set animationOffset(value) { this.#animationOffset = value; }
    get spriteSheetWidth() { return this.#spriteSheetWidth; }
    set spriteSheetWidth(value) { this.#spriteSheetWidth = value; }
    get spriteSheetHeight() { return this.#spriteSheetHeight; }
    set spriteSheetHeight(value) { this.#spriteSheetHeight = value; }
    get speed() { return this.#speed; }
    set speed(value) { this.#speed = value;}
    get damage() {return this.#damage; }
    set damage(value) {this.#damage = value;}
    get isAlive() {return this.#isAlive;}
    set isAlive(value) { this.#isAlive = value; }

    setAlive(value) {
        this.isAlive = value;
    }

    get center() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2
        }
    }
    get maxX() { return this.x;}
    get maxY() { return this.y;}
    get minX() { return this.x - this.width;}
    get minY() {return this.y - this.height;}

    render() {}
}

export default Entity;