import Entity from "../Entity.js";
class Enemy extends Entity{
    #isAlive = true;
    #hitSound;

    constructor(x, y, width, height, texturepath, speed, damage) {
        super(x, y, width, height, texturepath, speed, damage);
    }

    get isAlive() {
        return this.#isAlive;
    }

    set isAlive(value) {
        this.#isAlive = value;
       
    }

    get hitSound() {
        return this.#hitSound;
    }

    set hitSound(value) {
        this.#hitSound = value;
    }
    
}
export default Enemy;