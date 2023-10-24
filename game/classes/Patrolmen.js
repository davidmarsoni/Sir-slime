import Entity from "./Entity.js";
class Patrolmen extends Entity{
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

    render(ctx,spriteDirectionOffset) {
      if(this.debug){
        ctx.fillStyle = "#432243"
        ctx.fillRect(this.x - this.width,this.y - this.height,this.width,this.height)
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
       
        

    }

    checkPatrolmanCollision(player) {
      // Calculez les bords du joueur et du patrolman
      const playerLeft = player.x;
      const playerRight = player.x + player.width;
      const playerTop = player.y;
      const playerBottom = player.y + player.height;
  
      const patrolmanLeft = this.x;
      const patrolmanRight = this.x + this.width;
      const patrolmanTop = this.y;
      const patrolmanBottom = this.y + this.height;
  
  
  
      // Vérifiez s'il y a une collision entre le joueur et le patrolman
      if (
          playerRight > patrolmanLeft &&
          playerLeft < patrolmanRight &&
          playerBottom > patrolmanTop &&
          playerTop < patrolmanBottom
      ) {
          // Collision détectée, faites reculer le joueur dans la direction du patrolman
          /*if (patrolman.direction && player.x > patrolman.x && !player.jump) {
              
              player.x = patrolmanRight;
          } else if (patrolman.direction && player.x < patrolman.x && !player.jump) {
              
              player.x = patrolmanLeft-player.width;
          }
          else if (!patrolman.direction && player.x > patrolman.x  && !player.jump) {
              
              player.x = patrolmanRight;
          } else if (!patrolman.direction && player.x < patrolman.x  && !player.jump) {
              
              player.x = patrolmanLeft-player.width;*/
  
          if(player.x > this.x && !player.jump && !player.isHit){
              player.x_v = 5;
              player.y_v = -3;
              //player.y = patrolmanTop - player.height+5;
              player.jump = true;
              player.isHit = true;
              keys.left = false;
              keys.right = false;
          }
          else if(player.x < this.x && !player.jump && !player.isHit){
              player.x_v = -5;
              player.y_v = -3;
              //player.y = patrolmanTop - player.height+5;
              player.jump = true;
             player.isHit = true;
             keys.right = false;
             keys.left = false;
          }
          
          
          else if (player.y < this.y && player.jump) {
              const verticalDistance = patrolmanTop - playerBottom;
              player.y = patrolmanTop - player.height;
                  player.jump = false;
      
              // Vérifiez si la distance verticale est suffisamment grande pour permettre au joueur de tomber
              if (verticalDistance >= 10) { // Ajustez la valeur (10) en fonction de vos besoins
                  player.jump = true;
              }
          }
          
  
      }
  
      
  }



  }

  export default Patrolmen;

