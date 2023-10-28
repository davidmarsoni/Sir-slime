import GameObjectLogic from './GameObjectLogic.js';

class GameObject extends GameObjectLogic{
    #texturepath;
    #textureLoaded = false;
    #texture;
    constructor(x, y, width, height, texturepath) {
        super(x, y, width, height);
        try {
            this.#texture = new Image();
            this.#texture.src = texturepath;
        } catch (error) {
            console.warn('Failed to load image:'+ texturepath+ " for "+this.constructor.name);
        }
        this.#texture.onload = () => {
            this.#textureLoaded = true;
        };
        this.#texture.onerror = () => {
            console.error('Failed to load image:'+ this.#texture.src+ " for "+this.constructor.name);
        };
        this.#texture.src =texturepath;
       
    }

    get texture() {
        return this.#texture;
    }
    get textureLoaded() {
        return this.#textureLoaded;
    }
}

export default GameObject;