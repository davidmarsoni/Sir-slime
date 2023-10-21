import GameObject from "./GameObject.js";

class Entity extends GameObject {
    #spriteDirectionOffset = 0;
    #animationOffset = 0;
    #spriteSheetWidth = 32;
    #spriteSheetHeight = 32;


    constructor(x, y, width, height, texturepath) {
        super(x, y, width, height, texturepath);
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

    // use the abstract method render() from the parent class
    render() {
        throw new Error("You have to implement the method render!");
    }
}

export default Entity;