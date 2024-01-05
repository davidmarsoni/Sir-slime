import Entity from "../Entity.js";
class Enemy extends Entity {
    #hitSound;
    #deathSound;

    constructor(x, y, width, height, texturepath, speed, damage, hitSound, deathSound) {
        super(x, y, width, height, texturepath, speed, damage);
        this.hitSound = hitSound;
        this.deathSound = deathSound;
    }

    get hitSound() { return this.#hitSound;}
    set hitSound(value) {
        this.#hitSound = new Audio(value);
        this.#hitSound.volume = 0.2;
        this.#hitSound.onerror = () => {
            console.log("Error loading hit sound of " + this.constructor.name);
            this.#hitSound = null;
        };
    }

    get deathSound() { return this.#deathSound; }
    set deathSound(value) {
        this.#deathSound = new Audio(value);
        this.#deathSound.volume = 0.2;
        this.#deathSound.onerror = () => {
            console.log("Error loading dead sound of " + this.constructor.name);
            this.#deathSound = null;
        };
    }
}
export default Enemy;