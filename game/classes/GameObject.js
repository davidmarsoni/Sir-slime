import GameObjectLogic from './GameObjectLogic.js';

class GameObject extends GameObjectLogic{
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
            console.log('Failed to load image:'+ this.#texture.src+ " for "+this.constructor.name);
        };
    }

    get texture() {
        return this.#texture;
    }
    get textureLoaded() {
        return this.#textureLoaded;
    }

    render(){
        super.render();
    }
}

export default GameObject;