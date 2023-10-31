import Collectable from "./Collectible.js";
class Heart extends Collectable{
    #value = 1;

    constructor(x, y, width, height, texturepath,value,spriteSheetOffsetX) {
        if(spriteSheetOffsetX === undefined || spriteSheetOffsetX === null || spriteSheetOffsetX === 0){
            spriteSheetOffsetX = 7;
        }
        super(x, y, width, height, texturepath,spriteSheetOffsetX);
        this.#value = value;
    }
    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    collect(player) {
        this.debug ? console.log("heart gain") : null;
        player.addHeartCollected();
        player.lives += this.#value;
    }
}

export default Heart;