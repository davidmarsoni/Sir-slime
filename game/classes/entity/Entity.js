import GameObject from "../GameObject.js";

class Entity extends GameObject {
    #spriteDirectionOffset = 0;
    #animationOffset = 0;
    #spriteSheetWidth = 32;
    #spriteSheetHeight = 32;
    #speed = 0;
    #damage = 0;

    constructor(x, y, width, height, texturepath, speed, damage) {
        super(x, y, width, height, texturepath);
        this.#speed = speed;
        this.#damage = damage;
    }

    get spriteDirectionOffset() {
        return this.#spriteDirectionOffset;
    }

    set spriteDirectionOffset(value) {
        this.#spriteDirectionOffset = value;
    }

    get animationOffset() {
        return this.#animationOffset;
    }

    set animationOffset(value) {
        this.#animationOffset = value;
    }

    get spriteSheetWidth() {
        return this.#spriteSheetWidth;
    }

    set spriteSheetWidth(value) {
        this.#spriteSheetWidth = value;
    }

    get spriteSheetHeight() {
        return this.#spriteSheetHeight;
    }

    set spriteSheetHeight(value) {
        this.#spriteSheetHeight = value;
    }

    get speed() {
        return this.#speed;
    }

    set speed(value) {
        this.#speed = value;
    }

    get damage() {
        return this.#damage;
    }

    set damage(value) {
        this.#damage = value;
    }

    // use the abstract method render() from the parent class
    render() {
        throw new Error("You have to implement the method render!");
    }
}

export default Entity;