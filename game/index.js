// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript

import Loader from "./classes/management/Loader.js";
import Render from "./classes/management/Render.js";
import {FRICTION, GRAVITY} from "./classes/management/constant.js";
import QuickObjectCreation from "./classes/management/QuickObjectCreation.js";

//create the render object
const render = new Render(false);
const loader = new Loader();
const quickObjectCreation = new QuickObjectCreation();

// game variables
const GAME_ON = "game_on";
const GAME_OFF = "game_off";
const COMMAND = "command";
const START = "start";
let uiState = START;

// The game state
let currentLevel = "level1";
let devlopperMode = true;
// The player character
let player;
// The status of the arrow keys
let keys = {
    right: false,
    left: false,
    up: false,
    attack: false
};

// The objects
let passageWays = [];
let platforms = [];
let patrolmen = [];
let bats = [];
let collisionBlocks = [];
let collectibles = [];

// The main loop
function loop(){
    switch(uiState){
        case GAME_ON : "game_on"
            update();
            break;
        case GAME_OFF : "game_off"
            //console.log("waiting to start")
            break;
        case COMMAND : "command"
            break;
        case START : "start"
            start();
        break;
    }
}
function goToStartScreen(){
    loader.reset();
    currentLevel = "level1";
    window.removeEventListener("keydown", keydown)
    window.removeEventListener("keyup", keyup)
    uiState = START;
    window.addEventListener("keydown", keydownStart)
    window.addEventListener("keyup", keyupStart)
}

function start(){
    render.renderStart(loader.backgroundStartScreenImage);
}

function update() {
    // If the player is not jumping apply the effect of friction
    if(player.jump === false) {
        player.x_v *= FRICTION;
    } else {
        // If the player is in the air then apply the effect of gravity
        // If the player is under terminal velocity (15), add gravity
        if (player.y_v < 15){
            player.y_v += GRAVITY;
        }
    }
    // If the left key is pressed increase the relevant horizontal velocity
    // The velocity (+- 3.5) is the terminal x velocity of the player
    if(keys.left && player.preventMovement === false) {
        player.x_v = -3.5;
    }
    if(keys.right && player.preventMovement === false) {
        player.x_v = 3.5;
    }

    // Collision detection
    player.predictedX = Math.round(player.x + player.x_v);
    player.predictedY = Math.round(player.y + player.y_v);

    // The player is falling by default
    player.jump = true;


    for (const patrolman of patrolmen) {
        patrolman.move();
        patrolman.collide(player);
    }

    for (const bat of bats){
        bat.move(player);
        bat.collide(player);
    }

    for (const collactible of collectibles){
        collactible.collide(player);
    }

    // Death by falling
    if (player.predictedY > 1200) {
        player.takeDamage(2);
        player.respawn();
    }

    // game over if no life remains
    if(!player.lifeRemains){
        alert("Game Over");
        goToStartScreen();
    }

    for (const passageWay of passageWays){
        if(passageWay.collide(player)){
            console.log("passage way to : " + passageWay.passageWayTo);
            loadLevel(passageWay.passageWayTo);
            break;
        }
    }

    //notes : the platform and the collision block  must be place a the end of the code 
    // to be sure about the collision detection

    // See if the player is colliding with the platforms
    for (const platform of platforms) {
        platform.collide(player);
    }

    // See if the player is colliding with the collision blocks
    for(const collisionBlock of collisionBlocks) {
        collisionBlock.collide(player);
    }

    //update the player position
    //================================

    player.y = player.predictedY;
    player.x = player.predictedX;

    // See if the player was hit
    if (player.isHit){
        player.invicibilityFrames();
    }
    // See if the player is prevented from moving
    if (player.preventMovement){
        player.preventMovementFrames();
    }

    //render the game
    render.render(loader,quickObjectCreation,keys);
    
}

// Attack key listener
function keydown(event) {
    // Attack : left shift 
    if(event.keyCode === 16) {
        keys.attack = true;
    }
    // direction keys : left arrow or n
    if(event.keyCode === 37) {
        keys.left = true;
    }
    // jump : up arrow or space
    if (event.keyCode === 38 || event.keyCode === 32) {
        keys.up = true;
        // make the player jump, DO NOT REMOVE even if it looks useless
        if(!player.jump){
            player.y_v = -10;
        }
    }
    // direction keys 
    if(event.keyCode === 39 ) {
        keys.right = true;
    }

    // key ctrl+shift+d (debug switch)
    if(event.shiftKey && event.keyCode === 68) {
        if(devlopperMode === false){
            alert("You need to be in devlopper mode to use this key."+
            "\nThis mode is use to debug the game and create new levels and facilitate the development of the game."+
            "\n If you want to desactivate it press ctrl+shift+d again.");
        }
        devlopperMode = !devlopperMode;
        console.log("Devlopper mode : " + devlopperMode);
    }

    //devlopper mode keys
    if(devlopperMode === true){
        if(event.keyCode === 68 && !event.shiftKey) {
            render.debug = !render.debug;
        }
        //key a (ask for level name)
        if(event.keyCode === 65 ) {
        
            // ask for level name
            let levelName = prompt("Please enter the level name", "level1");
            loader.findFile("./assets/levels/",levelName,".json").then((result)=>{
                if(result){
                    loadLevel(levelName,false);
                }else{
                    alert("level doesn't exist");
                }
            });   
        }
        //key f (force load level)
        if(event.keyCode === 70) {
            uiState = GAME_OFF;
            console.log("force load level");
            loader.reset();
            loadLevel(currentLevel,false);
            console.log("current level : " + currentLevel);
        }
        //key o print the level in png (o = output)
        if (event.keyCode === 79) {
            // Get the canvas element
            const canvas = document.querySelector('canvas');
            // Convert the canvas to a data URL
            const dataURL = canvas.toDataURL('image/png');
            // Create a new Image object with the data URL as its source
            const image = new Image();
            image.src = dataURL;
            // Create a new <a> element with the download attribute set to the desired filename
            const link = document.createElement('a');
            link.download = 'level.png';
            // Set the href attribute of the <a> element to the data URL
            link.href = dataURL;
            // Simulate a click on the <a> element to download the file
            link.click();
        }
        // key q (quick object creation)
        if(event.keyCode === 81) {
            if(quickObjectCreation.status === false){
                quickObjectCreation.open();
            }else{
                quickObjectCreation.close();
            }
        }
    }
    // key n (mute sound)
    if(event.keyCode === 78) {
        loader.playSound = !loader.playSound;
    }
    // key m (mute music)
    if(event.keyCode === 77) {
        loader.playMusic = !loader.playMusic;
    }
    // key p (pause)
    if(event.keyCode === 80) {
        if(uiState === GAME_ON){
            uiState = GAME_OFF;
        }else{
            uiState = GAME_ON;
        }
    }
    //e : exit  
    if(event.keyCode === 69) {
        console.log("exit");
        goToStartScreen();

    }

    // key h (help)
    if(event.keyCode === 72) {
        let text = "Help :\n";
        if(devlopperMode === true){
            text += "[devlopper mode]\n";
        }else {
            text += "[player mode]\n";
        }
        text += "Arrow keys : move\n";
        text += "Space or up key: jump\n";
        text += "left shift : attack\n";
        text += "e : exit\n";
        text += "p : pause\n";
        text += "h : help\n";
        text += "n : mute sound\n";
        text += "m : mute music\n";
        text += "crtl+d : Devlopper mode\n";
        if(devlopperMode === true){
            text += "d : debug\n";
            text += "a : ask for level name\n";
            text += "f : force load level\n";
            text += "o : print the level in png\n";
            text += "q : quick object creation\n";
        }
        alert(text);
    }
}
function keyup(event) {
    // left shift key
    if(event.keyCode === 16) {
        keys.attack = false;
    }
    // direction keys
    if(event.keyCode === 37 ) {
        keys.left = false;
    }
    if(event.keyCode === 38 || event.keyCode === 32) {
        if(player.y_v < -2) {
            player.y_v = -3;
        }
    }
    if(event.keyCode === 39) {
        keys.right = false;
    }
}

function keydownStart(event) {
    //key = enter
    if(event.keyCode === 13) {
        window.removeEventListener("keydown", keydownStart)
        window.removeEventListener("keyup", keyupStart)
        uiState = GAME_OFF;
        window.addEventListener("keydown", keydown)
        window.addEventListener("keyup", keyup)
        loadLevel(currentLevel,false);
    }
}
function keyupStart(event){
}

function loadLevel(levelpath,debug = false) {
    uiState = GAME_OFF;
    loader.loadGame(levelpath,false).then((result)=>{
        if(result){
            currentLevel = loader.levelname;
            player = loader.player;
            patrolmen = loader.patrolmen;
            platforms = loader.platforms;
            collisionBlocks = loader.collisionBlocks;
            passageWays = loader.passageWays;
            document.title =String.fromCodePoint(0x1F3AE) +" "+ loader.levelName + " by " + loader.levelAuthor;
            currentLevel = loader.levelName;
            bats = loader.bats;
            collectibles = loader.collectibles;
            uiState = GAME_ON;
        }else{
            console.error(loader.errors);
        }
    });
}   

window.addEventListener("keydown", keydownStart)
window.addEventListener("keyup", keyupStart)
setInterval(loop,25);
//load the start screen
loader.loadStartScreen("startScreen").then((result)=>{
    if(!result){
        console.error(loader.errors);
    }
});




