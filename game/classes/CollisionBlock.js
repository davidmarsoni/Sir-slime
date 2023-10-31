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

            ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.fillRect(this.x, this.y, 8, 8);
        }
    }
    
    collide(player){
        // If the player is inside the collision block on the X and Y axis
        if(
            player.predictedX >= this.x
            && player.predictedX - player.width < this.x + this.width
            && player.predictedY > this.y
            && player.predictedY - player.height <= this.y + this.height + 1 ){
            // If the collision block is a floor
            if(this.collisionSide === 0){
                // If the player come from the top
                if(player.y <= this.y + 1){
                    player.y_v = 0;
                    player.predictedY = this.y + 1;
                    player.jump = false;
                } else {
                    // If the player is coming from the left
                    if(player.x <= this.x){
                        player.predictedX = this.x;
                    }
                    // If the player is coming from the right
                    else {
                        player.predictedX = this.x + this.width + player.width;
                    }
                }
            }
            // If the collision block is a wall right
            if(this.collisionSide === 1){
                // If the player come from the right
                if(player.x - player.width >= this.x + this.width){
                    player.predictedX = this.x + this.width + player.width;
                } else {
                    // If the player is coming from the top
                    if(player.y <= this.y + 1){
                        player.y_v = 0;
                        player.predictedY = this.y + 1;
                        player.jump = false;
                    }
                    // If the player is coming from the bottom
                    else {
                        player.predictedY = this.y + this.height + player.height;
                    }
                }
            }
            // If the collision block is a ceiling
            if(this.collisionSide === 2){
                if(player.y >= this.y + this.height){
                    player.predictedY = this.y + this.height + player.height;
                } else {
                    // If the player is coming from the right
                    if(player.x <= this.x){
                        player.predictedX = this.x;
                    }
                    // If the player is coming from the left
                    else {
                        player.predictedX = this.x + this.width + player.width;
                    }
                }
            }
            // If the collision block is a wall left
            if(this.collisionSide === 3){
                // If the player come from the left
                if(player.x <= this.x){
                    player.predictedX = this.x;
                } else {
                    // If the player is coming from the top
                    if(player.y <= this.y + 1){
                        player.y_v = 0;
                        player.predictedY = this.y + 1;
                        player.jump = false;
                    }
                    // If the player is coming from the bottom
                    else {
                        player.predictedY = this.y + this.height + player.height;
                    }
                }
            }
        }
    }
}

export default CollisionBlock;