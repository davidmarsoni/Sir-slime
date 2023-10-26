import Entity from "./Entity.js";
import Weapon from "./Weapon.js";

class Player extends Entity{
    #weapon = new Weapon();
    #health = 0;
    #maxHealth = 0;
    #speed = 0;
    #x_v = 0;
    #y_v = 0;
    #origin_x = 64;
    #origin_y = 64;
    #jump = true;
    #spriteSheetWidth = 32;
    #spriteSheetHeight = 32;
    #predictedX = 0;
    #predictedY = 0;
    #isHit = false;
    #invicivibilityTimer = 120;
    #hitAnimationCounter = 0;
    #preventMovement = false;
    #preventMovementTimer = 15;

    constructor(x, y, width, height, texturepath, origin_x, origin_y, weapon, health, maxHealth, speed) {
        super(x, y, width, height, texturepath);
        this.#origin_x = origin_x;
        this.#origin_y = origin_y;
        this.#weapon = weapon;
        this.#health = health;
        this.#maxHealth = maxHealth;
        this.#speed = speed;
    }

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

    get weapon() {
        return this.#weapon;
    }

    set weapon(value) {
        this.#weapon = value;
    }

    get health() {
        return this.#health;
    }

    set health(value) {
        this.#health = value;
    }

    get maxHealth() {
        return this.#maxHealth;
    }

    set maxHealth(value) {
        this.#maxHealth = value;
    }

    get speed() {
        return this.#speed;
    }

    set speed(value) {
        this.#speed = value;
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

    render(ctx,keys) {
        // src https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
        // was for the original idea of animation, but we adapted it.
        if (this.debug) {
            ctx.fillStyle = "rgba(0,243,255,0.25)";
            ctx.fillRect(this.x - this.width, this.y - this.height, this.width, this.height)
            ctx.fillStyle = "rgba(255,236,0,0.25)";
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


    hit(){
        if(!this.isHit){
            this.#invicivibilityTimer = 0;
            this.isHit = true;
            // TODO: lose health
        }
        this.#preventMovement = true;
        this.#preventMovementTimer = 0;
        console.log("hit")
    }

    invicibilityFrames(){
        this.#invicivibilityTimer++;
        if(this.#invicivibilityTimer === 120){
            this.isHit = false;
            console.log("invicibility over")
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