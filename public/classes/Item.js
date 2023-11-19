import GameObject from "./GameObject.js";
/**
 * @deprecated
 */
class Item extends GameObject{
    #spriteSheetWidth = 32;
    #spriteSheetHeight = 32;

    constructor(x,y, width, height, texturepath) {
        super(x, y, width, height, texturepath);
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

  
    render() {
        throw new Error("Only Entities can render items!");
    }
}

export default Item;