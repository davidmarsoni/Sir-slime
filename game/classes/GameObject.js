import GameObjectLogic from './GameObjectLogic.js';

class GameObject extends GameObjectLogic{
    #texturepath;
    #textureLoaded = false;
    #texture;
    constructor(x, y, width, height, texturepath) {
        super(x, y, width, height);
        this.#texture = new Image();
        this.#texture.src = texturepath;
        this.#texture.onload = () => {
            this.#textureLoaded = true;
        };
        this.#texture.onerror = () => {
            console.error('Failed to load image:', this.#texture.src);
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