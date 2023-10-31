import Entity from "../Entity.js";
class Enemy extends Entity{
    #isAlive = true;
    #isRendered = true;

    constructor(x, y, width, height, texturepath, speed, damage) {
        super(x, y, width, height, texturepath, speed, damage);
    }

    get isAlive() {
        return this.#isAlive;
    }

    set isAlive(value) {
        this.#isAlive = value;
       
    }

    get isRendered() {
        return this.#isRendered;
    }

    set isRendered(value) {
        this.#isRendered = value;
    }

}
export default Enemy;