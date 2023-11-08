import GameObject from "./GameObject.js";

class Object extends GameObject{
    #spriteSheetOffsetX
    #spriteSheetOffsetY
    #spriteSheetWidth
    #spriteSheetHeight

    constructor(x,y,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight) {
        super(x,y,width,height,texturepath);
        this.#spriteSheetOffsetX = spriteSheetOffsetX;
        this.#spriteSheetOffsetY = spriteSheetOffsetY;
        this.#spriteSheetWidth = spriteSheetWidth;
        this.#spriteSheetHeight = spriteSheetHeight;
    }
    get spriteSheetOffsetX() {
        return this.#spriteSheetOffsetX;
    }
    set spriteSheetOffsetX(value) {
        this.#spriteSheetOffsetX = value;
    }
    get spriteSheetOffsetY() {
        return this.#spriteSheetOffsetY;
    }
    set spriteSheetOffsetY(value) {
        this.#spriteSheetOffsetY = value;
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

    render(){
        super.render();
    }
}

export default Object;