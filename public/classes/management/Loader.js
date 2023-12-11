import loaderManager from "./LoaderManager.js";
import Player from "../entity/Player.js";
import Platform from "../platform/Platform.js";
import ActivationPlatform from "../platform/ActivationPlatform.js";
import MovablePlatform from "../platform/MovablePlatform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../entity/ennemy/Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../entity/ennemy/Bat.js";
import Coin from "../collectible/Coin.js";
import Heart from "../collectible/Heart.js";
import Spike from "../entity/Spike.js";
import Button from "../Button.js";
import Fireballs from "../entity/Utility/fireballs.js";
import { LEVEL_FOLDER, FILE_EXTENSION, START_MENU_FOLDER } from "./Default.js";
import firebase from "./Firebase.js";
import Door from "../Door.js";
/**
 * This class is used to load a level from a json file
 * It contains all the data of the loaded level and the player
 */
class Loader {
   //debug variable
   debug = false;

   //utilitary variables
   #playSound = true;
   #playMusic = false;
   #errors = [];

   //for the game
   #levelName;
   #levelDisplayName;
   #levelAuthor;
   #song;
   #player = null;
   #patrolmen = [];
   #platforms = [];
   #collisionBlocks = [];
   #passageWays = [];
   #collectibles = [];
   #backgroundImage = null;
   #bats = [];
   #spikes = [];
   #doors = [];
   #fireballs = [];
   #connectButton;

   //for the startScreen
   #StartScreenBackground;
   #StartScreenBackgroundImage;
   #CommandBackground;
   #startScreenButton = [];
   // => getter row 98 

   //handler
   handlers = {
      handleClick: (intIndex, event) => {
         this.startScreenButton[intIndex].handleClickEvent(event);
      }
   };

   get debug() { return this.debug; }
   set debug(value) { this.debug = value; }
   /**
    * This function is used to get the errors list of the last loading
    */
   get errors() { return this.#errors; }

   get playSound() { return this.#playSound; }

   set playSound(value) {
      this.#playSound = value;

      this.player.playSound = this.#playSound;
      for (const patrolman of this.patrolmen) {
         patrolman.playSound = this.#playSound;
      }
      for (const bat of this.bats) {
         bat.playSound = this.#playSound;
      }
      for (const collectible of this.collectibles) {
         collectible.playSound = this.#playSound;
      }
   }

   get playMusic() { return this.#playMusic; }

   set playMusic(value) {
      this.#playMusic = value;
      if (this.#playMusic) {
         this.#song.play();
      } else {
         this.#song.pause();
      }
   }

   get levelName() { return this.#levelName; }
   get levelDisplayName() { return this.#levelDisplayName; }
   get levelAuthor() { return this.#levelAuthor; }

   get player() { return this.#player; }
   get fireballs() { return this.#fireballs; }
   set fireballs(value) { this.#fireballs = value; }
   get patrolmen() { return this.#patrolmen; }
   get platforms() { return this.#platforms; }
   get collisionBlocks() { return this.#collisionBlocks; }
   get passageWays() { return this.#passageWays; }
   get bats() { return this.#bats; }
   get collectibles() { return this.#collectibles; }
   get spikes() { return this.#spikes; }
   get connectButton() { return this.#connectButton; }

   /**
    * This function is used to get the song of the current lodaded level
    */
   get song() { return this.#song; }

   /**
    * This function is used to get the background image of the level
    */
   get backgroundImage() { return this.#backgroundImage; }



   //startMenu getters and setter

   get StartScreenBackgroundImage() {
      return this.#StartScreenBackgroundImage;
   }

   get CommandBackground() {
      return this.#CommandBackground;
   }

   get startScreenButton() {
      return this.#startScreenButton;
   }

   set startScreenButton(value) {
      this.#startScreenButton = value;
   }



   loadConnectButton() {
      this.#connectButton = new Button(0, 0, 0, 0, "");
      this.#connectButton.executed_function = () => {
         if (firebase.isUserSignedIn()) {
            console.log("disconnecting");
            firebase.signOut();
         } else {
            console.log("disconnecting");
            firebase.signIn();
            //TODO : reset the current progression and charge the current player state
         }
      }
      this.#connectButton.debug = this.debug;
   }


   /**
    * This function is used to load a level from a json file
    * @param {*} levelname name of the level to load
    * @param {*} debug if true the function will print debug information otherwise it will not
    * @returns true if the level was loaded correctly false otherwise
    */
   loadGame(levelname, debug = false) {
      this.debug = debug;
      this.clean();
      this.loadConnectButton();
      //promise principle
      return new Promise((resolve) => {
         //On cherche le fichier du niveau si il existe
         this.findFile(LEVEL_FOLDER, levelname, FILE_EXTENSION).then((result) => {
            //si le fichier n'existe pas on renvoie false
            if (!result) {
               this.#errors.push(`The level ${levelname}${FILE_EXTENSION} could not be found in the folder ${LEVEL_FOLDER} or the folder does not exist`);
               resolve(false);
            }

            this.debug && console.log(`The level ${levelname} was found`);

            //on charge le niveau
            loaderManager.loadLevelFromJSON(`${LEVEL_FOLDER}${levelname}${FILE_EXTENSION}`, this.debug).then(([Information, player_info_level, objects, ennemies]) => {
               //on set les informations du niveau
               this.setInformation(Information);
               this.setObjects(objects);
               this.setEnnemies(ennemies);


               //declare the function that will be called at the end of the loading
               const finalizeLoading = () => {

                  this.updatePlayer(player_info_level);
                  this.debug && console.log("player is charged");
                  this.errors.size != 0 && this.debug && console.log(this.errors);
                  resolve(true);
               };

               //on charge le joueur si il n'est pas chargé
               this.debug && console.log("Start loading player");
               if (this.player == null || this.player == undefined) {
                  this.debug && console.log("player is empty");
                  loaderManager.loadPlayerFromJSON("assets/jsons/player.json", this.debug).then((player_info_from_json) => {
                     this.setPlayer(player_info_from_json);
                     firebase.getCurrentPlayerState().then((player_info) => {
                        if (player_info != null) {
                           this.debug && console.log(player_info.currentPlayerState);
                           this.debug && console.log(player_info_from_json);
                           this.debug && console.log("player state is charged from firebase");
                           this.#player.updateCurrentState(player_info.currentPlayerState);

                        } else {
                           this.debug && console.log("no player state not exist in firebase");
                        }
                        finalizeLoading();
                     });

                  });

               } else {
                  this.debug && console.log("player is not empty");
                  finalizeLoading();
               }
            });

         });
      });
   }

   loadStartMenu(fileName) {
      this.clean();
      return new Promise((resolve) => {
         //set some constants for the function

         //check if the level exists
         this.findFile(START_MENU_FOLDER, fileName, FILE_EXTENSION).then((result) => {
            if (result) {
               loaderManager.loadStartMenuFromJSON(`${START_MENU_FOLDER}${fileName}${FILE_EXTENSION}`, this.debug).then(([information, objects]) => {

                  this.setStartMenuInformation(information);
                  this.setStartMenuObjects(objects);
                  if (this.errors.size != 0 && this.debug) {
                     console.log(this.errors);
                  }
                  resolve(true);
               });
            } else {
               this.#errors.push(`The Start Screen ${fileName}${StartMenuExtension} could not be found in the folder ${StartMenuFolder} or the folder does not exist`);
               resolve(false);
            }
         });
      });
   }

   /**
    * This function is used to update the player beetwen two level
    * @param {*} player_info a list of information about the player
    */
   updatePlayer(player_info) {
      let playerObject = player_info[0][Player.name];
      this.#player.update(playerObject.x, playerObject.y, playerObject.origin_x, playerObject.origin_y);
   }

   /**
    * This function is used to set the information of the level for exemple the name of the level
    * @param {*} Information a list of information about the level
    */
   setInformation(Information) {
      try {
         const { DisplayName } = Information[0];
         this.#levelDisplayName = DisplayName;
      } catch (e) {
         this.#errors.push(`The import of the level display name failed | ${e.message}`);
      }

      try {
         const { Name } = Information[1];
         this.#levelName = Name;
      } catch (e) {
         this.#errors.push(`The import of the level name failed | ${e.message}`);
      }

      try {
         const { Author } = Information[2];
         this.#levelAuthor = Author;
      } catch (e) {
         this.#errors.push(`The import of the author failed | ${e.message}`);
      }

      try {
         const { path } = Information[3]["Background"];
         this.loadBackground(path);
      } catch (e) {
         this.#errors.push(`The import of the background failed | ${e.message}`);
      }

      try {
         const { path } = Information[4]["Song"];
         this.#song = new Audio(path);
         this.#song.loop = true;
         this.#song.volume = 0.5;
         if (this.playMusic) {
            this.#song.play();
         }
      } catch (e) {
         this.#errors.push(`The import of the song failed | ${e.message}`);
      }
   }


   /**
    * This function is used to set the player a the start of the game
    * @param {*} player_info a list of information about the player
    */
   setPlayer(player_info) {
      let playerObject = player_info[0][Player.name];
      let playertmp;
      try {
         playertmp = new Player(
            playerObject.x,
            playerObject.y,
            playerObject.width,
            playerObject.height,
            playerObject.texturepath,
            playerObject.origin_x,
            playerObject.origin_y,
            playerObject.maxLives,
            playerObject.maxPossibleLives,
            playerObject.maxHealth,
            playerObject.maxPossibleHealth,
            playerObject.speed,
            playerObject.damage,
            playerObject.cooldownTime,
            playerObject.walkSoundPath,
            playerObject.deadSoundPath,
         );
         playertmp.loadTexture();
         this.#player = playertmp;
      } catch (e) {
         this.errors.push("The import of the player failed | " + e.message);
         console.log(e);
      }

      if (this.debug) {
         console.log("dump of the player");
         console.log("player : " + this.player);
      }
      this.#fireballs.push(new Fireballs(0, 0, 24, 24, "assets/sprites/Fireball.png", 5, 1));

   }
   /**
    * This function is used to set the objects in the level
    * @param {*} objectsArray a list of objects in the level
    */
   setObjects(objectsArray) {
      //create the temporary objects
      let platformObject = [];
      let collisionBlockObject = [];
      let passageWaysObject = [];
      let collectibleObject = [];
      let spikeObject = [];

      try {
         for (let i = 0; i < objectsArray.length; i++) {
            const element = objectsArray[i];
            const elementType = Object.keys(element)[0];
            const elementData = element[elementType];

            switch (elementType) {
               case Platform.name:
                  const platform = Object.assign(new Platform(), elementData);
                  platform.loadTexture();
                  platformObject.push(platform);
                  break;

               case ActivationPlatform.name:
                  const activationPlatform = Object.assign(new ActivationPlatform(), elementData);
                  activationPlatform.loadTexture();
                  platformObject.push(activationPlatform);
                  break;

               case MovablePlatform.name:
                  const movablePlatform = new MovablePlatform(
                     elementData.path,
                     elementData.width,
                     elementData.height,
                     elementData.texturepath,
                     elementData.spriteSheetOffsetX,
                     elementData.spriteSheetOffsetY,
                     elementData.spriteSheetWidth,
                     elementData.spriteSheetHeight,
                     elementData.speed,
                  );
                  platformObject.push(movablePlatform);
                  movablePlatform.loadTexture();
                  break;

               case CollisionBlock.name:
                  const collisionBlock = Object.assign(new CollisionBlock(), elementData);
                  collisionBlockObject.push(collisionBlock);
                  break;

               case PassageWay.name:
                  const passageWay = Object.assign(new PassageWay(), elementData);
                  passageWaysObject.push(passageWay);
                  break;

               case Coin.name:
                  const coin = Object.assign(new Coin(), elementData);
                  coin.loadTexture();
                  collectibleObject.push(coin);
                  break;
               case Heart.name:
                  const heart = Object.assign(new Heart(), elementData);
                  heart.loadTexture();
                  collectibleObject.push(heart);
                  break;
               case Spike.name:
                  const spike = Object.assign(new Spike(), elementData);
                  spike.loadTexture();
                  spikeObject.push(spike);
               case Door.name:
                  const door = Object.assign(new Door(), elementData);
                  door.loadTexture();
                  this.#doors.push(door);

               default:
                  this.#errors.push(`Unknown object type: ${elementType}`);
                  break;
            }
         }
      } catch (e) {
         this.#errors.push("The import of the objects failed | " + e.message);

         console.log(e);
      } finally {
         // Set the object arrays to the class properties
         this.#platforms = platformObject;
         this.#collisionBlocks = collisionBlockObject;
         this.#passageWays = passageWaysObject;
         this.#collectibles = collectibleObject;
         this.#spikes = spikeObject;
      }

      //check if there is at least one platform and one collision block in the level
      if (this.platforms.length == 0) {
         this.#errors.push("There is no platform in this level");
      }
      if (this.collisionBlocks.length == 0) {
         this.#errors.push("There is no collision block in this level");
      }
      if (this.debug) {
         console.log("dump of the objects in the level");
         console.log("platforms : " + this.platforms);
         console.log("collisionBlocks : " + this.collisionBlocks);
         console.log("passageWays : " + this.passageWays);
         console.log("collectibles : " + this.collectibles);
         console.log("spikes : " + this.spikes);
         console.log("doors : " + this.doors);
      }
   }
   /**
    * This function is used to set the ennemies in the level
    * @param {*} ennemiesArray a list of ennemies in the level
    */
   setEnnemies(ennemiesArray) {
      // create the temporary object
      let patrolmanObject = [];
      let batObject = [];
      try {
         for (let i = 0; i < ennemiesArray.length; i++) {
            const element = ennemiesArray[i];
            const elementType = Object.keys(element)[0];
            const elementData = element[elementType];

            switch (elementType) {
               case Patrolman.name:
                  const patrolman = Object.assign(new Patrolman(), elementData);
                  patrolman.loadTexture();
                  patrolmanObject.push(patrolman);
                  break;
               case Bat.name:
                  const bat = new Bat(
                     elementData.x,
                     elementData.y,
                     elementData.width,
                     elementData.height,
                     elementData.texturepath,
                     elementData.origin_x,
                     elementData.origin_y,
                     elementData.speed,
                     elementData.damage,
                     elementData.triggerZoneWidth,
                     elementData.triggerZoneHeight,
                     elementData.triggerZoneX,
                     elementData.triggerZoneY,
                     elementData.triggeredMode,
                     elementData.triggerZoneFollow,
                  );

                  bat.loadTexture();

                  batObject.push(bat);

                  break;

               default:
                  this.#errors.push(`Unknown enemy type: ${elementType}`);
                  break;
            }
         }
      } catch (e) {
         this.#errors.push(`The import of the enemies failed | ${e.message}`);
         console.error(e);
      } finally {
         // Set the enemy arrays to the class properties
         this.#patrolmen = patrolmanObject;
         this.#bats = batObject;
      }
      //set the global variable
      this.#patrolmen = patrolmanObject;
      this.#bats = batObject;

      if (this.debug) {
         console.log("dump of the ennemies in the level");
         console.log("patrolmen : " + this.patrolmen.length);
         console.log("bats : " + this.bats.length);
      }
   }

   setStartMenuInformation(information) {

      //console.log(information);
      try {
         this.#StartScreenBackground = information[0].StartScreenBackground;
         this.#CommandBackground = information[0].CommandBackground;

         this.debug && console.log(this.#StartScreenBackground);
         this.debug && console.log(this.#CommandBackground.path);

         this.loadStartScreenBackground(this.#StartScreenBackground.path);
         this.loadCommandBackground(this.#CommandBackground.path);

         this.debug && console.log(this.#StartScreenBackground);
         this.debug && console.log(this.#CommandBackground.path);
      } catch (e) {
         this.#errors.push("The import of the background failed | " + e.message);
      }


   }

   setStartMenuObjects(objectsArray) {

      this.debug && console.log(objectsArray);

      let buttonObject = [];
      try {
         for (let i = 0; i < objectsArray.length; i++) {
            const element = objectsArray[i];
            const elementType = Object.keys(element)[0];
            const elementData = element[elementType];

            switch (elementType) {
               case Button.name:
                  const button = Object.assign(new Button(), elementData);
                  buttonObject.push(button);
                  break;
               default:
                  this.#errors.push(`Unknown startScreen type: ${elementType}`);
                  break;
            }
         }
      } catch (e) {
         this.#errors.push(`The import of the startScreen failed | ${e.message}`);
         console.error(e);
      } finally {
         // set the startScreen object 

         this.#startScreenButton = buttonObject;


      }
   }
   /**
    * This function is used to load the background image only one time when the level is loaded
    */
   loadImage(path) {
      let image = new Image();
      if (path != null) {
         image.src = path;
      } else {
         image = null;
      }
      image.onerror = () => {
         image = null;
         this.#errors.push("The background image could not be found");
      };
      return image;
   }

   loadBackground(path) {
      try {
         this.#backgroundImage = this.loadImage(path);
      } catch (e) {
         this.#backgroundImage = null;
         this.#errors.push(`The import of the background image failed | ${e.message}`);
      }
   }

   loadStartScreenBackground(path) {
      try {
         this.#StartScreenBackgroundImage = this.loadImage(path);

      } catch (e) {
         this.#StartScreenBackgroundImage = null;
         this.#errors.push(`The import of the start background image failed | ${e.message}`);
      }
   }

   loadCommandBackground(path) {
      try {
         this.#CommandBackground = this.loadImage(path);

      } catch (e) {
         this.#CommandBackground = null;
         this.#errors.push(`The import of the command screen image failed | ${e.message}`);
      }
   }

   /**
    * This function is used to find a file in a folder
    * @param {*} folder folder where the file is located exemple : "levels/"
    * @param {*} name name of the file exemple : "level1"
    * @param {*} extension extension of the file exemple : ".json"
    * @returns true if the file is found false otherwise
    */
   findFile(folder, name, extension) {
      return new Promise((resolve, reject) => {
         const xhr = new XMLHttpRequest();
         const fileUrl = `${folder}${name}${extension}`;
         xhr.open('HEAD', fileUrl);
         xhr.onload = function () {
            if (xhr.status === 200) {
               resolve(true);
            } else if (xhr.status === 404) {
               resolve(false);
            } else {
               reject(new Error(`Received unexpected status ${xhr.status}`));
            }
         };
         xhr.onerror = function () {
            reject(new Error("An error occurred while trying to find the file."));
         };
         xhr.send();
      });
   }

   /**
    * This function is used to get the number of ennemies in the level
    */
   get numberOfEnnemies() {
      let numberOfEnnemies = 0;
      this.#patrolmen.forEach(patrolman => {
         if (patrolman.isAlive == true) {
            numberOfEnnemies++;
         }
      });
      this.#bats.forEach(bat => {
         if (bat.isAlive == true) {
            numberOfEnnemies++;
         }
      });

      return numberOfEnnemies;
   }

   setbuttonAction(intIndex, executed_function) {
      this.startScreenButton[intIndex].executed_function = executed_function;
   }

   /**
    * This function is used to reset the loader completely
    */
   reset() {
      this.clean();
      this.#player = null;
   }
   /**
    * This function is used to clean the loader before loading a new level
    */
   clean() {
      // Reset array properties
      this.#errors = [];
      this.#patrolmen = [];
      this.#platforms = [];
      this.#collisionBlocks = [];
      this.#passageWays = [];
      this.#bats = [];
      this.#collectibles = [];

      // Reset other properties
      this.#levelName = null;
      this.#levelAuthor = null;
      this.#backgroundImage = null;
      this.#playSound = null;
      this.#levelDisplayName = null;
      // include other properties you want to clean

      // Pause and reset the song if it exists
      if (this.#song != null) {
         this.#song.pause();
      }
      this.#song = null;
   }
}

export default Loader;