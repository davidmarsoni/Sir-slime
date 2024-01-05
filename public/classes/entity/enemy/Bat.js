import Enemy from "./Enemy.js";
import GameObjectLogic from "../../GameObjectLogic.js";
class Bat extends Enemy {
   #origin_x = 64;
   #origin_y = 64;
   #direction = true;
   #animStep = 1;
   #animTimer = 0;
   #isIdle = true;
   #triggerZone;
   #x_v = 0;
   #y_v = -4;
   static VELOCITY_INCREMENTATION = [0.05, -0.05];
   static DEFAULT_VELOCITY = [2, -2]
   #chosenSide = 0;
   #triggeredMode = false;
   #isTriggered = false;
   #triggerZoneFollow = false;
   #triggerZoneWidth;
   #triggerZoneHeight;

   constructor(x, y, width, height, texturepath, speed, damage, hitSound, deathSound, origin_x, origin_y, triggerZoneWidth, triggerZoneHeight, triggerZoneX, triggerZoneY, triggeredMode = false, triggerZoneFollow = false) {
      super(x, y, width, height, texturepath, speed, damage, hitSound, deathSound);
      this.#origin_x = origin_x;
      this.#origin_y = origin_y;
      this.#triggeredMode = triggeredMode;
      this.#triggerZoneWidth = triggerZoneWidth;
      this.#triggerZoneHeight = triggerZoneHeight;
      this.triggerZoneFollow = triggerZoneFollow;
      if (triggerZoneX === null || triggerZoneX === undefined) {
         this.updateTriggerZone();
      }
      else {
         this.#triggerZone = new GameObjectLogic(triggerZoneX, triggerZoneY, triggerZoneWidth, triggerZoneHeight);
      }
   }


   updateTriggerZone() {
      let tmpTriggerZoneX = this.minX - this.#triggerZoneWidth;
      let tmpTriggerZoneY = this.minY - this.#triggerZoneHeight;
      let tmpTriggerZoneWidth = this.#triggerZoneWidth * 2 + this.width;
      let tmpTriggerZoneHeight = this.#triggerZoneHeight * 2 + this.height;

      this.#triggerZone = new GameObjectLogic(tmpTriggerZoneX, tmpTriggerZoneY, tmpTriggerZoneWidth, tmpTriggerZoneHeight);
   }

   get animTimer() { return this.#animTimer; }
   set animTimer(value) { this.#animTimer = value; }
   get animStep() { return this.#animStep; }
   set animStep(value) { this.#animStep = value; }
   get direction() { return this.#direction; }
   set direction(value) { this.#direction = value; }
   get origin_x() { return this.#origin_x; }
   set origin_x(value) { this.#origin_x = value; }
   get origin_y() { return this.#origin_y; }
   set origin_y(value) { this.#origin_y = value; }
   get isIdle() { return this.#isIdle; }
   set isIdle(value) { this.#isIdle = value; }
   get triggeredMode() { return this.#triggeredMode; }
   set triggeredMode(value) { this.#triggeredMode = value; }
   get isTriggered() { return this.#isTriggered; }
   set isTriggered(value) { this.#isTriggered = value; }
   get triggerZone() { return this.#triggerZone; }
   set triggerZone(value) { this.#triggerZone = value; }
   get triggerZoneFollow() { return this.#triggerZoneFollow; }
   set triggerZoneFollow(value) { this.#triggerZoneFollow = value; }

   getTrampleBoxLeft() {
      return this.x - this.width + this.width / 4;
   }

   getTrampleBoxRight() {
      return this.x - this.width / 4;
   }

   render(ctx) {
      if (this.isRendered === false) {
         return;
      }
      if (this.isAlive === true) {
         //show the trigger zone boder in ligh red but realy thin and transparent
         if (this.#isTriggered === false) {
            ctx.fillStyle = "rgba(180,56,45,0.10)"
            ctx.fillRect(this.#triggerZone.x, this.#triggerZone.y, this.#triggerZone.width, this.#triggerZone.height);
            ctx.strokeStyle = "rgba(180,56,45,0.10)";
            ctx.strokeRect(this.#triggerZone.x, this.#triggerZone.y, this.#triggerZone.width, this.#triggerZone.height);
         }
      }

      if (this.debug) {
         ctx.fillStyle = "rgba(180,56,45,0.15)"
         ctx.fillRect(this.x - this.width, this.y - this.height, this.width, this.height);
         ctx.fillStyle = "rgba(169,208,72,0.25)"
         ctx.fillRect(this.x - this.width + this.width / 4, this.y - this.height, this.width / 2, this.height);
         //selon le mode de la chauve-souris, on affiche la zone de trigger ou le trigerArea
         ctx.fillStyle = "rgba(169,208,72,0.25)"

         if (this.isAlive === true) {
            ctx.fillStyle = "rgba(255,0,0,0.25)"
            ctx.fillRect(this.#triggerZone.x, this.#triggerZone.y, this.#triggerZone.width, this.#triggerZone.height);
            //add a border in dark red
            ctx.strokeStyle = "rgba(180,56,45,0.75)";
            ctx.strokeRect(this.#triggerZone.x, this.#triggerZone.y, this.#triggerZone.width, this.#triggerZone.height);
         }
      }

      let spriteDirectionOffset;

      if (this.#isIdle) {
         this.animStep = 0;
         spriteDirectionOffset = 0;

      }
      else {
         if (this.#direction) {
            spriteDirectionOffset = 0;
         } else {
            spriteDirectionOffset = 32;
         }
         this.animTimer++;

         if (this.animTimer % 4 === 0) {
            this.animStep++;
            if (this.animTimer === 12) {
               this.animStep = 1;
               this.animTimer = 0;
            }
         }
         if (this.isAlive === false) {
            this.animStep = 4;
         }
      }
      if (this.textureLoaded === true) {
         ctx.drawImage(
            this.texture,  // Sprite
            spriteDirectionOffset,  // Sprite sheet offset x
            this.width * this.animStep,  // Sprite sheet offset y
            this.width, // Sprite sheet w
            this.height, // Sprite sheet h
            this.x - this.width,
            this.y - this.height,
            this.width,
            this.height
         )
      } else {
         this.debug = true;
      }

      if (this.debug) {
         ctx.fillStyle = "#000";
         ctx.fillRect(this.x, this.y, -8, -8);
      }
   }

   move(player) {
      let deltaX;
      let deltaY;

      if (this.#triggeredMode === true) {
         //si dans le périmètre de trigger
         if (player.InAPerimeter(this.#triggerZone)) {
            this.debug && console.log("triggered");
            this.isTriggered = true;
         }
         if (this.isTriggered === true) {
            this.#isIdle = false;
            deltaX = player.x - this.x;
            deltaY = player.y - this.y;
         }
      }
      else {
         if (player.InAPerimeter(this.#triggerZone)) {
            this.#isIdle = false;
            deltaX = player.x - this.x;
            deltaY = player.y - this.y;
            this.#triggerZoneFollow && this.updateTriggerZone();
         }
      }

      // Calculer la distance entre la chauve-souris et le personnage
      const space = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // Vérifier si la chauve-souris est suffisamment éloignée du personnage
      if (space > 10) { // Vous pouvez ajuster la distance minimale
         // Calculer la direction de la poursuite
         const directionX = deltaX / space;
         const directionY = deltaY / space;

         // Mettre à jour la position de la chauve-souris en fonction de la direction et de la vitesse
         this.x += directionX * this.speed;
         this.y += directionY * this.speed;
      }


      if (this.isAlive === false) {
         this.#x_v += Bat.VELOCITY_INCREMENTATION[this.#chosenSide];
         this.#y_v += 0.7;

         this.x = this.x + this.#x_v;
         this.y = this.y + this.#y_v;
      }
   }

   collide(player) {

      const playerLeft = player.predictedX;
      const playerRight = player.predictedX + player.width;
      const playerTop = player.predictedY;
      const playerBottom = player.predictedY + player.height;

      const batLeft = this.x;
      const batRight = this.x + this.width;
      const batTop = this.y;
      const batBottom = this.y + this.height;

      if (
         playerRight >= batLeft &&
         playerLeft <= batRight &&
         playerBottom >= batTop &&
         playerTop <= batBottom
      ) {
         if (player.y <= this.y
            && player.predictedY <= this.y
            && (
               player.getTrampleBoxLeft(true) <= this.getTrampleBoxRight()
               || player.getTrampleBoxRight(true) >= this.getTrampleBoxLeft()
            ) && player.y_v > 0 && this.isAlive === true
         ) {
            this.debug && console.log("trample");
            player.y_v = -7;
            this.#chosenSide = Math.round(Math.random());
            this.#x_v = Bat.DEFAULT_VELOCITY[this.#chosenSide];
            player.score += 500;
            player.addEnemykilled();
            player.addDamageDealt(1);

            this.playSound && this.deathSound != null && this.deathSound.play();
            this.isAlive = false;
         }


         else if (player.x <= this.x && !player.isHit && this.isAlive === true) {
            this.debug && console.log("left");
            player.x_v = -4;
            player.y_v = -3;
            player.predictedX = this.x - this.width + player.x_v;
            player.jump = true;
            player.hit(this.damage, true, this.hitSound);
         }
         // Push the player right
         else if (player.x >= this.x && !player.isHit && this.isAlive === true) {
            this.debug && console.log("right");
            player.x_v = 4;
            player.y_v = -3;
            player.predictedX = this.x + player.width + player.x_v;
            player.jump = true;
            player.hit(this.damage, true, this.hitSound);
         }
      }
   }
}

export default Bat;

