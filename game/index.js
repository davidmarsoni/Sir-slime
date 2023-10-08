// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript
import Render from "./render.js";

const render = new Render();
var player = {
    x: 64,
    y: 64,
    x_v: 0,
    y_v: 0,
    origin_x: 64,
    origin_y: 64,
    jump : true,
    height: 32,
    width: 32,
    direction: true // true is right, false is left
};
var playerWeapon = {
    x: 0,
    y: -30,
    width: 24,
    height: 24
}

var patrolman = [];


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

// The platforms
var platforms = [];

// Function to create platforms
function createplat(){
    platforms.push(
        {
            x: 0,
            y: 96,
            width: 96,
            height: 16
        }, {
            x: 160,
            y: 128,
            width: 96,
            height: 16
        }, {
            x: 320,
            y: 160,
            width: 96,
            height: 16
        }, {
            x: 480,
            y: 192,
            width: 96,
            height: 16
        }, {
            x: 640,
            y: 270,
            width: 96,
            height: 16
        }
    );
}

function Createpatrolman(){
    patrolman.push(
        {
            x: 212,
            y: 128,
            origin_x: 170,
            origin_y: 128,
            height: 32,
            width: 32,
            direction: true,
            animStep:0,
            animTimer:0,
            path: [
                256, 192
            ],
            step:0,
            speed: 1
        }
    )

}

function loop() {

    patrolman.forEach(function(patrolman) {

        
        
    
        if (patrolman.x < patrolman.path[patrolman.step]){
            patrolman.x += patrolman.speed;
            patrolman.direction = true;
            
        }else {
            patrolman.x -= patrolman.speed;
            patrolman.direction = false;
        }
        if(patrolman.x === patrolman.path[patrolman.step]){
            patrolman.step++;
            if(patrolman.step >= patrolman.path.length){
                patrolman.step = 0;

            }

        }
        console.log(patrolman.x,patrolman.step)
}
    )  




    // If the player is not jumping apply the effect of friction
    if(player.jump === false) {
        player.x_v *= friction;
    } else {
        // If the player is in the air then apply the effect of gravity
        player.y_v += gravity;
    }
    // If the left key is pressed increase the relevant horizontal velocity
    if(keys.left) {
        player.x_v = -3.5;
    }
    if(keys.right) {
        player.x_v = 3.5;
    }
    player.jump = false;

    // Collision detection
    let predictedX = player.x + player.x_v;
    let predictedY = player.y + player.y_v;

    predictedX = Math.round(predictedX);
    predictedY = Math.round(predictedY);

    // See if the player is colliding with the borders of the play area
    if (predictedX - player.width < 0) {
        predictedX = player.width;
    }
    if (predictedY - player.height < 0) {
        predictedY = player.height;
    }

    // The player is falling by default
    player.jump = true;

    // See if the player is colliding with the platforms
    for (const platform of platforms) {
        if(predictedX > platform.x && predictedX - player.width < platform.x + platform.width) {
            // Predictive Y collision
            if (player.y <= platform.y+1 && predictedY >= platform.y) {
                // If the player was above the platform and now is within it vertically
                predictedY = platform.y;
                player.y_v = 0;
                player.jump = false;
            }
        }
    }

    // Death
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



    // Rendering the canvas, the player and the platforms
    render.rendercanvas(platforms);
    render.renderplayer(player,playerWeapon,keys);
    render.renderenemy(patrolman);

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
        player.direction = false;
    }
    if (event.keyCode === 38) {
        keys.up = true;
        if(!player.jump){
            player.y_v = -10;
        }
    }
    if(event.keyCode === 39) {
        keys.right = true;
        player.direction = true;
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
// Creating the platform
createplat();
Createpatrolman();
// Calling loop every 25 milliseconds to update the frame
setInterval(loop,25);

