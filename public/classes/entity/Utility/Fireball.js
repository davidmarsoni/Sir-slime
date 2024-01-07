import Entity from "../Entity.js";

class Fireball extends Entity {

   #effective = false;
   #x_v = 0;
   #y_v = 0;
   #animTimer = 0;
   #animStep = 1;

   constructor(x, y, width, height, texturepath, speed, damage) {
      super(x, y, width, height, texturepath, speed, damage);
   }

   get effective() { return this.#effective; }
   set effective(value) { this.#effective = value; }
   get x_v() { return this.#x_v; }
   set x_v(value) { this.#x_v = value; }
   get y_v() { return this.#y_v; }
   set y_v(value) { this.#y_v = value; }

   render(ctx) {
      this.#animTimer++;
      if (this.#animTimer === 6) {
         this.#animStep++;
      }
      if (this.#animTimer === 12) {
         this.#animStep = 0;
         this.#animTimer = 0;
      }

      if (this.#effective) {
         if (this.textureLoaded === true) {
            ctx.drawImage(
               this.texture,  // Sprite
               this.spriteDirectionOffset,  // Sprite sheet offset x
               this.width * this.#animStep,  // Sprite sheet offset y
               24, // Sprite sheet h
               24,
               this.x - this.width,
               this.y - this.height,
               this.width,
               this.height
            )
         } else {
            this.debug = true;
         }
      }
   }

   throw(player) {
      this.debug && console.log(player.cooldown, player.cooldownTime);

      if (!player.cooldown) {
         // Action (throwing a fireball) is allowed
         // ... (insert action code here)
         this.#effective = true;
         this.x = player.x;
         this.y = player.y;

         if (player.x_v < 0) {
            this.spriteDirectionOffset = 24;
            this.#x_v = -this.speed;
         }
         else if (player.x_v > 0) {
            this.spriteDirectionOffset = 0;
            this.#x_v = this.speed;
         }
         else {
            this.spriteDirectionOffset = 0;
            this.#x_v = this.speed;
         }

         // Set cooldown
         player.cooldown = true;
         setTimeout(() => {
            player.cooldown = false;
         }, player.cooldownTime);
      } else {
         // Action is not allowed because cooldown is active
         this.debug && console.log("Action not allowed, cooldown is active.");
      }
   }

   move() {
      //console.log(player.cooldown);
      if (this.#effective) {
         this.x += this.#x_v;
      }
   }

   collide(player, collisionblocks, bats, patrolmen) {
      let collide = false;
      // Check for collision with each bat
      for (const bat of bats) {
         if (
            this.x < bat.x + bat.width &&
            this.x + this.width > bat.x &&
            this.y < bat.y + bat.height &&
            this.y + this.height > bat.y &&
            this.#effective
         ) {
            player.addDamageDealt(this.damage);
            player.addEnemykilled();
            player.score += 500;
            bat.isAlive = false;
            this.#effective = false;
            this.debug && console.log("collision avec bat");
            bat.playSound && bat.deathSound != null && bat.deathSound.play();
            collide = true;
         }
      }

      // Check for collision with each patrolman
      for (const patrolman of patrolmen) {
         if (
            this.x + this.width / 2 - 5 < patrolman.x + patrolman.width &&
            this.x + this.width + this.width / 2 - 5 > patrolman.x &&
            this.y < patrolman.y + patrolman.height &&
            this.y + this.height > patrolman.y &&
            this.#effective
         ) {
            this.x = -100;
            this.y = -100;
            this.#effective = false;
            this.debug && console.log("collision avec patrolman");
            collide = true;
         }
      }

      // Check for collision with each collisionblock
      for (const collisionblock of collisionblocks) {
         if (
            this.x - 30 < collisionblock.x + collisionblock.width &&
            this.x + this.width - 30 > collisionblock.x &&
            this.y - 30 < collisionblock.y + collisionblock.height &&
            this.y + this.height - 30 > collisionblock.y &&
            this.#effective
         ) {
            this.#effective = false;
            this.debug && console.log("collision avec bloc");
            collide = true;
         }
      }
      return collide;
   }

   static removeFireball(ArrayOfFireballs, indexPos, num = 1) {
      ArrayOfFireballs.splice(indexPos, num);
      this.debug && console.log("fireball destroyed : " + i);
   }
}

export default Fireball;