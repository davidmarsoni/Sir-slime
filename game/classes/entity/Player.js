import Entity from "./Entity.js";

class Player extends Entity{
    // life variables
    #maxPossibleHealth = 8;
    #maxPossibleLives = 10;

    #maxHealth = 0;
    #currenthealth = 0;
    #maxLives = 0;
    #currentlives = 0;

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
    #numberOfEnemieskilled = 0;
    #numberOfHeartsCollected = 0;
    #numberOfCoinsCollected = 0;
    #numberOfDeaths = 0;
    #numberOfLevelCompleted = 0;
    #totalDamageTaken = 0;
    #totalDamageDealt = 0;
    #totalheal = 0;

    //sound
    #walkSound = null;
    #deadSound = null;


    constructor(x, y, width, height, texturepath, origin_x, origin_y, maxLives,maxPossibleLives,maxHealth,maxPossibleHealth, speed, damage,walkSoundPath,deadSounPath) {
        super(x, y, width, height, texturepath, speed, damage);
        this.#origin_x = origin_x;
        this.#origin_y = origin_y;
        this.#maxPossibleLives = maxPossibleLives;
        this.#maxLives = maxLives;
        this.#currentlives = this.maxLives;
        this.#maxPossibleHealth = maxPossibleHealth;
        this.#maxHealth = maxHealth;
        this.#currenthealth = this.maxHealth;
        this.#walkSound = new Audio(walkSoundPath);
        this.#walkSound.volume = 0.5;
        this.#walkSound.onerror = () => {
            console.log("Error loading walk sound");
            this.#walkSound = null;
        };

        this.#deadSound = new Audio(deadSounPath);
        this.#deadSound.volume = 0.5;
        this.#deadSound.onerror = () => {
            console.log("Error loading dead sound");
            this.#deadSound = null;
};
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
    get maxPossibleHealth(){return this.#maxPossibleHealth;}
    get maxPossibleLives(){return this.#maxPossibleLives;}

    get maxHealth(){return this.#maxHealth;}
    get health(){return this.#currenthealth;}
    get maxLives(){return this.#maxLives;}
    get lives(){return this.#currentlives;}

    get isHit(){return this.#isHit;}
    set isHit(value){this.#isHit = value;}

    get invicivibilityTimer(){return this.#invicivibilityTimer;}
    set invicivibilityTimer(value){this.#invicivibilityTimer = value;}

    get x_v(){return this.#x_v;}
    set x_v(value){this.#x_v = value;}

    get y_v(){return this.#y_v;}
    set y_v(value){this.#y_v = value;}

    get jump(){return this.#jump;}
    set jump(value){this.#jump = value;}

    get predictedX(){return this.#predictedX;}
    set predictedX(value){this.#predictedX = value;}

    get predictedY(){return this.#predictedY;}
    set predictedY(value){this.#predictedY = value;}

    get origin_x(){return this.#origin_x;}
    set origin_x(value){this.#origin_x = value;}

    get origin_y(){return this.#origin_y;}
    set origin_y(value){this.#origin_y = value;}

    get spriteSheetWidth(){return this.#spriteSheetWidth;}
    set spriteSheetWidth(value){this.#spriteSheetWidth = value;}

    get spriteSheetHeight(){return this.#spriteSheetHeight;}
    set spriteSheetHeight(value){this.#spriteSheetHeight = value;}

    get hitAnimationCounter(){return this.#hitAnimationCounter;}
    set hitAnimationCounter(value){this.#hitAnimationCounter = value;}

    get preventMovement(){return this.#preventMovement;}
    set preventMovement(value){this.#preventMovement = value;}
    
    get preventMovementTimer(){return this.#preventMovementTimer;}
    set preventMovementTimer(value){this.#preventMovementTimer = value;}

    get score(){return this.#score;}
    set score(value){this.#score = value;}

    get numberOfEnemieskilled(){return this.#numberOfEnemieskilled;}
    get numberOfHeartsCollected(){return this.#numberOfHeartsCollected;}
    get numberOfCoinsCollected(){return this.#numberOfCoinsCollected;}
    get numberOfDeaths(){return this.#numberOfDeaths;}
    get numberOfLevelCompleted(){return this.#numberOfLevelCompleted;}
    get totalDamageTaken(){return this.#totalDamageTaken;}
    get totalDamageDealt(){return this.#totalDamageDealt;}
    get totalheal(){return this.#totalheal;}
    
    get walkSound(){return this.#walkSound;}
    get deadSound(){return this.#deadSound;}


    // #endregion
    // #region statistic methods
    addEnemykilled() {this.#numberOfEnemieskilled++;}
    addHeartCollected() {this.#numberOfHeartsCollected++;}
    addCoinCollected() {this.#numberOfCoinsCollected++;}
    addDeath() {this.#numberOfDeaths++;}
    addLevelCompleted() {this.#numberOfLevelCompleted++;}
    addDamageTaken(value) {
        if (value > 0) {
            this.#totalDamageTaken += value;
        }
    }
    
    addDamageDealt(value) {
        if (value > 0) {
            this.#totalDamageDealt += value;
        }
    }
    
    addheal(value) {
        if (value > 0) {
            this.#totalheal += value;
        }
    }
    
    addScore(value) {
        if (value > 0) {
            this.#score += value;
        }
    }

    // #endregion

    // #region life methods
    /**
     * Heals the player by a specified value. If no value is provided, heals to max health.
     * @param {number} value - The amount to heal the player. If null, heals to max health.
     */
    heal(value = null){
        if(value === null){
            this.addheal(this.#maxHealth - this.#currenthealth);
            value = this.#maxHealth;
        }
        if(value > 0){
            this.addheal(value);
            this.#currenthealth += value;
            if(this.#currenthealth > this.#maxHealth){
                this.#currenthealth = this.#maxHealth;
            }

            this.debug ? console.log("player has gain:"+value+" health new health: "+this.#currenthealth) : null;
        }
    }

    /**
     * Adds hearts to the player's max health.
     * @param {number} value - The number of hearts to add. By default it is 1 heart (2 health point).
     */
    addHeart(value = 1){
        this.addHeartCollected();
        if(value > 0){
            this.#maxHealth += value*2;
            if(this.#maxHealth > this.#maxPossibleHealth){
                this.#maxHealth = this.#maxPossibleHealth;
            }

            this.debug ? console.log("player has gain:"+value+" heart new max health: "+this.#maxHealth) : null;
        }
    }

    /**
     * Adds lives to the player.
     * @param {number} value - The number of lives to add. By default it is 1.
     */
    addLife(value = 1){
        this.addLevelCompleted();
        if(value > 0){
           
            this.#maxLives += value;
            if(this.#maxLives > this.#maxPossibleLives){
                this.#maxLives = this.#maxPossibleLives;
            }
            this.debug ? console.log("player has gain:"+value+" lives new number of lives: "+this.#maxLives) : null;
        }
    }

    
    /**
     * Reduces the player's health by a specified value.
     * @param {number} value - The amount of damage to inflict on the player.
     */
    takeDamage(value) {
        if(value > 0){
            this.debug ? console.log("player take damage current health: "+this.#currenthealth+" damage taken: "+value+" new health: "+(this.#currenthealth - value)+"") : null;
            this.addDamageTaken(value);
            this.#currenthealth -= value;
            if(this.isDead()){
                this.dead();
            }
        }
    }

    /**
     * Handles the player's death, reducing lives and triggering respawn if lives remain.
     */
    dead(){
        this.addDeath();
        this.#currentlives--;
        this.playSound && this.deadSound != null ? this.deadSound.play() : null;
        if(this.lifeRemains){
            this.debug ? console.log("player is dead, number of life left : "+this.lives) : null;
            this.#currenthealth = this.#maxHealth;
            this.respawn();
        }
    }

    
    /**
     * Checks if the player is dead, i.e., if the current health is less than 1.
     * @returns {boolean} - True if the player is dead, false otherwise.
     */
    isDead(){
        return this.#currenthealth < 1;
    }

    
    /**
     * Respawns the player at the original coordinates and resets velocity.
     */
    respawn(){
        this.x = this.#origin_x;
        this.y = this.#origin_y;
        this.predictedX = this.#origin_x;
        this.predictedY = this.#origin_y;
        this.y_v = 0;
        this.x_v = 0;

        this.debug ? console.log("respawn number of life left : "+this.lives) : null;
    }

    get lifeRemains(){
        return this.lives > 0;
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
        if(this.isRendered === false){
            return;
        }
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
                    this.playSound && this.#walkSound != null ? this.walkSound.play() : null;
                }
            }
            animationOffset = this.timer * 32;
        } else {
            this.counter = 0;
            this.timer = 0;
        }
        if(this.textureLoaded === true){
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
        }else{
            this.debug = true;
        }
        if (this.debug) {
            ctx.fillStyle = "#000";
            ctx.fillRect(this.x, this.y, -8, -8);
            //ctx.fillRect(this.center.x-2, this.center.y-2, 4, 4);
        }
    }

    hit(damage = 1){
        this.debug ? console.log("current helth of the player: " +this.#currenthealth) : null;
       
        if(!this.isHit){
            this.#invicivibilityTimer = 0;
            this.isHit = true;
            this.debug ? console.log("player hit") :null;
            this.takeDamage(damage);
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

    distanceToTheLeft(object){
        //absolute value of the distance between the player and the object
        return Math.abs(this.maxX-object.minX);
    }

    distanceToTheRight(object){
        //absolute value of the distance between the player and the object
        return Math.abs(this.minX-object.maxX);
    }

    distanceToTheTop(object){
        return Math.abs(this.maxY-object.minY);
    }

    distanceToTheBottom(object){
        return Math.abs(this.minY-object.maxY);
    }

    /**
     * Checks if the player is within a specified perimeter of an object.
     * @param {Object} object - The object to check the player's proximity to.
     * @param {number} width - The width of the perimeter around the object.
     * @param {number} height - The height of the perimeter around the object.
     * @returns {boolean} - True if the player is within the perimeter, false otherwise.
     */
    InAPerimeter(object,width,height){ 
        //console.log(this.distanceToTheLeft(object),this.distanceToTheRight(object),this.distanceToTheTop(object),this.distanceToTheBottom(object));
        //console.log(width,height);

       /**
         *  █▯█
         *  █▯█
         *  █▯█
         */

        if(this.distanceToTheLeft(object) <= width && this.distanceToTheTop(object) <= height){
            return true;
        }
        if(this.distanceToTheLeft(object) <= width && this.distanceToTheBottom(object) <= height){
            return true;
        }
        if(this.distanceToTheRight(object) <= width && this.distanceToTheTop(object) <= height){
            return true;
        }
        if(this.distanceToTheRight(object) <= width && this.distanceToTheBottom(object) <= height){
            return true;
        }

        /**
         *  ▯█▯
         *  ▯█▯
         *  ▯█▯
         */

        if(this.maxX >= object.minX && this.minX <= object.maxX && this.maxY >= object.minY-height && this.minY <= object.maxY+height){
            return true;
        }

        return false;
    }

}

export default Player;