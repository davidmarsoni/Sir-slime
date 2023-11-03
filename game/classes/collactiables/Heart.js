import Collectable from "./Collectible.js";
class Heart extends Collectable{
    #heal 
    #hearthGain = 0;

    constructor(x, y, width, height, texturepath,spriteSheetOffsetX,heal,hearthGain,sound) {
        if(spriteSheetOffsetX === undefined || spriteSheetOffsetX === null || spriteSheetOffsetX === 0){
            spriteSheetOffsetX = 7;
        }
        super(x, y, width, height, texturepath,spriteSheetOffsetX,sound);
        if(heal === undefined || heal === 0){
            heal = null;
        }
        this.#heal = heal;
        this.#hearthGain = hearthGain;
        
    }
    get hearthGain() {
        return this.#hearthGain;
    }

    set hearthGain(value) {
        this.#hearthGain = value;
    }

    get heal() {
        return this.#heal;
    }

    set heal(value) {
        this.#heal = value;
    }

    collect(player) {
        this.debug ? console.log("heart collected") : null;
        player.addHeart(this.#hearthGain);
        player.heal(this.#heal);
    }
}

export default Heart;