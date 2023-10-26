import Entity from "./Entity.js";
class Patrolman extends Entity{
    #origin_x = 64;
    #origin_y = 64;
    #direction = true;
    #animStep = 0;
    #animTimer = 0;
    #path = [];
    #speed = 1;
    #step = 0;

    constructor(x, y, width, height, texturepath, origin_x, origin_y, direction, animStep, animTimer, path, speed, step) {
        super(x, y, width, height, texturepath);
        this.#origin_x = origin_x;
        this.#origin_y = origin_y;
        this.#direction = direction;
        this.#animStep = animStep;
        this.#animTimer = animTimer;
        this.#path = path;
        this.#speed = speed;
        this.#step = step;
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

    getTrampleBoxLeft(){
        return this.x - this.width + this.width/4;
    }

    getTrampleBoxRight(){
        return this.x - this.width/4;
    }

    render(ctx) {
      if(this.debug){
          ctx.fillStyle = "rgba(67,34,67,0.25)"
          ctx.fillRect(this.x - this.width,this.y - this.height,this.width,this.height)
          ctx.fillStyle = "rgba(169,208,72,0.25)"
          ctx.fillRect(this.x - this.width + this.width/4,this.y - this.height,this.width/2,this.height)
      }

      let spriteDirectionOffset;
      if (this.direction) {
          spriteDirectionOffset = 0;
      } else {
          spriteDirectionOffset = 32;
      }
        this.animTimer++;
      if(this.animTimer===4){
          this.animTimer = 0;
          this.animStep++;
          if(this.animStep === 4){
              this.animStep = 0;
          }
      }

      ctx.drawImage(
        this.texture,  // Sprite
        spriteDirectionOffset,  // Sprite sheet offset x
        this.width*this.animStep,  // Sprite sheet offset y
        32, // Sprite sheet w
        32, // Sprite sheet h
        this.x - this.width,
        this.y - this.height,
        this.width,
        this.height
      );

        if (this.debug) {
            ctx.fillStyle = "#000";
            ctx.fillRect(this.x, this.y, -8, -8);
        }
    }

    collide(player) {
      // Calculate the sides of the player and patrolman
      const playerLeft = player.predictedX;
      const playerRight = player.predictedX + player.width;
      const playerTop = player.predictedY;
      const playerBottom = player.predictedY + player.height;
  
      const patrolmanLeft = this.x;
      const patrolmanRight = this.x + this.width;
      const patrolmanTop = this.y;
      const patrolmanBottom = this.y + this.height;

      // Check if the player and patrolman are colliding
      if (
          playerRight >= patrolmanLeft &&
          playerLeft <= patrolmanRight &&
          playerBottom >= patrolmanTop &&
          playerTop <= patrolmanBottom
      ) {
          console.log("collision");
          if (player.y <= this.y+3
              && player.predictedY <= this.y
              && (
                  player.getTrampleBoxLeft(true) <= this.getTrampleBoxRight()
                  || player.getTrampleBoxRight(true) >= this.getTrampleBoxLeft()
              ) && player.y_v > 0
          ) {
              console.log("trample");
              // Destroy the enemy
          }
          // Push the player left
          else if(player.x <= this.x){
              console.log("left")
              player.x_v = -5;
              player.y_v = -3;
              player.predictedX = this.x - this.width + player.x_v;
              player.jump = true;
              player.hit();
          }
          // Push the player right
          else if(player.x >= this.x){
              console.log("right")
              player.x_v = 5;
              player.y_v = -3;
              player.predictedX = this.x + player.width + player.x_v;
              player.jump = true;
              player.hit();
          } else {
              console.log("an error in collision was made, oops !!");
          }
      }
    }

    // move the patrolman
    move() {
        if (this.x < this.path[this.step]) {
            this.x += this.speed;
            this.direction = true;

        } else {
            this.x -= this.speed;
            this.direction = false;
        }
        if (this.x === this.path[this.step]) {
            this.step++;
            if (this.step >= this.path.length) {
                this.step = 0;
            }
        }
    }



  }

  export default Patrolman;

