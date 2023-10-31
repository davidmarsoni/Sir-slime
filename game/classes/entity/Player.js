import Entity from "./Entity.js";

class Player extends Entity{
    // life variables
    #maxHealth = 0;
    #currenthealth = 0;
    #lives = 0;
    #isHit = false;
    #invicivibilityTimer = 120;

    //mouvement variables
    #x_v = 0;
    #y_v = 0;
    #jump = true;
    #predictedX = 0;
    #predictedY = 0;

    //origin variables
    #origin_x = 64;
    #origin_y = 64;

    //image variables
    #spriteSheetWidth = 32;
    #spriteSheetHeight = 32;
   
    
    //technical variables
    #hitAnimationCounter = 0;
    #preventMovement = false;
    #preventMovementTimer = 15;

    //statistic variables
    #score = 0;
    #numberOfEnnemieskilled = 0;
    #numberOfHeartsCollected = 0;
    #numberOfCoinsCollected = 0;
    #numberOfDeaths = 0;
    #numberOfLevelCompleted = 0;
    #totalDamageTaken = 0;

    constructor(x, y, width, height, texturepath, origin_x, origin_y, lives,maxHealth, speed, damage) {
        super(x, y, width, height, texturepath, speed, damage);
        this.#origin_x = origin_x;
        this.#origin_y = origin_y;
        this.#lives = lives;
        this.#maxHealth = maxHealth;
        this.#currenthealth = maxHealth;
    }

    /**
     * Update the player position beetwen 2 level
     * @param {*} x new x position
     * @param {*} y new y position
     * @param {*} origin_x new origin x position
     * @param {*} origin_y new origin y position
     */
    update(x, y, origin_x, origin_y) {
        this.x = x;
        this.y = y;
        this.#origin_x = origin_x;
        this.#origin_y = origin_y;
        this.#isHit = false;
        this.#invicivibilityTimer = 120;
        this.#preventMovement = false;
        this.#preventMovementTimer = 15;

    }

    // #region getters and setters
    get lives() {
        return this.#lives;
    }

    set lives(value) {
        this.#lives = value;
        if(this.#lives > 8){
            this.#lives = 8;
        }
    }
    get currenthealth() {
        return this.#currenthealth;
    }
    set currenthealth(value) {
        this.#currenthealth = value;
    }

    get maxHealth() {
        return this.#maxHealth;
    }

    set maxHealth(value) {
        this.#maxHealth = value;
    }

    get score() {
        return this.#score;
    }

    set score(value) {
        this.#score = value;
    }

    get x_v() {
        return this.#x_v;
    }

    set x_v(value) {
        this.#x_v = value;
    }

    get y_v() {
        return this.#y_v;
    }

    set y_v(value) {
        this.#y_v = value;
    }

    get origin_x() {
        return this.#origin_x;
    }

    set origin_x(value) {
        this.#origin_x = value;
    }

    get origin_y() {
        return this.#origin_y;
    }

    set origin_y(value) {
        this.#origin_y = value;
    }

    get jump() {
        return this.#jump;
    }

    set jump(value) {
        this.#jump = value;
    }

    get spriteSheetWidth() {
        return this.#spriteSheetWidth;
    }

    set spriteSheetWidth(value) {
        this.#spriteSheetWidth = value;
    }

    get spriteSheetHeight() {
        return this.#spriteSheetHeight;
    }

    set predictedX(value) {
        this.#predictedX = value;
    }

    get predictedX() {
        return this.#predictedX;
    }

    set predictedY(value) {
        this.#predictedY = value;
    }

    get predictedY() {
        return this.#predictedY;
    }

    get isHit() {
        return this.#isHit;
    }

    set isHit(value) {
        this.#isHit = value;
    }

    get preventMovement() {
        return this.#preventMovement;
    } 

    get numberOfEnnemieskilled() {
        return this.#numberOfEnnemieskilled;
    }

    get numberOfHeartsCollected() {
        return this.#numberOfHeartsCollected;
    }

    get numberOfCoinsCollected() {
        return this.#numberOfCoinsCollected;
    }

    get numberOfDeaths() {
        return this.#numberOfDeaths;
    }

    get numberOfLevelCompleted() {
        return this.#numberOfLevelCompleted;
    }

    get totalDamageTaken() {
        return this.#totalDamageTaken;
    }
    
    // #endregion

    // #region statistic methods
    addEnnemykilled() {
        this.#numberOfEnnemieskilled++;
    }

    addHeartCollected() {
        this.#numberOfHeartsCollected++;
    }

    addCoinCollected() {
        this.#numberOfCoinsCollected++;
    }

    addDeath() {
        this.#numberOfDeaths++;
    }

    addLevelCompleted() {
        this.#numberOfLevelCompleted++;
    }

    addDamageTaken(value) {
        this.#totalDamageTaken += value;
    }

    // #endregion

    // #region life methods

    takeDamage(value) {
        if(value > 0){
            this.addDamageTaken(value);
            if(this.#currenthealth - value > 0){
                this.#currenthealth -= value;
            }else{
                this.dead();
            }
        }
    }

    dead(){
        this.#lives -= 1;
        this.addDeath();
        if(this.#lives > 0){
            this.respawn();
        }
    }

    isDead(){
        return this.#currenthealth <= 0;
    }

    respawn(){
        this.#currenthealth = this.#maxHealth;
        this.x = this.#origin_x;
        this.y = this.#origin_y;
        this.predictedX = this.#origin_x;
        this.predictedY = this.#origin_y;
        this.y_v = 0;
        this.x_v = 0;

        this.debug ? console.log("respawn number of life left : "+this.lives) : null;
    }

    ifLifeRemains(){
        return this.#lives > 0;
    }


    // #endregion

    // #region collision methods
    getTrampleBoxLeft(predicted = false){
        if (predicted){
            return this.predictedX - this.width + this.width/4
        } else {
            return this.x - this.width + this.width/4
        }
    }

    getTrampleBoxRight(predicted = false) {
        if (predicted) {
            return this.predictedX - this.width/4
        } else {
            return this.x - this.width/4
        }
    }
    // #endregion

    render(ctx,keys) {
        // src https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
        // was for the original idea of animation, but we adapted it.
        if (this.debug) {
            ctx.fillStyle = "rgba(0,255,255,0.5)";
            ctx.fillRect(this.x - this.width, this.y - this.height, this.width, this.height)
            ctx.fillStyle = "rgba(255,255,0,0.5)";
            ctx.fillRect(this.x - this.width + this.width / 4, this.y - this.height, this.width - this.width / 2, this.height)
        }

        // direction
        let spriteDirectionOffset;
        if (this.x_v < 0) {
            spriteDirectionOffset = this.width;
        } else {
            spriteDirectionOffset = 0;
        }

        // if the player is hit, invicibility frames
        let hitSpriteOffset = 0;

        if (this.isHit) {
            // Gérez l'animation du joueur touché ici
            hitSpriteOffset = this.width * 2; // Utilisez le deuxième sprite pour le joueur touché
            // Utilisez un compteur pour alterner entre les images
            if (this.#hitAnimationCounter % 20 < 10) {
                hitSpriteOffset = 0; // Utilisez le premier sprite pour la première image
            }
            this.#hitAnimationCounter++;
        } else {
            this.#hitAnimationCounter = 0;
        }

        // animation
        let animationOffset = 0;
        if (this.jump) {
            if (this.y_v > 0) {
                //falling
                animationOffset = this.width * 5;
            } else {
                //jumping
                animationOffset = this.width * 4;
            }
        } else if (keys.left || keys.right) {
            // movement
            this.counter++;
            if (this.counter === 4) {
                this.counter = 0;
                this.timer++;
                if (this.timer === 4) {
                    this.timer = 0;
                }
            }
            animationOffset = this.timer * 32;
        } else {
            this.counter = 0;
            this.timer = 0;
        }
        
        ctx.drawImage(
            this.texture,
            spriteDirectionOffset + hitSpriteOffset,  //sprite sheet offset x
            animationOffset,  //sprite sheet offset y
            this.#spriteSheetWidth, //sprite sheet w
            this.#spriteSheetHeight, //sprite sheet h
            this.x - this.height,
            this.y - this.height,
            this.width,
            this.height
        );

        if (this.debug) {
            ctx.fillStyle = "#000";
            ctx.fillRect(this.x, this.y, -8, -8);
        }
    }


    hit(damage = 1){
        this.takeDamage(damage);
        this.debug ? console.log("current helth of the player: " +this.#currenthealth) : null;
        if(!this.isHit){
            this.#invicivibilityTimer = 0;
            this.isHit = true;
            // TODO: lose health
        }
        this.#preventMovement = true;
        this.#preventMovementTimer = 0;
        this.debug ? console.log("hit") : null;
    }

    invicibilityFrames(){
        this.#invicivibilityTimer++;
        if(this.#invicivibilityTimer === 120){
            this.isHit = false;
            this.debug ? console.log("invicibility over") : null;
        }
    }

    preventMovementFrames(){
        this.#preventMovementTimer++;
        if(this.#preventMovementTimer === 15){
            this.#preventMovement = false;
        }
    }
}

export default Player;