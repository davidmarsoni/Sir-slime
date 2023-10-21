import GameObjectLogic from './GameObjectLogic.js';
class CollisionBlock extends GameObjectLogic{
    #collisionSide;
    constructor(x, y, width, height, collisionSide) {
        super(x, y, width, height);
        this.#collisionSide = collisionSide;
    }

    get collisionSide() {
        return this.#collisionSide;
    }

    set collisionSide(value) {
        this.#collisionSide = value;
    }

    render(ctx) {
        if (this.debug) {
            if (this.collisionSide === 0){
                ctx.fillStyle = "rgba(255,0,0,0.50)";
            } else if (this.collisionSide === 1){
                ctx.fillStyle = "rgba(0,255,0,0.50)";
            } else  if (this.collisionSide === 2){
                ctx.fillStyle = "rgba(0,0,255,0.50)";
            } else  if (this.collisionSide === 3){
                ctx.fillStyle = "rgba(255,255,0,0.50)";
            }
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export default CollisionBlock;