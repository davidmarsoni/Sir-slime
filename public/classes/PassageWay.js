import GameObjectLogic from './GameObjectLogic.js';
import firebase from './management/Firebase.js';

class PassageWay extends GameObjectLogic{
    #passageWayTo = "";
    #title = "";
    #content = "";
    #isNewLevel = true;

    constructor(x, y, width, height, passageWayTo, title, content, isNewLevel = true) {
        super(x, y, width, height);
        this.#passageWayTo = passageWayTo;
        this.isAnimate = false;
        this.#title = title;
        this.#content = content;
        this.#isNewLevel = isNewLevel;
    }

    get passageWayTo() { return this.#passageWayTo; }
    set passageWayTo(value) { this.#passageWayTo = value; }

    get title() { return this.#title; }
    set title(value) { this.#title = value; }

    get content() { return this.#content; }
    set content(value) { this.#content = value; }
    
    get isNewLevel() { return this.#isNewLevel; }
    set isNewLevel(value) { this.#isNewLevel = value; }

    collide(player) {
        if(player.x >= this.x
            && player.x - player.width < this.x + this.width
            && player.y > this.y
            && player.y - player.height <= this.y + this.height){
            player.addLevelCompleted();
            return true;
        }
    }
    
    render(ctx) {
        if(this.isRendered === false){
            return;
        }
        if(this.debug){
            ctx.fillStyle = 'rgba(185,255,245,0.75)';
            ctx.fillRect(this.x, this.y, this.width, this.height);

            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(this.x, this.y, 8, 8);
        }
    }
}

export default PassageWay;