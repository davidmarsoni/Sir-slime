import Platform from './Platform.js';

class MovablePlatform extends Platform{
    #isInPath = false;
 
    #path; // 2 cordonates: {50,50},{100,100} or 1 cordonate: {50,50}
    #speed;

    #currentXspeed;
    #currentYspeed;
    
    constructor(path,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight,speed) {
        super(0,0,width,height,texturepath,spriteSheetOffsetX,spriteSheetOffsetY,spriteSheetWidth,spriteSheetHeight);
        this.isAnimated = false;
        this.#path = path;
        this.#speed = speed;
        this.init();
    }

    init(){
        //set the origin of the platform
        this.x = this.path[0].x;
        this.y = this.path[0].y;
    }

    move() {
        //check if the platform is on the path if not move it to the path
        if(this.#isInPath === false){
            this.x = this.#path[0].x;
            this.y = this.#path[0].y;
            this.#isInPath = true;
        }
        if (this.#path) {
            // Calculate new x and y based on speed and path
            let deltaX = this.#path[1].x - this.#path[0].x;
            let deltaY = this.#path[1].y - this.#path[0].y;
    
            let length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            let unitX = deltaX / length;
            let unitY = deltaY / length;
            
            
            this.#currentXspeed = unitX * this.#speed; // pas encore fait un speed pour le x
            this.#currentYspeed = unitY * this.#speed;
            this.x += this.#currentXspeed;
            this.y += this.#currentYspeed;
            
            //this.x = Math.round(this.x);
            // Check if the platform has reached the end of the path
            if (Math.abs(this.x - this.#path[1].x) < this.#speed && Math.abs(this.y - this.#path[1].y) < this.#speed) {
                // Swap path start and end
                this.#path.reverse();
            }
        }
    }

    get path() { return this.#path; }
    set path(value) { this.#path = value; }

    get speed() { return this.#speed; }
    set speed(value) { this.#speed = value; }

    debugRender(ctx) {
        super.debugRender(ctx);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(this.#path[0].x, this.#path[0].y, 8, 8);
        ctx.fillRect(this.#path[1].x, this.#path[1].y, 8, 8);
        //draw the path
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,0,255,0.5)";
        ctx.lineWidth = 4;
        ctx.moveTo(this.#path[0].x+4, this.#path[0].y+4);
        ctx.lineTo(this.#path[1].x+4, this.#path[1].y+4);
        ctx.stroke();
        ctx.lineWidth = 1;
        //print the x and y of the platform
        /*ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("x: " + this.x, this.x, this.y - 10);
        ctx.fillText("y: " + this.y, this.x, this.y - 20);*/
    }

    collide(player) {
        // Predictive X collision
        if (player.predictedX > this.x && player.predictedX - player.width < this.x + this.width) {
            // Predictive Y collision
            // [platform.y+3;platform.y+1] -> 1. tolerance for clip (define if goes through) | 2. hitbox
            if (player.y <= this.y + this.#speed*3 && player.predictedY >= this.y + this.#speed*1) {
                this.debug && console.log("on the platform");
                // If the player was above the platform and now is within it vertically
                player.predictedY = this.y + 1;
                player.jump = false;
                player.relativeXoffset = this.#currentXspeed;
                player.isTransported = true;
            }
        }
    }
}


export default MovablePlatform;