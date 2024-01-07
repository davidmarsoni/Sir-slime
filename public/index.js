// Sources:
// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript

//Imports
import Loader from "./classes/management/Loader.js";
import Render from "./classes/management/Render.js";
import QuickObjectCreation from "./classes/management/QuickObjectCreation.js";
import ModalWindow from "./classes/management/ModalWindow.js";
import firebase from "./classes/management/Firebase.js";
import { START_MENU_FILE_NAME, DEFAULT_LEVEL } from "./classes/management/Default.js";
import DraggableObject from "./classes/ui/DraggableObject.js";

// Game variables
const GAME_ON = "game_on";
const GAME_OFF = "game_off";
const SKINS = "skins";
const MODAL = "modal";
const START = "start";
let uiState = START;

// The game state
let currentLevel = DEFAULT_LEVEL;
let currentModalWindow = new ModalWindow("", "");
let developerMode = false;
let debug = false;
let onlyPlayerKeys = false;
// The player
let player;

// The keys
let keys = {
    right: false,
    left: false,
    up: false,
    attack: false
};

// Objects of the game
const render = new Render(debug, developerMode);
const loader = new Loader();
const quickObjectCreation = new QuickObjectCreation();

// variables for the game loop
let fps = 40;
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

// The game loop
function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        // update time
        then = now - (delta % interval);
        loop();
    }
}

function loop() {
    //console.log("state",uiState);
    switch (uiState) {
        case GAME_ON: uiState
            update();
            break;
        case GAME_OFF: uiState
            break;
        case SKINS: uiState
            updatePageSkin();
            break;
        case MODAL: uiState
            render.renderModalWindow(currentModalWindow);
            break;
        case START: uiState
            start();
            break;
    }
}

function updatePageSkin() {
    for (const draggableZone of loader.draggableZones) {
        for (const draggableObject of loader.draggableObjects) {
            let collide = draggableZone.collide(draggableObject);
            if (collide && draggableObject.isDragging === false) {

                draggableObject.x = draggableObject.originX;
                draggableObject.y = draggableObject.originY;

                debug && console.log(draggableObject.texturepath);
                loader.currentSkinPreview.texturepath = draggableObject.texturepath;
                loader.currentSkinPreview.textureLoaded = false;
                loader.currentSkinPreview.loadTexture();

                let texturePart = draggableObject.texturepath.split("-");

                loader.currentSkinPath = texturePart[0] + "-" + texturePart[1] + "-" + texturePart[3];
                if (firebase.isUserSignedIn()) {
                    firebase.updatePlayerSkinPath(loader.currentSkinPath);
                }
                debug && console.log(loader.currentSkinPath);
            } else if (collide) {
                draggableObject.colorStroke = DraggableObject.STROKE_GREEN;
            } else {
                if (draggableObject.colorStroke === DraggableObject.STROKE_GREEN) {
                    draggableObject.colorStroke = DraggableObject.STROKE_ORANGE;
                }
            }
        }
    }
    render.renderSkinPage(loader);
}

function goToSkinPage() {
    uiState = SKINS;
    firebase.getPlayerSkinPath().then((skinpath) => {
        if (skinpath != null || skinpath != undefined) {
            let skinParts = skinpath.split("-");
            loader.currentSkinPreview.texturepath = skinParts[0] + "-" + skinParts[1] + "-preview-" + skinParts[2];
            loader.currentSkinPreview.loadTexture();
        }
    });
    addSkinKeys();
}

function goToStartState() {
    uiState = START;
    if (firebase.isUserSignedIn()) {
        if (loader.player.lives > 0) {
            if (developerMode === false) {
                firebase.updateHighestStats(loader.player.exportCurrentState());
            } else {
                firebase.resetHighestStats();
                firebase.resetAllTimeStats();
                firebase.resetCurrentState();
            }
        }
    }
    quickObjectCreation.status &&  quickObjectCreation.close();
    

    loader.reset();
    resetKeys();
    currentLevel = DEFAULT_LEVEL;
    window.document.title = "Sir Slime";
    removeGameKeys();
    loadStartMenu();
}
function goToModalState() {
    uiState = MODAL;
    resetKeys();
    debug && console.log("go to modal state");
    removeGameKeys();
    window.addEventListener("keydown", keydownModal);
}
function resetKeys() {
    //reset keys
    keys = {
        right: false,
        left: false,
        up: false,
        attack: false
    };
}

function removeGameKeys() {
    window.removeEventListener("keydown", keydown);
    window.removeEventListener("keyup", keyup);
    window.removeEventListener("keydown", utilityKeys);
}
function addGameKeys() {
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    if (onlyPlayerKeys === false) {
        window.addEventListener("keydown", utilityKeys);
    }
}
function addSkinKeys() {
    window.addEventListener("mousedown", skinMouseDown);
    window.addEventListener("mouseup", skinMouseUp);
    window.addEventListener("mousemove", skinMouseMove);
}
function removeSkinKeys() {
    window.removeEventListener("mousedown", skinMouseDown);
    window.removeEventListener("mouseup", skinMouseUp);
    window.removeEventListener("mousemove", skinMouseMove);
}

function skinMouseDown(event) {
    for (const draggableObject of loader.draggableObjects) {
        draggableObject.onMouseDown(event);
    }
}
function skinMouseUp(event) {
    for (const draggableObject of loader.draggableObjects) {
        draggableObject.onMouseUp(event);
    }
}
function skinMouseMove(event) {
    for (const draggableObject of loader.draggableObjects) {
        draggableObject.onMouseMove(event);
    }
}

function start() {
    render.renderStart(loader);
}
function update() {
    //update the player position
    player.updatePosition(keys);

    //fireballs
    player.updateFireball(loader.collisionBlocks, loader.bats, loader.patrolmen);

    // Collision detection
    // collision for the patrolmen
    for (const patrolman of loader.patrolmen) {
        patrolman.move();
        patrolman.collide(player);
    }
    // collision for the bats
    for (const bat of loader.bats) {
        bat.move(player);
        bat.collide(player);
    }
    // collision for the spikes
    for (const spike of loader.spikes) {
        spike.collide(player);
    }
    // collision for the collectibles
    for (const collectible of loader.collectibles) {
        collectible.collide(player);
    }
    // collision for the boss + hands && overall boss movement
    if (loader.boss != null) {
        if (loader.boss.isAlive === false) {
            if (firebase.isUserSignedIn()) {
                firebase.saveCurrentLevel(DEFAULT_LEVEL, player.exportCurrentState());
            }
            goToModalState();
            
            loader.playWinSound();
            currentModalWindow = new ModalWindow("You vanquished the boss",
                "however, the princess is in another castle ;)\n your score is : " + player.score + ".",
                true,
                true,
                function () {
                    
                    loadLevel(DEFAULT_LEVEL);
                }
            );
            
        }
        loader.boss.enactAI(player);
        loader.boss.move()
        loader.boss.moveHands()
        loader.boss.collide(player);

    }

    // Test if the player is dying

    // game over if the player has no more life
    if (!player.lifeRemains) {
        uiState = GAME_OFF;
        goToModalState();
        loader.playGameOverSound();
        currentModalWindow = new ModalWindow("Game Over",
            "you died you will be redirected to the start menu",
            true,
            true,
            function () {
                goToStartState();
            }
        );
        if (firebase.isUserSignedIn()) {
            firebase.resetCurrentState();
        }
    }
    // Death by falling
    if (player.predictedY > 1200) {
        player.takeDamage(2);
        player.respawn();
        debug && console.log("death by falling");
    }

    // See if the player is colliding with the passage ways
    for (const passageWay of loader.passageWays) {
        if (passageWay.collide(player)) {
            // slice the passage way to get the level name with | 
            debug && console.log("passage way to : " + passageWay.passageWayTo);
            debug && console.log("passage way title : " + passageWay.title);
            if (passageWay.isNewLevel === true) {
                if (firebase.isUserSignedIn()) {
                    console.log("saving current level");
                    firebase.saveCurrentLevel(passageWay.passageWayTo, player.exportCurrentState());
                }
            }
            if (passageWay.title === undefined || passageWay.title === "") {
                loadLevel(passageWay.passageWayTo);
                break;
            } else {
                goToModalState();
                currentModalWindow = new ModalWindow(
                    passageWay.title,
                    passageWay.content,
                    true,
                    true,
                    function () {
                        loadLevel(passageWay.passageWayTo);
                    }
                );
                break;
            }
        }
    }

    // See if the player is colliding with the doors
    for (const door of loader.doors) {
        door.collide(player);
    }

    //notes : the platform and the collision block  must be place a the end of the code 
    // to be sure about the collision detection

    // See if the player is colliding with the platforms
    for (const platform of loader.platforms) {
        platform.move();
        platform.collide(player);
    }

    // add the relative offset to the player position if there is one
    player.predictedX += player.relativeXoffset;
    player.relativeXoffset = 0;

    // See if the player is colliding with the collision blocks
    for (const collisionBlock of loader.collisionBlocks) {
        collisionBlock.collide(player);
    }

    //update the player position
    //================================

    //console.log("player.x_v : " + player.x_v, "player.y_v : " + player.y_v, "player.x : " + player.x, "player.y : " + player.y, "player.predictedX : " + player.predictedX, "player.predictedY : " + player.predictedY);
    player.y = player.predictedY;
    player.x = player.predictedX;

    // Check status of the player
    // See if the player was hit
    if (player.isHit) {
        player.invicibilityFrames();
    }
    // See if the player is prevented from moving
    if (player.preventMovement) {
        player.preventMovementFrames();
    }

    //render the game
    render.render(loader, quickObjectCreation, keys);
}


/**
 * Essential keys for the game
 * @param {*} event
 */
function keydown(event) {
    // Attack : left shift 
    if ((event.keyCode === 16 && event.code == "ShiftRight") || event.keyCode === 69) {
        keys.attack = true;
        player.throwFireball();
    }
    // direction keys : left arrow or 'a'
    if (event.keyCode === 37 || (onlyPlayerKeys && event.keyCode === 65)) {
        keys.left = true;
    }
    // jump : up arrow, space, or 'w'
    if (event.keyCode === 38 || event.keyCode === 32 || (onlyPlayerKeys && event.keyCode === 87)) {
        keys.up = true;
        // make the player jump, DO NOT REMOVE even if it looks useless
        if (!player.jump) {
            player.y_v = -10;
        }
    }
    // direction keys : right arrow or 'd'
    if (event.keyCode === 39 || (onlyPlayerKeys && event.keyCode === 68)) {
        keys.right = true;
    }

    //esc : exit  
    if (event.keyCode === 27) {
        developerMode && console.log("exit");
        goToStartState();

    }
    // key h (help)
    if (event.keyCode === 72) {
        let text = "You are in the help section. Here, you can find all the keys of the game.\n\n\n";

        //if only player keys is active
        if (onlyPlayerKeys) {
            text += "W or up arrow or Space   : jump \n";
            text += "A or left arrow          : move left \n";
            text += "D or right arrow         : move right \n";
            text += "E or right shift         : attack \n";
            text += "P                        : pause \n";
            text += "ESC                      : Go to the start menu\n";
            text += "Shift + P                : Quit this mode \n";
        } else {
            text += "[Controls] : \n";
            text += "Arrow or Space           : jump                                    Right shift              : attack \n";
            text += "Left arrow               : move left                               Right arrow              : move right \n";
            text += "[Essential keys] : \n";
            text += "P                        : pause                                   ESC                      : Go to the stat menu\n";  
        }
        if(firebase.isUserSignedIn() && onlyPlayerKeys === false){
            text += "[User connected keys] : \n";
            text += "T                        : see the highest statistics              L                        : see the leaderboard \n";
            text += "U                        : see your user data\n";
        }

        if(onlyPlayerKeys === false){
            text += "[Other keys] : \n";
            text += "S                        : see your statistics                     C                        : see the credits \n";
            text += "M                        : mute the music                          N                        : mute the sound \n";
            text += "O                        : print the level in PNG \n";
            text += "Shift + D                : switch to developer mode                Shift + P                : Switch to only player keys \n"; 
        }

        if(developerMode === true && onlyPlayerKeys === false){
            text += "[Developer mode keys] : \n";
            text += "D                        : see the debug mode                      A                        : ask for level name \n";
            text += "F                        : force load level                        Q                        : quick object creation \n";
        } 
        
        goToModalState();
        currentModalWindow = new ModalWindow("Help", text);
    }
    // key p (pause)
    if (event.keyCode === 80 && !event.shiftKey) {
        if (uiState === GAME_ON) {
            uiState = GAME_OFF;
        } else {
            uiState = GAME_ON;
        }
    }

    // shift + p (only player keys)
    if (event.shiftKey && event.keyCode === 80) {
        onlyPlayerKeys = !onlyPlayerKeys;
        removeGameKeys();
        addGameKeys();
        console.log("only player keys : " + onlyPlayerKeys);
    }
}

function keyup(event) {
    // Attack : left shift 
    if (event.keyCode === 16) {
        keys.attack = false;
    }
    // direction keys : left arrow or 'a'
    if (event.keyCode === 37 || (onlyPlayerKeys && event.keyCode === 65)) {
        keys.left = false;
    }
    // jump : up arrow, space, or 'w'
    if (event.keyCode === 38 || event.keyCode === 32 || (onlyPlayerKeys && event.keyCode === 87)) {
        if (player.y_v < -2) {
            player.y_v = -3;
        }
    }
    // direction keys : right arrow or 'd'
    if (event.keyCode === 39 || (onlyPlayerKeys && event.keyCode === 68)) {
        keys.right = false;
    }
}


function utilityKeys(event) {
    //key o print the level in png (o = output)
    if (event.keyCode === 79) {
        const canvas = document.getElementById('canvas');
        const dataURL = canvas.toDataURL('image/png');
        const image = new Image();
        //set the image source to current level
        image.src = dataURL;

        //create a link to download the image
        const link = document.createElement('a');
        link.download = currentLevel + " [" + new Date().toLocaleTimeString() + "]";
        link.href = dataURL;
        link.click();
    }

    //key s (statistics)
    if (event.keyCode === 83) {
        let text = "You are on the statistics page. To quit, press enter or escape.\n\n";
        text += "Current level: " + currentLevel + "\n";
        text += "Current Mode: ";
        if (developerMode === true) {
            text += "[developer mode]\n";
        } else {
            text += "[player mode]\n";
        }
        text += "Current position: x:" + player.x + " y:" + player.y + "\n";
        text += "Current life: " + player.lives + "\n";
        text += "Current health: " + player.health + "\n";
        text += "Current score: " + player.score + "\n";
        text += "Total damage taken: " + player.totalDamageTaken + "\n";
        text += "Total damage dealt: " + player.totalDamageDealt + "\n";
        text += "Total heal: " + player.totalheal + "\n";
        text += "Number of enemies killed: " + player.numberOfEnemieskilled + "\n";
        text += "Number of hearts collected: " + player.numberOfHeartsCollected + "\n";
        text += "Number of coins collected: " + player.numberOfCoinsCollected + "\n";
        text += "Number of deaths: " + player.numberOfDeaths + "\n";
        text += "Number of levels completed: " + player.numberOfLevelCompleted + "\n";
        goToModalState();
        currentModalWindow = new ModalWindow("Statistics", text);

    }

     // key ctrl+shift+d (debug switch)
     if (event.shiftKey && event.keyCode === 68) {
        if (developerMode === false) {
            let text = "Information\n\n";
            text += "You're about to switch to developer mode. Please consider the following message:\n\n";
            text += "You need to be in developer mode to use this key.\n";
            text += "You will lose your high score if you use this mode, and your current state will also be reset.\n";
            text += "This mode is used to debug the game, create new levels, and facilitate the development of the game.\n";
            text += "This mode could create bugs and problems with the game score or other things. Please use it wisely.\n\n";
            text += "Press Enter to continue.\n";
            text += "Press Escape to cancel.\n";
            text += "\n\n\n n.b. : you should activate F12 panel to see all the debug information an error message\n";

            goToModalState();
            currentModalWindow = new ModalWindow("Developer Mode note", text, true, false, () => {
                developerMode = !developerMode;
                if (firebase.isUserSignedIn()) {
                    firebase.resetCurrentState();
                    firebase.resetHighestStats();
                    firebase.resetAllTimeStats();
                }
                render.developerMode = developerMode;
                console.log("Developer mode : " + developerMode);
            }, true);
        } else {
            developerMode = !developerMode;
            render.developerMode = developerMode;
            if (firebase.isUserSignedIn()) {
                firebase.resetCurrentState();
                firebase.resetHighestStats();
                firebase.resetAllTimeStats();
            }
        }
    }

    //developer mode keys
    //===================================================================================================
    if (event.keyCode === 68 && !event.shiftKey && developerMode === true) {
        render.debug = !render.debug;
        debug = !debug;
    }

    //key a (ask for level name)
    if (event.keyCode === 65 && developerMode === true) {

        // ask for level name
        let levelName = prompt("Please enter the level name", "level1");
        if (levelName === null || levelName === "" || levelName === undefined) {
            uiState = GAME_ON;
            return;
        }
        loader.findFile("./assets/levels/", levelName, ".json").then((result) => {
            currentLevel = levelName;
            debug && console.log("saving current level", loader.levelName);
            if (firebase.isUserSignedIn()) {
                console.log("saving current level");
                firebase.saveCurrentLevel(loader.levelName, loader.player.exportCurrentState());
            }

            if (result) {
                loadLevel(levelName, false);
            } else {
                currentModalWindow = new ModalWindow("Error - Level not found", "The level \"" + levelName + "\" doesn't exist", true, true);
                goToModalState();

            }
        });
    }

    //key f (force load level)
    if (event.keyCode === 70 && developerMode === true) {
        uiState = GAME_OFF;
        console.log("force load level");
        loader.reset();
        loadLevel(currentLevel, false);
        console.log("current level : " + currentLevel);
    }

    // key q (quick object creation)
    if (event.keyCode === 81 && developerMode === true) {
        if (quickObjectCreation.status === false) {
            quickObjectCreation.open(); 
        } else {
            quickObjectCreation.close();
        }
    }

    //user connected keys
    //===================================================================================================
    // key t (heighest statistics)
    if (event.keyCode === 84) {
        if (!firebase.isUserSignedIn()) {
            return;
        }
        firebase.getHighestStats().then((result) => {
                if (result != null) {
                let text = "You are on the highest statistics page.\n";
                text += "Here, you can see the highest scoring game ever made.\n\n";
                text += "Current score: " + result.score + "\n";
                text += "Total damage taken: " + result.totalDamageTaken + "\n";
                text += "Total damage dealt: " + result.totalDamageDealt + "\n";
                text += "Total heal: " + result.totalheal + "\n";
                text += "Number of enemies killed: " + result.numberOfEnemieskilled + "\n";
                text += "Number of hearts collected: " + result.numberOfHeartsCollected + "\n";
                text += "Number of coins collected: " + result.numberOfCoinsCollected + "\n";
                text += "Number of deaths: " + result.numberOfDeaths + "\n";
                text += "Number of levels completed: " + result.numberOfLevelCompleted + "\n";
                goToModalState();
                currentModalWindow = new ModalWindow("Highest Statistics", text);
            }
        });

    }
    // key c (credits)
    if (event.keyCode === 67) {
        let text = "You are on the credits page.\n";
        text += "Here, you can see the credits of the game.\n\n";
        text += "Game developed by: \n";
        text += "    - Binjos Adnan \n";
        text += "    - Fernández Rodríguez Zanya\n";
        text += "    - Marsoni David\n";
        text += "    - Pitteloud Mathias\n";
        text += "Special thanks to:\n";
        text += "    - https://shark-game.gloor.dev/, Webtastic Fluffy Bird, The Tremendous Journey, Tetris and Stack for letting\n";
        text += "us use their avatars.\n";
        text += "    - Araújo Jonathan for the idea of using skins from all the projects of the year.\n";

        currentModalWindow = new ModalWindow("Credits", text);
        goToModalState();
    }

    // key u userdata
    if (event.keyCode === 85) {
        if (firebase.isUserSignedIn()) {
            firebase.getUserInfo().then((result) => {
                if (result != null) {
                    let text = "You are on the user data page\n";
                    text += "here you can see your user data\n\n"

                    // show all the data of result
                    for (const key in result) {
                        //test if there is a other object or a value
                        if (typeof result[key] === "object") {
                            text += key + " : \n";
                            for (const subkey in result[key]) {
                                text += "    " + subkey + " : " + result[key][subkey] + "\n";
                            }
                        } else {
                            text += key + " : " + result[key] + "\n";
                        }
                    }

                    goToModalState();
                    currentModalWindow = new ModalWindow("User Data", text);
                }
            });
        }
    }

    //l (leaderboard)
    if (event.keyCode === 76) {
        if(!firebase.isUserSignedIn()){
            return;
        }
        firebase.getLeaderboard().then(([data, usernames]) => {
            if (data != null && usernames != null) {
                let text = "You are on the leaderboard page\n";
                text += "here you can see all the best score made by the players\n\n"
                for (let i = 0; i < data.length; i++) {
                    text += "Rank " + (i + 1).toString().padEnd(3) + " : " + usernames[i].padEnd(30) + " with " + data[i].score.toString().padStart(8, '0').padEnd(16) + " date : " + new Date(data[i].time.seconds * 1000).toLocaleString() + "\n";
                }
                goToModalState();
                currentModalWindow = new ModalWindow("Leaderboard", text);
            }
        });
    }

    // key n (mute sound)
    if (event.keyCode === 78) {
        loader.playSound = !loader.playSound;
    }
    // key m (mute music)
    if (event.keyCode === 77) {
        loader.playMusic = !loader.playMusic;
    }
}

function keydownStart(event) {
    //key = enter
    if (event.keyCode === 13) {
        startGame();
    }
}

function keydownModal(event) {

    const isEnterKey = event.keyCode === 13;
    const isEscKey = event.keyCode === 27;

    if (isEnterKey || isEscKey) {
        window.removeEventListener("keydown", keydownModal);
        uiState = GAME_ON;
        addGameKeys();

        if (isEnterKey || currentModalWindow.conditionalExit === false) {
            currentModalWindow.callback != undefined && currentModalWindow.callback();
        }
    }
}

function startGame() {
    debug && console.log("start game");

    uiState = GAME_OFF;
    loader.startMenuButtons.forEach(button => {
        button.removeEventListener();
    });
    loader.connectButton.removeEventListener();
    window.removeEventListener("keydown", keydownStart);
    removeSkinKeys();
    if (firebase.isUserSignedIn()) {
        firebase.getCurrentLevel().then((levelData) => {
            if (levelData != null) {
                currentLevel = levelData.name;
            }
            loadLevel(currentLevel, false);
        });
    } else {
        loadLevel(currentLevel, false);
    }
    addGameKeys();
}

function skinPage() {
    if (uiState === SKINS) {
        uiState = START;
        removeSkinKeys();
    } else {
        goToSkinPage();
    }
}

function loadLevel(levelpath) {
    uiState = GAME_OFF;
    loader.loadGame(levelpath, false).then((result) => {
        if (result) {
            player = loader.player;
            document.title = String.fromCodePoint(0x1F3AE) + " " + loader.levelDisplayName + " by " + loader.levelAuthor;
            currentLevel = loader.levelName;
            uiState = GAME_ON;
            debug && console.log("level loaded : " + currentLevel);
        } else {
            console.error(loader.errors);
        }
    });
}

function loadStartMenu() {
    loader.loadStartMenu(START_MENU_FILE_NAME).then((result) => {
        if (!result) {
            console.error(loader.errors);
        } else {
            //set the button action
            loader.setbuttonAction(0, startGame);
            loader.setbuttonAction(1, skinPage);
            window.addEventListener("keydown", keydownStart)
            uiState = START;
            debug && console.log("start menu loaded");
        }
    });
}

// Start the game
loadStartMenu();
animate();

