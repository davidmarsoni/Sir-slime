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
    #spriteSheetHeight = 32;0

    constructor(x, y, width, height, texturepath, weapon, health, maxHealth, speed) {
        super(x, y, width, height, texturepath);
        this.#weapon = weapon;
        this.#health = health;
        this.#maxHealth = maxHealth;
        this.#speed = speed;
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

    render(ctx,spriteDirectionOffset,animationOffset) {
        if(this.debug)
        {
            ctx.fillStyle = "lightblue";
            ctx.fillRect(this.x - this.width, this.y - this.height, this.width, this.height)
        }

        ctx.drawImage(
            this.texture,
            spriteDirectionOffset,  //sprite sheet offset x
            animationOffset,  //sprite sheet offset y
            this.#spriteSheetWidth, //sprite sheet w
            this.#spriteSheetHeight, //sprite sheet h
            this.x - this.height,
            this.y - this.height,
            this.width,
            this.height
        );
    }
}

export default Player;