// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript

import Loader from "./classes/management/Loader.js";
import Render from "./classes/management/render.js";


//create the render object
const render = new Render();
const loader = new Loader();

// The game state
let gameOn = false;

// game screen variables
const GAME_ON = "game_on";
const GAME_OFF = "game_off";
const COMMAND = "command";
const START = "start";
let uiState = START;


let currentLevel = "level1";

// The player character
let player;

// The status of the arrow keys
let keys = {
    right: false,
    left: false,
    up: false,
    attack: false
};
// The friction and gravity to show realistic movements
let gravity = 0.6;
let friction = 0.7;

// The objects
let passageWays = [];
let platforms = [];
let patrolmen = [];
let bats = [];
let collisionBlocks = [];

//here we start the game, I must change this for the start game, boucle pour animations, que le jeu tourne 
function loop(){

    switch(uiState){

        case GAME_ON : "game_on"
        update();
        break;
        case GAME_OFF : "game_off"
        console.log("waiting to start")
        break;
        case COMMAND : "command"
        break;
        case START : "start"
        start();
        break;
    }
    /*if(gameOn){
        update();
    }
    */
}

function start() {
    render.renderStart(loader.startScreenBackgroundImage);
}

function update() {
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

    // See if the player is colliding with the platforms
    for (const platform of platforms) {
        platform.collide(player);
    }

    // See if the player is colliding with the collision blocks
    for(const collisionBlock of collisionBlocks) {
        collisionBlock.collide(player);
    }

    for (const patrolman of patrolmen) {
        patrolman.move();
        patrolman.collide(player);
    }

    for (const bat of bats){
        bat.move(player);
        bat.collide(player);
    }

    // Death by falling
    if (player.predictedY > 1200) {
        player.dead();
    }

    // game over if no life remains
    if(!player.ifLifeRemains()){
        gameOn = false;
        alert("Game Over the level1 will be reloaded");
        loader.reset();
        loadLevel("level1");
    }

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

    for (const passageWay of passageWays){
        if(passageWay.collide(player)){
            console.log("passage way to : " + passageWay.passageWayTo);
            loadLevel(passageWay.passageWayTo);
            //currentLevel = passageWay.passageWayTo;
            break;
        }
    }

    // Rendering the canvas, objects, entities, player
    render.renderCanvas(loader.backgroundImage);
    //console.log(bats);
    render.renderObjects(platforms, collisionBlocks, passageWays);
    render.renderEntities(patrolmen, bats);
    render.renderPlayer(player,keys);
    render.renderScorboard(loader);
    

    
}

// Attack key listener
function keydownGame(event) {
    //=============================
    // temporary key listener
    // key p (pause)
    if(event.keyCode === 80) {
        if(uiState == GAME_ON){
            uiState = GAME_OFF;
        }else if (uiState = GAME_OFF){
            uiState = GAME_ON;
        }
        
    }
    //quand je suis dans start, ça affiche dans le render que je suis dans le render 

    //key a (ask for level name)
    if(event.keyCode === 65 ) {
       
        // ask for level name
        let levelName = prompt("Please enter the level name", "level1");
        loader.findFile("./levels/",levelName,".json").then((result)=>{
            if(result){
                loadLevel(levelName,false);
            }else{
                alert("level doesn't exist");
            }
        });   
    }
    //key f (force load level)
    if(event.keyCode === 70) {
        gameOn = false;
        console.log("force load level");
        loader.reset();
        loadLevel(currentLevel,true);
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
    //=============================

    // left shift key
    if(event.keyCode === 16 ) {
        keys.attack = true;
    }
    // direction keys
    if(event.keyCode === 37) {
        keys.left = true;
    }
    if (event.keyCode === 38) {
        keys.up = true;
        // make the player jump, DO NOT REMOVE even if it looks useless
        if(!player.jump){
            player.y_v = -10;
        }
    }
    if(event.keyCode === 39) {
        keys.right = true;
    }
}
function keyupGame(event) {
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
function keyupStart(event){

}

function keydownStart(event) {
/*
    const GAME_ON = "game_on";
const GAME_OFF = "game_off";
const COMMAND = "command";
const START = "start";
let uiState = START;
*/
    //key = enter
    if(event.keyCode === 13) {
        uiState = GAME_OFF;
        window.addEventListener("keydown", keydownGame)
        window.addEventListener("keyup", keyupGame)
        loadLevel(currentLevel,false);
    }
    

}

//use to make a quick level save but have many problems
//saveLevelToJSON("level1", "mathias",player, platforms, patrolmen,collisionBlocks);


function loadLevel(levelpath,debug = false) {
    uiState = GAME_OFF;
    loader.loadGame(levelpath,debug).then((result)=>{
        if(result){
            currentLevel = loader.levelname;
            player = loader.player;
            patrolmen = loader.patrolmen;
            platforms = loader.platforms;
            collisionBlocks = loader.collisionBlocks;
            passageWays = loader.passageWays;
            
            document.title = loader.levelName + " by " + loader.levelAuthor;
            currentLevel = loader.levelName;
            bats = loader.bats;
            uiState = GAME_ON;
        }else{
            console.error(loader.errors);
        }
    });
   
    
}

window.addEventListener("keydown", keydownStart)
window.addEventListener("keyup", keyupStart)
setInterval(loop,25);

loader.loadStartScreen("startScreen");

