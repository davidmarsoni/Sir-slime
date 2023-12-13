import Entity from "../entity/Entity.js";
import GameObjectLogic from "../GameObjectLogic.js";
import Fireballs from "../entity/Utility/fireballs.js";
class Hand extends Entity{
    /*
    * state: idle, translating to target, preparing attack, attacking, on the ground, returning to origin, hand jump, die
     */
    static IDLE = "idle";
    static TRANSLATE_TO_TARGET = "transTarget";
    static PREPARE_TO_ATTACK = "prepareAttack";
    static ATTACK = "attack";
    static ON_GROUND = "onGround";
    static TRANSLATE_TO_ORIGIN = "transOrigin";

    // Logic vars
    frame_WAIT_BEFORE_SMASH = 40;
    distance_FROM_TARGET = -200;


    #state = Hand.IDLE;
    #origin_x = 64;
    #origin_y = 64;
    #levelBottom = 0;
    #direction = true;
    #animStep = 0;
    #animTimer = 0;
    #animAccel = 0;
    #step = 0;
    #offsetXLink = 0;
    #offsetYLink = 0;
    #speed = 1;
    #damage = 0;
    #isAlive = true;
    #right = true;
    #boss;

    // Target vars
    #target
    #targetStep = 0;

    // Hitbox vars
    #hitboxWidth = 180;
    #offsetXHitbox = 192;
    #offsetYHitbox = 116;

    #hasHitThePlayer = false;

    constructor(x, y, width, height, texturepath, origin_x, origin_y, speed,damage, right, levelBottom) {
        super(x, y, width, height, texturepath, speed, damage);
        this.#origin_x = origin_x;
        this.#origin_y = origin_y;
        this.#speed = speed;
        this.#damage = damage;
        this.#right = right;
        if (this.#right) {
            this.#offsetXHitbox = 64 + this.#hitboxWidth;
        }
        this.#levelBottom = levelBottom;
    }

    get step() {
        return this.#step;
    }

    set step(value) {
        this.#step = value;
    }

    get speed() {
        return this.#speed;
    }

    set speed(value) {
        this.#speed = value;
    }

    get animTimer() {
        return this.#animTimer;
    }

    set animTimer(value) {
        this.#animTimer = value;
    }

    get animStep() {
        return this.#animStep;
    }

    set animStep(value) {
        this.#animStep = value;
    }

    get direction() {
        return this.#direction;
    }

    set direction(value) {
        this.#direction = value;
    }

    get origin_y() {
        return this.#origin_y;
    }

    set origin_y(value) {
        this.#origin_y = value;
    }

    get origin_x() {
        return this.#origin_x;
    }

    set origin_x(value) {
        this.#origin_x = value;
    }

    get damage() {
        return this.#damage;
    }

    set damage(value) {
        this.#damage = value;
    }

    get isAlive() {
        return this.#isAlive;
    }

    set isAlive(value) {$
        this.#isAlive = value;
    }

    get offsetXLink() {
        return this.#offsetXLink;
    }

    set offsetXLink(value) {
        this.#offsetXLink = value;
    }

    get offsetYLink() {
        return this.#offsetYLink;
    }

    set offsetYLink(value) {
        this.#offsetYLink = value;
    }

    get state() {
        return this.#state;
    }

    set state(value) {
        this.#state = value;
    }

    get target() {
        return this.#target;
    }

    set target(value) {
        if(this.state === Hand.IDLE || this.state === Hand.TRANSLATE_TO_TARGET || this.state === Hand.PREPARE_TO_ATTACK) {
            this.#target = new GameObjectLogic(value.x, value.y + this.distance_FROM_TARGET, 0, 0);
        }
    }

    set boss(value) {
        this.#boss = value;
    }

    get isIdle(){
        return this.#state === Hand.IDLE;
    }

    get HitboxLeft() {
        return this.x - this.#offsetXHitbox;
    }

    get HitboxTop() {
        return this.y - this.height + this.#offsetYHitbox;
    }

    get HitboxRight() {
        return this.HitboxLeft + this.#hitboxWidth;
    }

    get HitboxBottom() {
        return this.y;
    }

    render(ctx) {
        if(this.debug){
            ctx.fillStyle = "rgba(67,34,67,0.25)"
            ctx.fillRect(this.x - this.width,this.y - this.height,this.width,this.height)
            ctx.fillStyle = "rgba(169,208,72,0.25)"
            ctx.fillRect(this.HitboxLeft, this.HitboxTop,this.#hitboxWidth,this.height - this.#offsetYHitbox)

            ctx.fillStyle = "rgb(218,49,49)";
            ctx.fillRect(this.HitboxRight, 400, -4, -4);
            ctx.fillStyle = "rgb(81,143,225)"
            ctx.fillRect(this.HitboxLeft, 400, 4, -4);
        }

        if (this.#state === Hand.PREPARE_TO_ATTACK){
            this.animTimer++;
            if(this.animTimer >= 16-this.#animAccel) {
                this.animTimer = 0;
                this.animStep++;
                if(this.animStep === 4){
                    this.animStep = 2;
                    this.#animAccel++;
                }
            }
        } else if (this.#state === Hand.ON_GROUND || this.#state === Hand.ATTACK) {
            this.animStep = 2;
        } else {
            this.animTimer++;
            if(this.animTimer===32){
                this.animTimer = 0;
                this.animStep++;
                if(this.animStep >= 2){
                    this.animStep = 0;
                }
            }
        }

        //this.animStep = 2;

        if (this.textureLoaded){
            ctx.drawImage(
                this.texture,  // Sprite
                this.#right*this.width,  // Sprite sheet offset x
                this.width*this.animStep,  // Sprite sheet offset y
                this.width, // Sprite sheet w
                this.width, // Sprite sheet h
                this.x - this.width,
                this.y - this.height,
                this.width,
                this.height
            );
        }
        if (this.debug) {
            ctx.fillStyle = "#000";
            ctx.fillRect(this.x, this.y, -8, -8);
            ctx.fillStyle = "black";
            ctx.font = "10px Arial";
            ctx.fillText(this.#state, this.x - this.width/2, this.y - this.width - 20);
            ctx.fillText(this.#targetStep, this.x - this.width/2, this.y - this.width - 10);
        }
    }

    collide(player, fireballs) {
        // if the player collides with the hand hitbox
        //console.log(player.predictedX, player.predictedX-player.width,this.x, this.HITBOXRIGHT)
        //console.log(player.predictedX > this.HITBOXLEFT, player.predictedX - player.width < this.HITBOXRIGHT, player.predictedY > this.HITBOXTOP, player.predictedY - player.height < this.HITBOXBOTTOM)
        if (
            player.predictedX > this.HitboxLeft &&
            player.predictedX - player.width < this.HitboxRight &&
            player.predictedY > this.HitboxTop &&
            player.predictedY - player.height < this.HitboxBottom
        ) {
            this.debug ? console.log("collision") : null;
            // see what state we are in
            switch (this.#state) {
                case Hand.ATTACK:
                    // if the player hasn't already been hit
                    if (!this.#hasHitThePlayer) {
                        // do the damage to the player
                        player.hit(3);
                        // give the player a bit of air time (make the impact impactful)
                        player.y_v = -10;
                        player.predictedY -= 1;
                        this.#hasHitThePlayer = true;
                    }
                    break;
                case Hand.ON_GROUND:
                    // if the player is on the top && descending
                    if (
                        player.y <= this.HitboxTop+3 &&
                        player.predictedY <= this.HitboxBottom &&
                        player.y_v > 0
                    ) {
                        this.debug ? console.log("trample") : null;
                        player.y_v = -14;
                        player.score += 250;
                        player.addDamageDealt(this.#boss.handTrampleDamage);
                        this.#boss.health -= this.#boss.handTrampleDamage;
                        // make the hand quit the on ground mode
                        this.#targetStep = 9999;
                        if (this.#boss.health <= 0) {
                            this.#boss.isAlive = false;
                            player.addEnemykilled();
                            player.score += 10000;
                        }
                    } else {
                        // the player is not on top && descending to trample
                        // do nothing
                    }
                    break;
            }
        }
        if (fireballs != null){
            // if the fireball collides with the hand hitbox
            for (let i = 0; i < fireballs.length; i++) {
                if (
                    fireballs[i].x > this.HitboxLeft &&
                    fireballs[i].x - fireballs[i].width < this.HitboxRight &&
                    fireballs[i].y > this.HitboxTop &&
                    fireballs[i].y - fireballs[i].height < this.HitboxBottom
                ) {
                    if (this.#state === Hand.ON_GROUND){
                        console.log(i);
                        Fireballs.removeFireball(fireballs, i);
                        this.#boss.health -= 1;
                        player.score += 10;
                        player.addDamageDealt(1);
                        if (this.#boss.health <= 0) {
                            this.#boss.isAlive = false;
                            player.addEnemykilled();
                            player.score += 10000;
                        }
                    }
                }
            }
        }
    }

    beginAttackCycle(){
        this.#state = Hand.TRANSLATE_TO_TARGET;
        this.#hasHitThePlayer = false;
    }

    // move the hand
    move() {
        switch (this.#state) {
            case Hand.IDLE:
                this.x = this.origin_x + this.offsetXLink;
                this.y = this.origin_y + this.offsetYLink;
                break
            case Hand.TRANSLATE_TO_TARGET:
                if (this.#targetStep < 30){
                    this.#targetStep++;
                    // move to the target position in 30 steps
                    this.x += (this.target.x - this.x + this.width/2) / (30 - this.#targetStep);
                    this.y += (this.target.y - this.y) / (30 - this.#targetStep);
                } else {
                    this.x = this.target.x + this.width/2;
                    this.y = this.target.y - 50;
                    this.#state = Hand.PREPARE_TO_ATTACK;
                    this.#targetStep = 0;
                    this.animStep = 2;
                    this.animTimer = 0;
                    this.#animAccel = 0;
                }
                break;
            case Hand.PREPARE_TO_ATTACK:
                this.x = this.target.x + this.width/2;
                this.y = this.target.y - 50;
                if(this.#animAccel === 16){
                    this.state = Hand.ATTACK;
                    this.#animAccel = 0;
                    this.target.height = this.y;
                }
                break
            case Hand.ATTACK:
                if(this.#targetStep < this.frame_WAIT_BEFORE_SMASH){
                    // wait 20 steps
                    this.#targetStep++;
                } else if (this.#targetStep < 5 + this.frame_WAIT_BEFORE_SMASH){
                    this.#targetStep++;
                    this.y += (this.#levelBottom - this.target.height) / 5;
                } else {
                    this.state = Hand.ON_GROUND;
                    this.#targetStep = 0;
                }
                break
            case Hand.ON_GROUND:
                if (this.#targetStep < 200){
                    // wait 200 steps
                    this.#targetStep++;
                } else {
                    this.state = Hand.TRANSLATE_TO_ORIGIN;
                    this.#animStep = 0;
                    this.#targetStep = 0;
                }
                break;
            case Hand.TRANSLATE_TO_ORIGIN:
                if (this.#targetStep < 10){
                    this.#targetStep++;
                    // move to the sync position in 10 steps
                    this.x += ((this.origin_x + this.offsetXLink) - this.x) / 10;
                    this.y += ((this.origin_y + this.offsetYLink) - this.y) / 10;

                } else {
                    this.state = Hand.IDLE;
                    this.x = this.origin_x + this.offsetXLink;
                    this.y = this.origin_y + this.offsetYLink;
                }
                break;
        }
    }



}

export default Hand;

