// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript
import Render from "./render.js";
// import levelManager
import {loadLevelFromJSON, saveLevelToJSON } from "./LevelManager.js";
//import classes
import Player from "./classes/Player.js";
import Weapon from "./classes/Weapon.js";
import PassageWay from "./classes/PassageWay.js";
import Platform from "./classes/Platform.js";
import CollisionBlock from "./classes/CollisionBlock.js";
import Patrolman from "./classes/Patrolman.js";

//create the render object
const render = new Render();

//letiables
let gameOn = false;
let currentLevel = "level1";

// The player character
let player;
let playerWeapon = [];
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
let goalAchieved = false;

// The objects
let passageWays = [];
let platforms = [];
let patrolmen = [];
let collisionBlocks = [];

function loop(){
    if(gameOn){
        update();
    }
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

    if (player.predictedX - player.width < 0) {
        player.predictedX = player.width;
    }
    if (player.predictedX > 1520) {
        player.predictedX = 1520;
    }
    if (player.predictedY - player.height < 0) {
        player.predictedY = player.height;
    }

    // Death - TEMPORARY
    if (player.predictedY > 1200) {
        player.predictedY = player.origin_y;
        player.predictedX = player.origin_x;
        player.y_v = 0;
        player.x_v = 0;
        player.jump = true;
    }

    // Apply the final position to the character
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
            loadLevel("levels/" + passageWay.passageWayTo + ".json");
            currentLevel = passageWay.passageWayTo;
            console.log(currentLevel);
            break;
        }
    }

    // Rendering the canvas, the player and the platforms
    render.renderCanvas(platforms, collisionBlocks, passageWays);
    render.renderEntities(patrolmen);
    render.renderPlayer(player,playerWeapon,keys);
}

// Attack key listener
function keydown(event) {
    //=============================
    // temporary key listener
    // key p
    if(event.keyCode === 80) {
        gameOn = !gameOn;
        console.log(gameOn);
    }
    //key a ( and f to reload level)
    if(event.keyCode === 65 || event.keyCode === 70) {
        gameOn = false;
        if (event.keyCode === 65) {
            // ask for level name
            let levelName = prompt("Please enter the level name", "level0");
            // set the current level to the new level
            currentLevel = levelName;
            // find if the level exists
            let levelList = [];
            const xhr = new XMLHttpRequest();
            xhr.open('GET', './levels/');
            xhr.onload = function () {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
                const links = htmlDoc.getElementsByTagName('a');
                for (let i = 0; i < links.length; i++) {
                    const fileName = links[i].getAttribute('href');
                    if (fileName.endsWith('.json')) {
                        const levelName = fileName.slice(0, -5);
                        levelList.push(levelName);
                    }
                }
                // if the level doesn't exist announce it and end the function
                if (!levelList.includes(levelName)) {
                    alert("This level doesn't exist");
                    return;
                }
                console.log("level exists");
            }
        }
        loadLevel('./levels/' + currentLevel + '.json');
        xhr.send();
    }
    //=============================

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
        // make the player jump, DO NOT REMOVE even if it looks useless
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

//use to make a quick level save but have many problems
//saveLevelToJSON("level1", "mathias",player, platforms, patrolmen,collisionBlocks);

// Set functions section
// TODO: setfunction for the ennemies
function setObjects(objectsArray) {
    let platformObject = [];
    let collisionBlockObject = [];
    let passageWayObject = [];
    
    for (let i = 0; i < objectsArray.length; i++) {
        const element = objectsArray[i];
        if(element.passageWay){
            const passageWay = new PassageWay(element.passageWay.x,element.passageWay.y,element.passageWay.width,element.passageWay.height,element.passageWay.nextLevel);
            passageWayObject.push(passageWay);
        } else if(element.platform){
            const platform = new Platform(element.platform.x,element.platform.y,element.platform.width,element.platform.height,element.platform.texturepath,element.platform.spriteSheetOffsetX,element.platform.spriteSheetOffsetY,element.platform.spriteSheetWidth,element.platform.spriteSheetHeight);
            platformObject.push(platform);
        } else if(element.collisionBlock){
            const collisionBlock = new CollisionBlock(element.collisionBlock.x,element.collisionBlock.y,element.collisionBlock.width,element.collisionBlock.height,element.collisionBlock.collisionSide);
            collisionBlockObject.push(collisionBlock);
        }
        
    }
    passageWays = passageWayObject;
    platforms = platformObject;
    collisionBlocks = collisionBlockObject;
}
function setPatrolmen(patrolmenArray) {
    patrolmen = [];
    for(let i = 0; i < patrolmenArray.length; i++){
        const patrolman = new Patrolman(patrolmenArray[i].x,patrolmenArray[i].y,patrolmenArray[i].width,patrolmenArray[i].height,patrolmenArray[i].texturepath,patrolmenArray[i].origin_x,patrolmenArray[i].origin_y,patrolmenArray[i].direction,patrolmenArray[i].animStep,patrolmenArray[i].animTimer,patrolmenArray[i].path,patrolmenArray[i].speed,patrolmenArray[i].step);
        patrolmen.push(patrolman);
    }
}
function setPlayer(player_info) {
    let playerObject = player_info[0].player;
    let playerWeaponObject = player_info[1].playerWeapon;
    let weapon = new Weapon(playerWeaponObject.width,playerWeaponObject.height,playerWeaponObject.texturepath,playerWeaponObject.damage,playerWeaponObject.range,playerWeaponObject.attackSpeed);
    if (player == null) {
        player = new Player(playerObject.x, playerObject.y, playerObject.width, playerObject.height, playerObject.texturepath, playerObject.origin_x, playerObject.origin_y, weapon, playerObject.health, playerObject.maxHealth, playerObject.speed);
    } else {
        player.update(playerObject.x, playerObject.y, playerObject.origin_x, playerObject.origin_y)
    }
    player.x_v = playerObject.x_v;
    player.y_v = playerObject.y_v;

}

function loadLevel(levelpath,debug = false) {
    loadLevelFromJSON(levelpath,debug)
      .then(([Information,player_info,objects,ennemies]) => {
        let levelName = Information[0].name;
        let author = Information[1].author;
        document.title = levelName+" by "+author;
        let platforms = [];
        let patrolmen = [];
        for(let i = 0; i < ennemies.length; i++){
            const propertyNameFull = Object.keys(ennemies[i])[0];
            const propertyName = propertyNameFull.replace(/[^a-zA-Z0-9 ]/g, '');
            if(ennemies[i].patrolman){
                patrolmen.push(ennemies[i].patrolman);  
            }
        }
        
        setObjects(objects);
        setPatrolmen(patrolmen);
        setPlayer(player_info);
        
        gameOn = true;
      })
      .catch((error) => {
        console.error(error);
      });
    
}


window.addEventListener("keydown", keydown)
window.addEventListener("keyup", keyup)

setInterval(loop,25);
loadLevel("./levels/level1.json",false);