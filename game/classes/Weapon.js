import Item from "./Item.js";

class Weapon extends Item{
    #damage = 0;
    #range = 0;
    #attackSpeed = 0;
    #attackCooldown = 0;
    
    constructor(width, height, texturepath, damage, range, attackSpeed) {
        super(0, 0, width, height, texturepath);
        this.#damage = damage;
        this.#range = range;
        this.#attackSpeed = attackSpeed;
    }

    get damage() {
        return this.#damage;
    }

    set damage(value) {
        this.#damage = value;
    }

    get range() {
        return this.#range;
    }

    set range(value) {
        this.#range = value;
    }

    get attackSpeed() {
        return this.#attackSpeed;
    }

    set attackSpeed(value) {
        this.#attackSpeed = value;
    }

    get attackCooldown() {
        return this.#attackCooldown;
    }

    set attackCooldown(value) {
        this.#attackCooldown = value;
    }

    render(ctx,player,spriteDirectionOffset){
        ctx.drawImage(
            this.texture,
            spriteDirectionOffset,  //sprite sheet offset x
            0,  //sprite sheet offset y
            32, //sprite sheet w
            32, //sprite sheet h
            player.x - (spriteDirectionOffset*2),
            player.y - player.height,
            player.width,
            player.height
        );
    }

}

export default Weapon;