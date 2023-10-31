import Collectable from "./Collectible.js";

class Coin extends Collectable{
    #value = 1;

    constructor(x, y, width, height, texturepath,value,spriteSheetOffsetX) {
        if(spriteSheetOffsetX === undefined){
            spriteSheetOffsetX = 0;
        }
        super(x, y, width, height, texturepath, spriteSheetOffsetX);
        this.#value = value;
    }
    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    collect(player) {
        this.debug ? console.log("coin collected") : null;
        player.score += this.#value;
        player.addCoinCollected();
    }
}
export default Coin;