import GameObjectLogic from './GameObjectLogic.js';

class PassageWay extends GameObjectLogic {
    #passageWayTo = "";

    constructor(x, y, width, height, passageWayTo) {
        super(x, y, width, height);
        this.#passageWayTo = passageWayTo;
    }

    get passageWayTo() {
        return this.#passageWayTo;
    }

    set passageWayTo(value) {
        this.#passageWayTo = value;
    }

    collide(player) {
        if(player.x >= this.x
            && player.x - player.width < this.x + this.width
            && player.y > this.y
            && player.y - player.height <= this.y + this.height){
            return true;
        }
    }

    render(ctx) {
        if(this.debug){
            ctx.fillStyle = 'rgba(185,255,245,0.75)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

export default PassageWay;