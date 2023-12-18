// Sources:
// https://www.educative.io/answers/how-to-make-a-simple-platformer-using-javascript

//Imports
import Loader from "./classes/management/Loader.js";
import Render from "./classes/management/Render.js";
import QuickObjectCreation from "./classes/management/QuickObjectCreation.js";
import ModalWindow from "./classes/management/ModalWindow.js";
import firebase from "./classes/management/Firebase.js";
import { START_MENU_FILE_NAME, DEFAULT_LEVEL } from "./classes/management/Default.js";

// Game variables
const GAME_ON = "game_on";
const GAME_OFF = "game_off";
const COMMAND = "command";
const MODAL = "modal";
const START = "start";
let uiState = START;

// The game state
let currentLevel = DEFAULT_LEVEL;
let currentModalWindow = new ModalWindow("", "");
let developerMode = true;
let debug = true;
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
      case GAME_ON: "game_on"
         update();
         break;
      case GAME_OFF: "game_off"
         break;
      case COMMAND: "command"
         break;
      case MODAL: "modal"
         render.renderModalWindow(currentModalWindow);
         break;
      case START: "start"
         start();
         break;
   }
}
function goToStartState() {
   uiState = START;
   if (firebase.isUserSignedIn()) {
      if (loader.player.lives > 0) {
         //firebase.saveCurrentLevel(loader.levelName,loader.player.exportCurrentState());
         firebase.updateHighestStats(loader.player.exportCurrentState());
         firebase.updateAllTimeStats(loader.player.exportCurrentStats());
      }
   }
   loader.reset();
   resetKeys();
   currentLevel = DEFAULT_LEVEL;
   removeGameKeys();
   loadStartMenu();
}
function goToModalState() {
   uiState = MODAL;
   resetKeys();
   console.log("go to modal state");
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
function start() {
   render.renderStart(loader);
}
function commandScreen() {
   window.removeEventListener("keydown", keydownStart);
   uiState = GAME_OFF;
   addGameKeys();
   render.renderCommand(loader);
}
function update() {
   //update the player position
   player.updatePosition(keys);

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
   // Death by falling
   if (player.predictedY > 1200) {
      player.takeDamage(2);
      player.respawn();
   }
   // game over if no life remains
   if (!player.lifeRemains) {
      uiState = GAME_OFF;
      goToModalState();
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

   // See if the player is colliding with the passage ways
   for (const passageWay of loader.passageWays) {
      if (passageWay.collide(player)) {
         // slice the passage way to get the level name with | 
         debug && console.log("passage way to : " + passageWay.passageWayTo);
         debug && console.log("passage way title : " + passageWay.title);
         if (firebase.isUserSignedIn()) {
            firebase.saveCurrentLevel(passageWay.passageWayTo, player.exportCurrentState());
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

   for (const door of loader.doors) {
      door.collide(player);
      //TODO : add the same code ass the passage way to change level
   }

   //notes : the platform and the collision block  must be place a the end of the code 
   // to be sure about the collision detection

   // See if the player is colliding with the platforms
   for (const platform of loader.platforms) {
      platform.move();
      platform.collide(player);
   }

   //fireballs
   player.updateFireball(loader.collisionBlocks, loader.bats, loader.patrolmen);

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

// Attack key listener
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
      console.log("exit");
      goToStartState();

   }
   // key h (help)
   if (event.keyCode === 72) {
      let text = "You are on the help. Here you can find the keys to play the game. \n\n";

      if (onlyPlayerKeys === false) {
         text += "Current Mode    : ";
         if (developerMode === true) {
            text += "[developer mode]\n";
         } else {
            text += "[player mode]\n";
         }
         text += "Arrow keys      : move\n";
         text += "Space or up key : jump\n";
         text += "Left shift or e : attack\n";
         text += "Esc             : exit\n";
         text += "P               : pause\n";
         text += "H               : help\n";
         text += "M               : mute music\n";
         text += "N               : mute sound\n";
         text += "O               : print the level in png\n";
         text += "S / T           : S for statistics and T heighest statisitcs sver (work only if connected)\n";
         text += "Shift+D         : Developer mode\n";
         text += "Shift+P         : only player keys (wasd)\n";
         if (developerMode === true) {
            text += "D               : debug\n";
            text += "A               : ask for level name\n";
            text += "F               : force load level\n";
            text += "Q               : quick object creation\n";
         }
      } else {
         text += "You are in only player keys mode. This mode is use to play the game with only the player keys (wasd).\n";
         text += "To quit this mode press shift+p again. \n";
         text += "h              : help\n";
         text += "w              : jump\n";
         text += "a              : left\n";
         text += "d              : right\n";
         text += "e              : attack\n";
         text += "ESC            : exit\n";
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

   // shif + p (only player keys)
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
   // key ctrl+shift+d (debug switch)
   if (event.shiftKey && event.keyCode === 68) {
      if (developerMode === false) {
         let text = "Informations\n\n";
         text += "you're going to switch to developer mode please concider the folowing message : \n\n";
         text += "You need to be a developer mode to use this key.\n";
         text += "This mode is use to debug the game and create new levels and facilitate the development of the game.\n";
         text += "This mode can be use to cheat and break the game. Please use it wisely. \n";
         text += "To quit this mode press ctrl+shift+d again. \n";
         text += "To quit this page press enter. or escape";

         goToModalState();
         currentModalWindow = new ModalWindow("Developer Mode note", text);
      }

      developerMode = !developerMode;
      render.developerMode = developerMode;
      console.log("Developer mode : " + developerMode);
   }

   //developer mode keys
   if (developerMode === true) {
      if (event.keyCode === 68 && !event.shiftKey) {
         render.debug = !render.debug;
      }
      //key a (ask for level name)
      if (event.keyCode === 65) {

         // ask for level name
         let levelName = prompt("Please enter the level name", "level1");
         if (levelName === null || levelName === "" || levelName === undefined) {
            uiState = GAME_ON;
            return;
         }
         loader.findFile("./assets/levels/", levelName, ".json").then((result) => {
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
      if (event.keyCode === 70) {
         uiState = GAME_OFF;
         console.log("force load level");
         loader.reset();
         loadLevel(currentLevel, false);
         console.log("current level : " + currentLevel);
      }
      // key q (quick object creation)
      if (event.keyCode === 81) {
         if (quickObjectCreation.status === false) {
            quickObjectCreation.open(); 1
         } else {
            quickObjectCreation.close();
         }
      }
   }
   //key s (statistics)
   if (event.keyCode === 83) {
      let text = "You are on the statistics page to quit press enter or escape\n\n"
      text += "Current level              : " + currentLevel + "\n";
      text += "Current Mode               : ";
      if (developerMode === true) {
         text += "[developer mode]\n";
      } else {
         text += "[player mode]\n";
      }
      text += "Current position           : x:" + player.x + " y:" + player.y + "\n";
      text += "Current life               : " + player.lives + "\n";
      text += "Current health             : " + player.health + "\n";
      text += "Current score              : " + player.score + "\n";
      text += "Total damage taken         : " + player.totalDamageTaken + "\n";
      text += "Total damage dealt         : " + player.totalDamageDealt + "\n";
      text += "Total heal                 : " + player.totalheal + "\n";
      text += "Number of enemies killed   : " + player.numberOfEnemieskilled + "\n";
      text += "Number of hearts collected : " + player.numberOfHeartsCollected + "\n";
      text += "Number of coins collected  : " + player.numberOfCoinsCollected + "\n";
      text += "Number of deaths           : " + player.numberOfDeaths + "\n";
      text += "Number of level completed  : " + player.numberOfLevelCompleted + "\n";
      goToModalState();
      currentModalWindow = new ModalWindow("Statistics", text);

   }
   // key t (heighest statistics)
   if (event.keyCode === 84) {
      if (!firebase.isUserSignedIn()) {
         return;
      }
      firebase.getHighestStats().then((result) => {
         if (result != null) {
            let text = "You are on the heighest statistics page\n";
            text += "here you can see the highest score game ever made\n\n"

            text += "Current score              : " + result.score + "\n";
            text += "Total damage taken         : " + result.totalDamageTaken + "\n";
            text += "Total damage dealt         : " + result.totalDamageDealt + "\n";
            text += "Total heal                 : " + result.totalheal + "\n";
            text += "Number of enemies killed   : " + result.numberOfEnemieskilled + "\n";
            text += "Number of hearts collected : " + result.numberOfHeartsCollected + "\n";
            text += "Number of coins collected  : " + result.numberOfCoinsCollected + "\n";
            text += "Number of deaths           : " + result.numberOfDeaths + "\n";
            text += "Number of level completed  : " + result.numberOfLevelCompleted + "\n";
            goToModalState();
            currentModalWindow = new ModalWindow("Heighest Statistics", text);
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
   //key = enter or escape
   if (event.keyCode === 13 || event.keyCode === 27) {
      window.removeEventListener("keydown", keydownModal)
      uiState = GAME_ON;
      addGameKeys();
      currentModalWindow.callback != undefined && currentModalWindow.callback();
   }
}

function startGame() {
   debug && console.log("start game");
   uiState = GAME_OFF;
   loader.startScreenButton.forEach(button => {
      button.executed_function = undefined;
   });
   window.removeEventListener("keydown", keydownStart);
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
   loader.loadStartMenu(START_MENU_FILE_NAME, false).then((result) => {
      if (!result) {
         console.error(loader.errors);
      } else {
         //set the button action
         loader.setbuttonAction(0, startGame);
         loader.setbuttonAction(1, commandScreen);
         window.addEventListener("keydown", keydownStart)
         uiState = START;
         debug && console.log("start menu loaded");
      }
   });
}

// Start the game
loadStartMenu();
animate();

