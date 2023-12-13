import Entity from "../entity/Entity.js";
class Boss extends Entity{
    // Logic vars
    frame_WAIT_BETWEEN_CYCLE = 10;
    #waitCycleAI = 0;

    // Display vars
    // Notice : to be put in the JSON, see with time constraint or new plans for more bosses
    // dim of the boss bar :
    // 8 margin - 364 width - 8 margin
    // 128 height + 128 height for the damage bar
    // BB = Boss Bar
    static BBHEIGHT = 128;
    static BBMARGINSIDES = 8;
    static BBWIDTH = 364;
    static BBMARGINTOP = 10;
    static BBXPOSITIONCANVAS = 9/12;


    // States
    static IDLE = "idle";
    static ATTACK = "attack"

    #state = Boss.IDLE;
    #origin_x = 64;
    #origin_y = 64;
    #direction = true;
    #animStep = 0;
    #animTimer = 0;
    #path = [];
    #step = 0;
    #stepCycle = 0;
    #offsetX = 0;
    #offsetY = 0;
    #damage = 0;
    #totalHealth = 120;
    #health = 120;
    #handTrampleDamage = 30;
    #isAlive = true;
    #handLeft;
    #handRight;
    #targetHand;

    // Boss bar
    #bossBarPath = null;
    #bossBar = null;
    #bossBarLoaded = null;

    constructor(x, y, width, height, texturepath, bossbarpath, origin_x, origin_y, path, damage, health, handTrampleDamage) {
        super(x, y, width, height, texturepath);
        this.#origin_x = origin_x;
        this.#origin_y = origin_y;
        this.#path = path;
        this.#damage = damage;
        this.#health = health;
        this.#totalHealth = this.#health;
        this.#handTrampleDamage = handTrampleDamage;
        this.#bossBarPath = bossbarpath;
    }

    get handLeft() {
        return this.#handLeft;
    }

    set handLeft(value) {
        this.#handLeft = value;
        this.handLeft.boss = this;
    }

    get handRight() {
        return this.#handRight;
    }

    set handRight(value) {
        this.#handRight = value;
        this.handRight.boss = this;
    }

    get step() {
        return this.#step;
    }

    set step(value) {
        this.#step = value;
    }

    get bossBarPath() {
        return this.#bossBarPath;
    }

    set bossBarPath(value) {
        this.#bossBarPath = value;
    }

    get bossBar() {
        return this.#bossBar;
    }

    set bossBar(value) {
        this.#bossBar = value;
    }

    get bossBarLoaded() {
        if (this.#bossBarLoaded === null){
            this.loadTextureBossBar();
        }
        return this.#bossBarLoaded;
    }

    set bossBarLoaded(value) {
        this.#bossBarLoaded = value;
    }

    get path() {
        return this.#path;
    }

    set path(value) {
        this.#path = value;
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

    set isAlive(value) {
        this.#isAlive = value;
    }

    set health(value) {
        this.#health = value;
    }

    get health() {
        return this.#health;
    }

    set totalHealth(value) {
        this.#totalHealth = value;
    }

    get totalHealth() {
        return this.#totalHealth;
    }

    set handTrampleDamage(value) {
        this.#handTrampleDamage = value;
    }

    get handTrampleDamage() {
        return this.#handTrampleDamage;
    }

    debugCascade(value) {
        this.debug = value;
        this.handLeft.debug = value;
        this.handRight.debug = value;
    }

    render(ctx) {
        if(this.debug){
            ctx.fillStyle = "rgba(67,34,67,0.25)"
            ctx.fillRect(this.x - this.width,this.y - this.height,this.width,this.height)
        }
        this.animTimer++;
        if(this.animTimer===8){
            this.animTimer = 0;
            this.animStep++;
            if(this.animStep === 4){
                this.animStep = 0;
            }
        }

        if (this.textureLoaded){
            ctx.drawImage(
                this.texture,  // Sprite
                0,  // Sprite sheet offset x
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
        }

        if (this.handRight.isIdle) {
            this.handRight.render(ctx);
            this.handLeft.render(ctx);
        } else {
            this.handLeft.render(ctx);
            this.handRight.render(ctx);
        }

        // render the boss bar
        if (this.bossBarLoaded){
            // calculate the procent of the boss bar
            let procent = this.#health/this.#totalHealth;
            let bossBarWidth = Math.round(Boss.BBWIDTH*procent);
            let damageBarWidth = 364 - bossBarWidth;

            //debug of the whole bar
            if(this.debug){
                ctx.fillStyle = "rgb(24,232,15,0.1)";
                ctx.fillRect(ctx.canvas.width*Boss.BBXPOSITIONCANVAS - Boss.BBWIDTH/2, Boss.BBMARGINSIDES, bossBarWidth, Boss.BBHEIGHT);
                ctx.fillStyle = "rgba(89,9,9,0.1)";
                ctx.fillRect(ctx.canvas.width*Boss.BBXPOSITIONCANVAS - Boss.BBWIDTH/2 + bossBarWidth, Boss.BBMARGINSIDES, damageBarWidth, Boss.BBHEIGHT);
            }

            //undamaged part
            ctx.drawImage(
                this.bossBar,  // Sprite
                Boss.BBMARGINSIDES,  // Sprite sheet offset x
                0,  // Sprite sheet offset y
                Boss.BBWIDTH, // Sprite sheet w
                Boss.BBHEIGHT, // Sprite sheet h
                ctx.canvas.width*Boss.BBXPOSITIONCANVAS - Boss.BBWIDTH/2,
                Boss.BBMARGINTOP,
                Boss.BBWIDTH,
                Boss.BBHEIGHT
            );

            //damaged part
            ctx.drawImage(
                this.bossBar,  // Sprite
                Boss.BBMARGINSIDES+Boss.BBWIDTH-damageBarWidth,  // Sprite sheet offset x
                Boss.BBHEIGHT,  // Sprite sheet offset y
                damageBarWidth, // Sprite sheet w
                Boss.BBHEIGHT, // Sprite sheet h
                ctx.canvas.width*Boss.BBXPOSITIONCANVAS - Boss.BBWIDTH/2 + bossBarWidth,
                Boss.BBMARGINTOP,
                damageBarWidth,
                Boss.BBHEIGHT
            );

            if(this.debug){
                ctx.fillStyle = "black";
                ctx.font = "10px Arial";
                ctx.fillText(this.#state, this.x - this.width/2, this.y - this.width - 20);
                ctx.fillText(this.#health + "/" + this.#totalHealth, this.x - this.width/2, this.y - this.width - 10);
            }
        }
    }



    collide(player, fireballs) {
        // if the boss is attacking smth
        if (this.#state === Boss.ATTACK){
            this.#targetHand.collide(player, fireballs);
        }
    }

    enactAI(player) {
        this.#waitCycleAI++;
        if (this.#waitCycleAI > this.frame_WAIT_BETWEEN_CYCLE){
            switch (this.#state){
                case Boss.IDLE:
                    this.#state = Boss.ATTACK
                    if (Math.random() < 0.5) {
                        this.#targetHand = this.handLeft;
                    } else {
                        this.#targetHand = this.handRight;
                    }
                    this.#targetHand.target = player;
                    this.#targetHand.beginAttackCycle();
                    break;
                case Boss.ATTACK:
                    if(this.#targetHand.isIdle){
                        this.#targetHand = null;
                        this.#state = Boss.IDLE
                        this.#waitCycleAI = 0;
                    } else {
                        this.#targetHand.target = player;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    // move
    move() {
        this.#stepCycle++;
        if (this.#stepCycle === 18) {
            this.#stepCycle = 0;
            this.#step++;
            if (this.#step === 8) {
                this.#step = 0;
            }
            this.#offsetX = (this.#path[this.#step].x - this.x)/18;
            this.#offsetY = (this.#path[this.#step].y - this.y)/18;
        }
        this.x += this.#offsetX;
        this.y += this.#offsetY;
    }

    moveHands(){
        let offsetX = this.x - this.origin_x;
        let offsetY = this.y - this.origin_y;

        this.handLeft.offsetXLink = offsetX;
        this.handLeft.offsetYLink = offsetY;

        this.handRight.offsetXLink = offsetX;
        this.handRight.offsetYLink = offsetY;

        this.handLeft.move();
        this.handRight.move();
    }

    // loading the boss bar
    loadTextureBossBar(){
        this.#bossBar = new Image();
        this.#bossBar.src = this.#bossBarPath;

        this.#bossBar.onload = () => {
            this.#bossBarLoaded = true;
        };
        this.#bossBar.onerror = () => {
            console.log('Failed to load image:'+ this.#bossBar.src+ " for "+this.constructor.name);
            this.#bossBarLoaded = false;
        };
    }
}

export default Boss;

