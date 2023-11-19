import Collectable from "./Collectible.js";
class Heart extends Collectable{
    #heal 
    #heart_gain = 0;

    constructor(x, y, width, height, texturepath,spriteSheetOffsetX,heal,heart_gain,soundPath) {
        if(spriteSheetOffsetX === undefined || spriteSheetOffsetX === null || spriteSheetOffsetX === 0){
            spriteSheetOffsetX = 7;
        }
        super(x, y, width, height, texturepath,spriteSheetOffsetX,soundPath);
        this.heal = heal;
        this.#heart_gain = heart_gain;
        
    }
    get heart_gain() {
        return this.#heart_gain;
    }

    set heart_gain(value) {
        this.#heart_gain = value;
    }

    get heal() {
        return this.#heal;
    }

    set heal(value) {
        if(value === undefined || value === 0){
            this.#heal = null;
        }else{
            this.#heal = value;
        }
    }

    collect(player) {
        this.debug ? console.log("heart collected") : null;
        player.addHeart(this.#heart_gain);
        player.heal(this.#heal);
    }
}

export default Heart;