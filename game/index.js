// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.canvas.height = 720; // 720
ctx.canvas.width = 1520; // 1280

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "C:\\PlatformJS\\TestTileA.png";

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



// Function to render the canvas
function rendercanvas(){
    //ctx.fillStyle = "#F0F8FF";
    ctx.fillStyle = "#EBEBEB";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const platform of platforms) {
        ctx.fillStyle = "#242424";
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    }
}
// Function to render the player
function renderplayer(){
    //ctx.fillStyle = "#F08080";
    ctx.fillStyle = "#65a22f";
    ctx.fillRect(player.x-player.width, player.y-player.height, player.width, player.height);
    if(keys.attack) {
        // attack
        //ctx.fillStyle = "#f0b480";
        ctx.fillStyle = "#e78e3d";
        if (player.direction) {
            ctx.fillRect((player.x), (player.y + playerWeapon.y), playerWeapon.width, playerWeapon.height);
        } else {
            ctx.fillRect((player.x)-player.width + playerWeapon.x, (player.y + playerWeapon.y), -playerWeapon.width, playerWeapon.height);
        }
        if(delay === delayer){
            keys.attack = false;
        }
    }
}

// Function to create platforms
function createplat(){
    platforms.push(
        {
            x: 0,
            y: 96,
            width: 96,
            height: 32
        }, {
            x: 160,
            y: 128,
            width: 96,
            height: 32
        }, {
            x: 320,
            y: 160,
            width: 96,
            height: 32
        }, {
            x: 480,
            y: 192,
            width: 96,
            height: 32
        }, {
            x: 640,
            y: 270,
            width: 96,
            height: 32
        }
    );
}

function loop() {
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
    console.log(player.x, player.x_v)
    player.jump = false;
    // Updating the y and x coordinates of the player
    player.y += player.y_v;
    player.x += player.x_v;

    // Collision detection
    if (player.x - player.width < 0) {
        player.x = player.width;
    }

    if (player.y - player.height < 0) {
        player.y = player.height;
    }

    player.jump = true;

    for (const platform of platforms) {
        if (platform.x < player.x && platform.x + platform.width + player.width > player.x) {
            if (platform.y < player.y
                && platform.y + platform.height + player.height > player.y
                && player.y >= platform.y
            ) {
                player.y = platform.y;
                player.jump = false;

            }
        }
    }

    if (player.y > 1200) {
        player.y = player.origin_y;
        player.x = player.origin_x;
        player.y_v = 0;
        player.x_v = 0;
        player.jump = false;
    }

    // Rendering the canvas, the player and the platforms
    rendercanvas();
    renderplayer();
}

// Attack key listener
function keydown(event) {
    // left shift key
    if(event.keyCode === 16) {
        keys.attack = true;
        if (delayer === delay) {
            delayer = 0;
        }
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
// Calling loop every 22 milliseconds to update the frame
setInterval(loop,22);

