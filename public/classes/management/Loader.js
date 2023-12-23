import loaderManager from "./LoaderManager.js";
import Player from "../entity/Player.js";
import Platform from "../platform/Platform.js";
import ActivationPlatform from "../platform/ActivationPlatform.js";
import MovablePlatform from "../platform/MovablePlatform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../entity/enemy/Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../entity/enemy/Bat.js";
import Coin from "../collectible/Coin.js";
import Heart from "../collectible/Heart.js";
import Spike from "../entity/Spike.js";
import Button from "../ui/Button.js";
import Fireballs from "../entity/Utility/Fireball.js";
import { LEVEL_FOLDER, FILE_EXTENSION, START_MENU_FOLDER, DEFAULT_LEVEL } from "./Default.js";
import firebase from "./Firebase.js";
import Door from "../Door.js";
import Boss from "../entity/boss/Boss.js";
import Hand from "../entity/boss/Hand.js";
import DraggableObject from "../ui/DraggableObject.js";
import DraggableZone from "../ui/DraggableZone.js";
import GameObject from "../GameObject.js";
import EnemyFactory from "./EnemyFactory.js";
import ObjectFactory from "./ObjectFactory.js";
class Loader {
   //#region variables
   //utilitary variables
   #debug = false;
   #playSound = true;
   #playMusic = false;
   #errors = [];

   //variables for the a level
   #backgroundImage = null;
   #connectButton;
   #levelName;
   #levelDisplayName;
   #levelAuthor;
   #song;
   #player = null;
   #patrolmen = [];
   #bats = [];
   #boss = null;
   #spikes = [];
   #platforms = [];
   #collisionBlocks = [];
   #passageWays = [];
   #collectibles = [];
   #doors = [];


   //variables for the start menu
   #mainBackground;
   #skinBackground;

   #startMenuButtons = [];
   #draggableObjects = [];
   #draggableZones = [];
   #currentSkinPreview = null;
   #currentSkinPath = null;
   //#endregion

   //#region getters and setters
   get debug() { return this.#debug; }
   set debug(value) { this.#debug = value; }

   get playMusic() { return this.#playMusic; }
   set playMusic(value) {
      this.#playMusic = value;
      if (this.#playMusic) {
         this.#song.play();
      } else {
         this.#song.pause();
      }
   }

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

   get errors() { return this.#errors; }

   get backgroundImage() { return this.#backgroundImage; }
   get connectButton() { return this.#connectButton; }
   get levelName() { return this.#levelName; }
   get levelDisplayName() { return this.#levelDisplayName; }
   get levelAuthor() { return this.#levelAuthor; }
   get song() { return this.#song; }
   get player() { return this.#player; }
   get patrolmen() { return this.#patrolmen; }
   get bats() { return this.#bats; }
   get boss() { return this.#boss; }
   get spikes() { return this.#spikes; }
   get platforms() { return this.#platforms; }
   get collisionBlocks() { return this.#collisionBlocks; }
   get passageWays() { return this.#passageWays; }
   get collectibles() { return this.#collectibles; }
   get doors() { return this.#doors; }

   get mainBackground() { return this.#mainBackground; }
   get skinBackground() { return this.#skinBackground; }
   get startMenuButtons() { return this.#startMenuButtons; }
   get draggableObjects() { return this.#draggableObjects; }
   get draggableZones() { return this.#draggableZones; }
   get currentSkinPreview() { return this.#currentSkinPreview; }
   set currentSkinPreview(value) { this.#currentSkinPreview = value; }
   get currentSkinPath() { return this.#currentSkinPath; }
   set currentSkinPath(value) { this.#currentSkinPath = value; }
   //#endregion

   //#region load functions
   /**
   * This function is used to load game at a specific level
   * @param {*} levelname name of the level to load
   * @param {*} debug if true the function will print debug information otherwise it will not
   * @returns true if the level was loaded correctly false otherwise
   */
   loadGame(levelname, debug = false) {
      this.debug = debug;
      this.clean();
      return new Promise((resolve) => {
         this.loadLevel(levelname, resolve);
      });
   }

   /**
    * This function is used to load the level passed in parameter
    * @param {*} levelname name of the level to load
    * @param {*} resolve function to call when the level is loaded
    */
   loadLevel(levelname, resolve) {
      this.findFile(LEVEL_FOLDER, levelname, FILE_EXTENSION).then((result) => {
         if (!result) {
            this.#errors.push(`The level ${levelname}${FILE_EXTENSION} could not be found in the folder ${LEVEL_FOLDER} or the folder does not exist`);
            resolve(false);
            return;
         }
         this.debug && console.log(`The level ${levelname} was found`);
         //load the level
         this.loadLevelFromJSON(levelname, resolve);
      });
   }

   loadLevelFromJSON(levelname, resolve) {
      loaderManager.loadLevelFromJSON(`${LEVEL_FOLDER}${levelname}${FILE_EXTENSION}`, this.debug).then(([Information, player_info_level, objects, ennemies]) => {
         this.setInformation(Information);
         this.setObjects(objects);
         this.setEnnemies(ennemies);
         this.finalizeLoading(player_info_level, resolve);
      });
   }
   /**
    * This function is used to finalize the loading of the level
    * @param {*} player_info_level information about the player get from the level json
    * @param {*} resolve  function to call when the level is loaded
    */
   finalizeLoading(player_info_level, resolve) {
      const finalize = () => {
         this.updatePlayer(player_info_level);
         this.debug && console.log("player is charged");
         this.errors.size != 0 && this.debug && console.log(this.errors);
         resolve(true);
      };

      this.debug && console.log("Start loading player");
      if (this.player == null || this.player == undefined) {
         this.loadPlayerFromJSON(finalize);
      } else {
         this.debug && console.log("player is not empty");
         finalize();
      }
   }

   /**
    * This function is used to load the player from the json file if the player is not already loaded
    * @param {*} finalize function to call when the player is loaded
    */
   loadPlayerFromJSON(finalize) {
      this.debug && console.log("player is empty");
      loaderManager.loadPlayerFromJSON("assets/jsons/player.json", this.debug).then((player_info_from_json) => {
         //set the player
         this.setPlayer(player_info_from_json);
         //test if the player is connected if yes load the player state from firebase
         this.updatePlayerStateFromFirebase(finalize);
      });
   }

   /**
    * This function is used to load the player state from firebase and update the player
    * @param {*} finalize function to call when the player state is loaded
    */
   updatePlayerStateFromFirebase(finalize) {
      firebase.getCurrentPlayerState().then((player_info) => {
         if (player_info != null) {
            this.debug && console.log(player_info.currentPlayerState);
            this.debug && console.log("player state is charged from firebase");
            this.#player.updateCurrentState(player_info.currentPlayerState);
         } else {
            this.debug && console.log("no player state not exist in firebase");
         }
         finalize();
      });
   }

   /**
    * This function is used to load the start menu
    * @param {*} fileName name of the start menu file to load
    * @returns true if the start menu was loaded correctly false otherwise
    */
   loadStartMenu(fileName) {
      this.clean();
      this.loadConnectButton();
      return new Promise((resolve) => {
         this.checkStartMenuFile(fileName, resolve);
      });
   }

   /**
    * This function is used to check if the start menu file exist
    * @param {*} fileName name of the start menu file to load
    * @param {*} resolve function to call when the start menu is loaded
    */
   checkStartMenuFile(fileName, resolve) {
      this.findFile(START_MENU_FOLDER, fileName, FILE_EXTENSION).then((result) => {
         if (result) {
            this.loadStartMenuFromJSON(fileName, resolve);
         } else {
            this.#errors.push(`The Start Screen ${fileName}${StartMenuExtension} could not be found in the folder ${StartMenuFolder} or the folder does not exist`);
            resolve(false);
         }
      });
   }

   /**
    * This function is used to load the start menu from the json file
    * @param {*} fileName name of the start menu file to load
    * @param {*} resolve function to call when the start menu is loaded
    */
   loadStartMenuFromJSON(fileName, resolve) {
      loaderManager.loadStartMenuFromJSON(`${START_MENU_FOLDER}${fileName}${FILE_EXTENSION}`, this.debug).then(([information, objects]) => {
         this.setStartBackground(information);
         this.setStartMenuObjects(objects);
         if (this.errors.size != 0 && this.debug) {
            console.log(this.errors);
         }
         resolve(true);
      });
   }

   loadConnectButton() {
      this.#connectButton = new Button(0, 0, 0, 0, "");
      this.#connectButton.executed_function = () => {


         if (firebase.isUserSignedIn()) {
            this.#connectButton.isAlive = false;
            console.log("disconnecting");
            firebase.signOut();
         } else {
            console.log("connecting");
            this.#connectButton.isAlive = false;
            firebase.signIn().then(() => {
               this.askForGeolocalisation();
            });
            //TODO : reset the current progression and charge the current player state
            //OR : add a modal to ask the user if he wants to reset his progression
         }

      }
      this.#connectButton.debug = this.debug;
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
         this.#mainBackground = this.loadImage(path);

      } catch (e) {
         this.#mainBackground = null;
         this.#errors.push(`The import of the start background image failed | ${e.message}`);
      }
   }

   loadCommandBackground(path) {
      try {
         this.#skinBackground = this.loadImage(path);

      } catch (e) {
         this.#skinBackground = null;
         this.#errors.push(`The import of the command screen image failed | ${e.message}`);
      }
   }
   //#endregion

   //#region update functions
   /**
    * This function is used to update the player beetwen two level
    * @param {*} player_info a list of information about the player
    */
   updatePlayer(player_info) {
      let playerObject = player_info[0][Player.name];
      this.#player.update(playerObject.x, playerObject.y, playerObject.origin_x, playerObject.origin_y);
      if (firebase.isUserSignedIn()) {
         firebase.getPlayerSkinPath().then((skinpath) => {
            console.log(skinpath);
            if (skinpath != null || skinpath != undefined) {
               this.#player.texturepath = skinpath;
               this.#player.loadTexture();
            } else {
               this.#player.texturepath = this.#currentSkinPath;
               this.#player.loadTexture();

            }
         });

      } else {
         this.#player.texturepath = this.#currentSkinPath;
         this.#player.loadTexture();
      }
   }

   //#endregion

   //#region set functions
   /**
   * This function is used to set the information of the level for exemple the name of the level
   * @param {*} Information a list of information about the level
   */
   setInformation(Information) {
      function TestImport(argument, errorMessage) {
         try {
            argument();
         } catch (e) {
            this.#errors.push(`${errorMessage} | ${e.message}`);
         }
      }

      TestImport(() => this.#levelDisplayName = Information[0].DisplayName, 'The import of the level display name failed');
      TestImport(() => this.#levelName = Information[1].Name, 'The import of the level name failed');
      TestImport(() => this.#levelAuthor = Information[2].Author, 'The import of the author failed');
      TestImport(() => this.loadBackground(Information[3]["Background"].path), 'The import of the background failed');
      TestImport(() => {
         const { path } = Information[4]["Song"];
         this.#song = new Audio(path);
         this.#song.loop = true;
         this.#song.volume = 1;
         if (this.playMusic) {
            this.#song.play();
         }
      }, 'The import of the song failed');
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
         if (this.#currentSkinPath == null) {
            this.#currentSkinPath = playerObject.texturepath;
         }
         let fireballObject = player_info[1][Fireballs.name];
         playertmp.defaultFireball = fireballObject;
         this.#player = playertmp;
      } catch (e) {
         this.errors.push("The import of the player failed | " + e.message);
         console.log(e);
      }

      if (this.debug) {
         console.log("dump of the player");
         console.log("player : " + this.player);
      }

   }
   /**
    * This function is used to set the objects in the level
    * @param {*} objectsArray a list of objects in the level
    */
   setObjects(objectsArray) {
      const factory = new ObjectFactory();

      let platformObject = [];
      let collisionBlockObject = [];
      let passageWayObject = [];
      let collectibleObject = [];
      let spikeObject = [];
      let doorObject = [];

      try {
         for (let i = 0; i < objectsArray.length; i++) {
            const element = objectsArray[i];
            const elementType = Object.keys(element)[0];
            const elementData = element[elementType];

            const object = factory.createObject(elementType, elementData);

            switch (elementType) {
               case Platform.name:
                  platformObject.push(object);
                  break;
               case ActivationPlatform.name:
                  platformObject.push(object);
                  break;
               case MovablePlatform.name:
                  platformObject.push(object);
                  break;
               case CollisionBlock.name:
                  collisionBlockObject.push(object);
                  break;
               case PassageWay.name:
                  passageWayObject.push(object);
                  break;
               case Coin.name:
                  collectibleObject.push(object);
                  break;
               case Heart.name:
                  collectibleObject.push(object);
                  break;
               case Spike.name:
                  spikeObject.push(object);
                  break;
               case Door.name:
                  doorObject.push(object);
                  break;
               default:
                  throw new Error(`Unknown enemy type: ${elementType}`);
            }
         }
      } catch (e) {
         this.#errors.push(`The import of the enemies failed | ${e.message}`);
         console.error(e);
      } finally {
         this.#platforms = platformObject;
         this.#collisionBlocks = collisionBlockObject;
         this.#passageWays = passageWayObject;
         this.#collectibles = collectibleObject;
         this.#spikes = spikeObject;
         this.#doors = doorObject;
      }

      // Check if there is at least one collision block in the level (otherwise the player will fall forever)
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
      const factory = new EnemyFactory();

      let patrolmanObject = [];
      let batObject = [];
      let bossObject = null;
      let handObject = [];

      try {
         for (let i = 0; i < ennemiesArray.length; i++) {
            const element = ennemiesArray[i];
            const elementType = Object.keys(element)[0];
            const elementData = element[elementType];

            const enemy = factory.createEnemy(elementType, elementData);

            switch (elementType) {
               case Patrolman.name:
                  patrolmanObject.push(enemy);
                  break;
               case Bat.name:
                  batObject.push(enemy);
                  break;
               case Boss.name:
                  bossObject = enemy;
                  break;
               case Hand.name:
                  handObject.push(enemy);
                  if (elementData.right === true) {
                     bossObject.handRight = enemy;
                  } else {
                     bossObject.handLeft = enemy;
                  }
                  break;
               default:
                  throw new Error(`Unknown enemy type: ${elementType}`);
            }
         }
      } catch (e) {
         this.#errors.push(`The import of the enemies failed | ${e.message}`);
         console.error(e);
      } finally {
         this.#patrolmen = patrolmanObject;
         this.#bats = batObject;
         this.#boss = bossObject;
      }

      if (this.debug) {
         console.log("dump of the ennemies in the level");
         console.log("patrolmen : " + this.patrolmen);
         console.log("bats : " + this.bats);
         console.log("boss : " + this.boss);
      }
   }

   /**
    * 
    * @param {*} backgroundArray list of i
    */
   setStartBackground(backgroundArray) {

      //console.log(information);
      try {

         this.debug && console.log(backgroundArray[0].mainBackground.path);
         this.debug && console.log(backgroundArray[1].skinBackground.path);

         this.loadStartScreenBackground(backgroundArray[0].mainBackground.path);
         this.loadCommandBackground(backgroundArray[1].skinBackground.path);

      } catch (e) {
         this.#errors.push("The import of the background failed | " + e.message);
      }


   }

   setStartMenuObjects(objectsArray) {
      this.debug && console.log(objectsArray);

      let buttonObjects = [];
      let draggableObjects = [];
      let draggableZones = [];
      let currentSkinPreview = null;
      try {
         for (let i = 0; i < objectsArray.length; i++) {
            const element = objectsArray[i];
            const elementType = Object.keys(element)[0];
            const elementData = element[elementType];

            switch (elementType) {
               case Button.name:
                  const button = Object.assign(new Button(), elementData);
                  buttonObjects.push(button);
                  break;
               case DraggableObject.name:
                  const draggableObject = Object.assign(new DraggableObject(), elementData);
                  draggableObject.loadTexture();
                  draggableObjects.push(draggableObject);
                  break;
               case DraggableZone.name:
                  const draggableZone = Object.assign(new DraggableZone(), elementData);
                  draggableZones.push(draggableZone);
                  break;
               case GameObject.name:
                  const gameObject = Object.assign(new GameObject(), elementData);
                  currentSkinPreview = gameObject;
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
         this.#startMenuButtons = buttonObjects;
         this.#draggableObjects = draggableObjects;
         this.#draggableZones = draggableZones;
         this.#currentSkinPreview = currentSkinPreview;

         currentSkinPreview.texturepath = this.#draggableObjects[0].texturepath;
         currentSkinPreview.loadTexture();


      }
   }

   setbuttonAction(intIndex, executed_function) {
      this.#startMenuButtons[intIndex].executed_function = executed_function;
   }
   //#endregion

   //#region utilitary functions
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
      this.#boss = null;
      this.#doors = [];

      // Reset other properties
      this.#levelName = null;
      this.#levelAuthor = null;
      this.#backgroundImage = null;
      this.#playSound = null;
      this.#levelDisplayName = null;

      if (this.#song != null) {
         this.#song.pause();
      }
      
      this.#song = null;
   }


   // Geolocation
   askForGeolocalisation() {
      if (firebase.isUserSignedIn()) {
         navigator.geolocation.getCurrentPosition((position) => {
            if (this.debug) {
               console.log("geolocation allowed");
               console.log(position);
            }
            firebase.updateLocation(position);
         }, (error) => {
            if (error.code === error.PERMISSION_DENIED && this.debug) {
               console.log("geolocation denied");
            }
         });
      }
   }

   //#endregion
}

export default Loader;