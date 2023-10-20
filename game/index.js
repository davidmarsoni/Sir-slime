// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript
import Render from "./render.js";

const render = new Render();

// The player character
var player = {
    x: 64,
    y: 450,
    x_v: 0,
    y_v: 0,
    origin_x: 64,
    origin_y: 450,
    jump : true,
    height: 32,
    width: 32,
};
var playerWeapon = {
    x: 0,
    y: -30,
    width: 24,
    height: 24
}
// The status of the arrow keys
var keys = {
    right: false,
    left: false,
    up: false,
    attack: false
};
// The friction and gravity to show realistic movements
var gravity = 0.6;
var friction = 0.7;
var goalAchieved = false;

// The objects
var lvlend = {
    x: 1450,
    y: 100,
    width: 150,
    height: 100
};
var platforms = [];
var patrolmen = [];
var collisionBlocks = [];

// Function to create collision blocks
function createcollisionBlocks(){
    collisionBlocks.push(
        {
            x: 0,
            y: 500,
            width: 175,
            height: 800,
            collisionSide: 0
        }, {
            x: 600,
            y: 500,
            width: 225,
            height: 800,
            collisionSide: 0
        }, {
            x: 1200,
            y: 200,
            width: 500,
            height: 800,
            collisionSide: 0
        }, {
            x: 1400,
            y: 0,
            width: 200,
            height: 100,
            collisionSide: 3
        }
    )
}

// Function to create platforms
function createplat(){
    platforms.push(
        {
            x: 225,
            y: 450,
            width: 96,
            height: 16
        }, {
            x: 425,
            y: 450,
            width: 96,
            height: 16
        }, {
            x: 875,
            y: 450,
            width: 96,
            height: 16
        }, {
            x: 1050,
            y: 375,
            width: 96,
            height: 16
        }, {
            x: 875,
            y: 325,
            width: 96,
            height: 16
        }, {
            x: 1050,
            y: 250,
            width: 96,
            height: 16
        }
    );
}

function createpatrolman(){
    patrolmen.push(
        {
            x: 650,
            y: 501,
            origin_x: 650,
            origin_y: 450,
            height: 32,
            width: 32,
            direction: true,
            animStep:0,
            animTimer:0,
            path: [
                632, 825
            ],
            step:0,
            speed: 1
        }
    )
}

function loop() {
    // If the player is not jumping apply the effect of friction
    if(player.jump === false) {
        player.x_v *= friction;
    } else {
        // If the player is in the air then apply the effect of gravity
        // If the player is under terminal velocity (15), add gravity
        if (player.y_v < 15){
            player.y_v += gravity;
        }
    }
    // If the left key is pressed increase the relevant horizontal velocity
    // The velocity (+- 3.5) is the terminal x velocity of the player
    if(keys.left) {
        player.x_v = -3.5;
    }
    if(keys.right) {
        player.x_v = 3.5;
    }

    // Collision detection
    let predictedX = player.x + player.x_v;
    let predictedY = player.y + player.y_v;

    predictedX = Math.round(predictedX);
    predictedY = Math.round(predictedY);

    // See if the player is colliding with the borders of the play area
    // Obsolete -> we'll make special level collision blocks

    // The player is falling by default
    player.jump = true;

    // See if the player is colliding with the collision blocks
    for(const collisionBlock of collisionBlocks) {
        // If the player is inside the collision block on the X and Y axis
        if(
            predictedX >= collisionBlock.x
            && predictedX - player.width < collisionBlock.x + collisionBlock.width
            && predictedY > collisionBlock.y
            && predictedY - player.height <= collisionBlock.y + collisionBlock.height + 1 ){
            // If the collision block is a floor
            if(collisionBlock.collisionSide === 0){
                // If the player come from the top
                if(player.y <= collisionBlock.y + 1){
                    player.y_v = 0;
                    predictedY = collisionBlock.y + 1;
                    player.jump = false;
                } else {
                    // If the player is coming from the left
                    if(player.x <= collisionBlock.x){
                        predictedX = collisionBlock.x;
                    }
                    // If the player is coming from the right
                    else {
                        predictedX = collisionBlock.x + collisionBlock.width + player.width;
                    }
                }
            }
            // If the collision block is a wall right
            if(collisionBlock.collisionSide === 1){
                // If the player come from the right
                if(player.x - player.width >= collisionBlock.x + collisionBlock.width){
                    predictedX = collisionBlock.x + collisionBlock.width + player.width;
                } else {
                    // If the player is coming from the top
                    if(player.y <= collisionBlock.y + 1){
                        player.y_v = 0;
                        predictedY = collisionBlock.y + 1;
                        player.jump = false;
                    }
                    // If the player is coming from the bottom
                    else {
                        predictedY = collisionBlock.y + collisionBlock.height + player.height;
                    }
                }
            }
            // If the collision block is a ceiling
            if(collisionBlock.collisionSide === 2){
                if(player.y >= collisionBlock.y + collisionBlock.height){
                    predictedY = collisionBlock.y + collisionBlock.height + player.height;
                } else {
                    // If the player is coming from the right
                    if(player.x <= collisionBlock.x){
                        predictedX = collisionBlock.x;
                    }
                    // If the player is coming from the left
                    else {
                        predictedX = collisionBlock.x + collisionBlock.width + player.width;
                    }
                }
            }
            // If the collision block is a wall left
            if(collisionBlock.collisionSide === 3){
                // If the player come from the left
                if(player.x <= collisionBlock.x){
                    predictedX = collisionBlock.x;
                } else {
                    // If the player is coming from the top
                    if(player.y <= collisionBlock.y + 1){
                        player.y_v = 0;
                        predictedY = collisionBlock.y + 1;
                        player.jump = false;
                    }
                    // If the player is coming from the bottom
                    else {
                        predictedY = collisionBlock.y + collisionBlock.height + player.height;
                    }
                }
            }
        }
    }

    // See if the player is colliding with the platforms
    for (const platform of platforms) {
        // ]platform.x;platform.x+platform.width[
        if(predictedX > platform.x && predictedX - player.width < platform.x + platform.width) {
            // Predictive Y collision
            // [platform.y+3;platform.y+1] -> 1. tolerance for clip (define if goes through) | 2. hitbox
            if (player.y <= platform.y+3 && predictedY >= platform.y+1) {
                // If the player was above the platform and now is within it vertically
                predictedY = platform.y+1;
                player.y_v = 0;
                player.jump = false;
            }
        }
    }

    if (predictedX - player.width < 0) {
        predictedX = player.width;
    }
    if (predictedX > 1520) {
        predictedX = 1520;
    }
    if (predictedY - player.height < 0) {
        predictedY = player.height;
    }

    // Death - TEMPORARY
    if (predictedY > 1200) {
        predictedY = player.origin_y;
        predictedX = player.origin_x;
        player.y_v = 0;
        player.x_v = 0;
        player.jump = true;
    }

    // Apply the final position to the character
    player.y = predictedY;
    player.x = predictedX;

    // Player is at the end of the level
    if(player.x >= lvlend.x
        && player.x - player.width < lvlend.x + lvlend.width
        && player.y > lvlend.y
        && player.y - player.height <= lvlend.y + lvlend.height){
        console.log("You won!");
    }

    // Patrolman calculations
    for (const patrolman of patrolmen) {
        if (patrolman.x < patrolman.path[patrolman.step]) {
            patrolman.x += patrolman.speed;
            patrolman.direction = true;

        } else {
            patrolman.x -= patrolman.speed;
            patrolman.direction = false;
        }
        if (patrolman.x === patrolman.path[patrolman.step]) {
            patrolman.step++;
            if (patrolman.step >= patrolman.path.length) {
                patrolman.step = 0;

            }

        }
    }

    // Rendering the canvas, the player and the platforms
    render.rendercanvas(platforms, collisionBlocks);
    render.renderpatrolmen(patrolmen);
    render.renderplayer(player,playerWeapon,keys);
}

// Attack key listener
function keydown(event) {
    // left shift key
    if(event.keyCode === 16) {
        keys.attack = true;
    }
    // direction keys
    if(event.keyCode === 37) {
        keys.left = true;
    }
    if (event.keyCode === 38) {
        keys.up = true;
        if(!player.jump){
            player.y_v = -10;
        }
    }
    if(event.keyCode === 39) {
        keys.right = true;
    }
}
function keyup(event) {
    // left shift key
    if(event.keyCode === 16) {
        keys.attack = false;
    }
    // direction keys
    if(event.keyCode === 37) {
        keys.left = false;
    }
    if(event.keyCode === 38) {
        if(player.y_v < -2) {
            player.y_v = -3;
        }
    }
    if(event.keyCode === 39) {
        keys.right = false;
    }
}

//drawtile();
// enable keyboard input
window.addEventListener("keydown", keydown)
window.addEventListener("keyup", keyup)
createplat();
createcollisionBlocks();
createpatrolman();
// Calling loop every 25 milliseconds to update the frame
setInterval(loop,25);

