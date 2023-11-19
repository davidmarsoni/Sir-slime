import GameObjectLogic from "../GameObjectLogic.js";
import Entity from "./Entity.js";

/**
 * @class Spike
 * @extends Entity
 * @classdesc A spike is a trap that can be static or dynamic. It can be placed in any direction and can be up or down.
 *            It hurts the player if he touches it when it is up.
 */
class Spike extends Entity {
    // Directions
    static UP = 0;
    static DOWN = 1;
    static LEFT = 2;
    static RIGHT = 3;
    
    #state = 'idleUp'; // state
    #frame = 0; // frame of the animation 
    #delay = 10; // delay between each frame

    #isStatic = false; // mode of the spike
    #facing = Spike.UP; // direction of the spike
    #upTime = 0; // time the spike is up
    #downTime = 0; // time the spike is down

    // Timers
    #upTimer = 0;
    #downTimer = 0;
    #waitTimer = 0;

    // Hitbox sizes
    #hitBoxSizeX = 0;
    #hitBoxSizeY = 0;

    // hitbox position
    #hitBox = [];

    constructor(x, y, width, height, texturepath, speed, damage,facing,isStatic = true,upTime = 0,downTime = 0) {
        super(x, y, width, height, texturepath, speed, damage);
        this.#facing = facing;
        this.#isStatic = isStatic;
        this.#upTime = upTime;
        this.#downTime = downTime;

        this.hitBox = new GameObjectLogic(0,0,0,0);
    }

    get fixed() { return this.#isStatic; } 
    set fixed(value) { this.#isStatic = value; }
    get facing() { return this.#facing; } 
    set facing(value) { this.#facing = value; }
    get upTime() { return this.#upTime; }
    set upTime(value) { this.#upTime = value; }
    get downTime() { return this.#downTime; }
    set downTime(value) { this.#downTime = value; }
    
    get hitBoxSizeX() { return this.#hitBoxSizeX; } 
    set hitBoxSizeX(value) { this.#hitBoxSizeX = value; }
    get hitBoxSizeY() { return this.#hitBoxSizeY; } 
    set hitBoxSizeY(value) { this.#hitBoxSizeY = value; }
    get hitBox() { return this.#hitBox; }
    set hitBox(value) { this.#hitBox = value; }


    animate() {
        switch (this.#state) {
            case 'idleUp':
            case 'idleDown':
                this.animateIdle();
                break;
            case 'toUp':
            case 'toDown':
                this.animateTo();
                break;
        }
        this.updateHitbox();
        this.calculatePredictedHitbox();
    }
    
    animateIdle() {
        this.#waitTimer++;
        if (this.#state === 'idleUp') {
            this.#upTimer++;
            if (this.#waitTimer >= this.#delay) {
                this.#waitTimer = 0;
                this.#frame = this.#frame === 0 ? 1 : 0;
            }
            if (this.#upTimer >= this.upTime) {
                this.#upTimer = 0;
                this.#waitTimer = 0;
                this.#state = 'toDown';
            }
        } else {  // state === 'idleDown'
            this.#downTimer++;
            if (this.#downTimer >= this.downTime) {
                this.#downTimer = 0;
                this.#state = 'toUp';
            }
        }
    }
    
    animateTo() {
        this.#waitTimer++;
        if (this.#waitTimer >= this.#delay) {
            this.#waitTimer = 0;
            if (this.#state === 'toUp') {
                this.#frame--;
                if(this.#frame === 3){
                    this.#frame = 1;
                }
                if (this.#frame === 0) {
                    this.#state = 'idleUp';
                }
            } else {  // state === 'toDown'
                this.#frame++;
                if (this.#frame === 4) {
                    this.#state = 'idleDown';
                }
            }
        }
    }

    updateHitbox() {
        const hitboxSizes = {
            [Spike.UP]: this.height,
            [Spike.DOWN]: this.height - this.height / 4,
            [Spike.LEFT]: this.height - this.height / 2,
            [Spike.RIGHT]: this.height - this.height / 2 - this.height / 4,
            [Spike.IDLE]: 0
        };

        this.hitBoxSizeX = this.width;
        this.hitBoxSizeY = hitboxSizes[this.#frame];

        if (this.facing === Spike.DOWN) {
            this.hitBoxSizeY = hitboxSizes[4 - this.#frame];  // Reverse the frame order for the down direction
        } else if (this.facing === Spike.LEFT || this.facing === Spike.RIGHT) {
            this.hitBoxSizeX = hitboxSizes[this.#frame];  // Use hitboxSizes for the width in the left and right directions;
        }
    }

    calculatePredictedHitbox() {
        this.hitBox.x = this.x- this.width;
        this.hitBox.y = this.y- this.height;
        this.hitBox.width = this.width;
        this.hitBox.height = this.height;

        if (this.facing === Spike.UP) {
            this.hitBox.y += this.height - this.hitBoxSizeY;
            this.hitBox.height = this.hitBoxSizeY;
        } else if (this.facing === Spike.DOWN) {
            this.hitBox.height = this.hitBoxSizeY;
        } else if (this.facing === Spike.LEFT) {
            this.hitBox.width = this.hitBoxSizeX;
            
        } else if (this.facing === Spike.RIGHT) {
            this.hitBox.x += this.width - this.hitBoxSizeX;
            this.hitBox.width = this.hitBoxSizeX;
        }
    }
    collide(player){
        if(player.InAPerimeter(this.#hitBox,0,0)){
            this.debug ? console.log("collide") : null;
            
            player.jump = true;
            player.hit(this.damage,false);
        }
    }

    render(ctx) {
        if(this.isRendered === false){
            return;
        }

        this.animate();
        if(this.textureLoaded === true){
            ctx.drawImage(
                this.texture,  // Sprite
                this.width*this.facing,  // Sprite sheet offset x
                this.width*this.#frame,  // Sprite sheet offset y
                this.width, // Sprite sheet w
                this.height, // Sprite sheet h
                this.x - this.width,
                this.y - this.height,
                this.width,
                this.height
            )
        }

        if(this.debug === true){
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x - this.width, this.y - this.height, this.width, this.height);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - 8, this.y - 8, 8, 8);
        
            // Draw the hitbox in green
            ctx.strokeStyle = "green";
            ctx.strokeRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
            ctx.fillStyle = "rgba(0,255,0,0.25)";
            ctx.fillRect(this.hitBox.x, this.hitBox.y, this.hitBox.width, this.hitBox.height);
        
            // Add the time remaining and the current state
            ctx.fillStyle = "black";
            ctx.font = "10px Arial";
            ctx.fillText(this.#state, this.x - this.width/2, this.y - this.width - 20);
        
            // Display timer information
            const timerText = this.#downTimer ? `${this.#downTimer}/${this.#downTime}` : `${this.#upTimer}/${this.#upTime}`;
            if (this.#downTimer || this.#upTimer) {
                ctx.fillText(timerText, this.x - this.width/2 , this.y - this.width - 10);
            }
        }
    }
}

export default Spike;   