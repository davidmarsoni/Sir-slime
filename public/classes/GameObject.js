import GameObjectLogic from './GameObjectLogic.js';

class GameObject extends GameObjectLogic{
    #textureLoaded = null;
    #texture;
    #texturepath;
    constructor(x, y, width, height, texturepath) {
        super(x, y, width, height);
        this.texturepath = texturepath;
    }

    get texture() {
        return this.#texture;
    }

    set texture(value) {
        this.#texture = value;
    }

    get textureLoaded() {
        if(this.#textureLoaded === null){
            this.loadTexture();
        }
        return this.#textureLoaded;
    }

    set textureLoaded(value){
        this.#textureLoaded = value;
    }

    get texturepath() {
        return this.#texturepath;
    }

    set texturepath(value) {
        this.#texturepath = value;
    }
    


    loadTexture(){
        this.#texture = new Image();
        this.#texture.src = this.texturepath;
        this.#texture.onload = () => {
            this.#textureLoaded = true;
        };
        this.texture.onerror = () => {
            console.log('Failed to load image:'+ this.#texture.src+ " for "+this.constructor.name);
            this.#textureLoaded = false;
        };
    }

    render(ctx){
        if(this.isRendered == false) return;

        if(this.textureLoaded == true){
            ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
        }
    }
}

export default GameObject;