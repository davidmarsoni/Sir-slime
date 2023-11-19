import Collectable from "./Collectible.js";

class Coin extends Collectable{
    #value = 10;

    constructor(x, y, width, height, texturepath,spriteSheetOffsetX,value,soundPath) {
        if(spriteSheetOffsetX === undefined){
            spriteSheetOffsetX = 0;
        }
        super(x, y, width, height, texturepath,spriteSheetOffsetX,soundPath);
       
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