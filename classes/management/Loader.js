import loaderManager from "./LoaderManager.js";
import Player from "../entity/Player.js";
import Platform from "../Platform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../entity/ennemy/Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../entity/ennemy/Bat.js";
import Collectible from "../collectibles/Collectible.js";
import Coin from "../collectibles/Coin.js";
import Heart from "../collectibles/Heart.js";
import ActivationPlatform from "../ActivationPlatform.js";
import Button from "../Button.js";

/**
 * This class is used to load a level from a json file
 * It contains all the data of the loaded level and the player
 */
class Loader{
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

    //for the startScreen
    #StartScreenBackground;
    #StartScreenBackgroundImage;
    #CommandBackground;
    #startScreenButton = [];
    // => getter row 98 

    /**
     * This function is used to get the errors list of the last loading
     */
    get errors() {return this.#errors;}
    
    get playSound() {return this.#playSound;}

    set playSound(value) {
        this.#playSound = value;

        this.player.playSound =  this.#playSound;
        for (const patrolman of this.patrolmen) {
            patrolman.playSound = this.#playSound;
        }
        for (const bat of this.bats) {
            bat.playSound =  this.#playSound;
        }
        for (const collectible of this.collectibles) {
            collectible.playSound =  this.#playSound;
        }
       
    }

    get playMusic() {return this.#playMusic;}
    
    set playMusic(value) {
        this.#playMusic = value;
        if(this.#playMusic){
            this.#song.play();
        }else{
            this.#song.pause();
        }
    }
    
    get levelName() { return this.#levelName;}
    get levelDisplayName() { return this.#levelDisplayName;}
    get levelAuthor() { return this.#levelAuthor;}

    get player() { return this.#player;}
    get patrolmen() { return this.#patrolmen;}
    get platforms() { return this.#platforms;}
    get collisionBlocks() { return this.#collisionBlocks; }
    get passageWays() { return this.#passageWays;}
    get bats() { return this.#bats;}
    get collectibles() { return this.#collectibles;}

    /**
     * This function is used to get the song of the current lodaded level
     */
    get song() {return this.#song;}

    /**
     * This function is used to get the background image of the level
     */
    get backgroundImage() {return this.#backgroundImage;}


    //startGame getters

    get StartScreenBackgroundImage(){
    return this.#StartScreenBackgroundImage;
    }

    get CommandBackground(){
        return this.#CommandBackground;
    } 
    
    get startScreenButton(){
        return this.#startScreenButton;
    }

    set startScreenButton(value){
        this.#startScreenButton = value;
    }


    /**
     * This function is used to load a level from a json file
     * @param {*} levelname name of the level to load
     * @param {*} debug if true the function will print debug information otherwise it will not
     * @returns true if the level was loaded correctly false otherwise
     */
    loadGame(levelname, debug = false) {
        this.clean();
        return new Promise((resolve) => {
            const levelFolder = "assets/levels/";
            const levelExtension = ".json";

            this.findFile(levelFolder, levelname, levelExtension).then((result) => {
                if (result) {
                    debug && console.log(`The level ${levelname} was found`);
                    loaderManager.loadLevelFromJSON(`${levelFolder}${levelname}${levelExtension}`, debug).then(([Information, player_info_level, objects, ennemies]) => {
                        this.setInformation(Information);
                        this.setObjects(objects, debug);
                        this.setEnnemies(ennemies, debug);

                        const finalizeLoading = () => {
                            this.updatePlayer(player_info_level);
                            if (this.errors.size != 0 && debug) {
                                console.log(this.errors);
                            }
                            resolve(true);
                        };

                        if (this.player == null || this.player == undefined) {
                            debug && console.log("player is empty");
                            loaderManager.loadPlayerFromJSON("assets/jsons/player.json", debug).then((player_info) => {
                                this.setPlayer(player_info);
                                finalizeLoading();
                            });
                        } else {
                            debug && console.log("player is not empty");
                            finalizeLoading();
                        }
                    });
                } else {
                    this.#errors.push(`The level ${levelname}${levelExtension} could not be found in the folder ${levelFolder} or the folder does not exist`);
                    resolve(false);
                }
            });
        });
    }

    loadStartMenu(fileName, debug = false) {
        this.clean();
        return new Promise((resolve) => {
            //set some constants for the function
            const StartMenuFolder = "assets/jsons/";
            const StartMenuExtension = ".json";

            //check if the level exists
            this.findFile(StartMenuFolder, fileName, StartMenuExtension).then((result) => {
                if (result) {
                    loaderManager.loadStartMenuFromJSON(`${StartMenuFolder}${fileName}${StartMenuExtension}`, debug).then(([information,objects]) => {
                       
                        this.setStartMenuInformation(information,debug);
                        this.setStartMenuObjects(objects, debug);
                        if (this.errors.size != 0 && debug) {
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
    updatePlayer(player_info){
        let playerObject = player_info[0][Player.name];
        this.#player.update(playerObject.x, playerObject.y, playerObject.origin_x, playerObject.origin_y);
    }

    /**
     * This function is used to set the information of the level for exemple the name of the level
     * @param {*} Information a list of information about the level
     */
    setInformation(Information){
        try  {
            const { DisplayName } = Information[0];
            this.#levelDisplayName = DisplayName;
        }catch (e) {
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
            if(this.playMusic){
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
     setPlayer(player_info,debug = false) {
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
                playerObject.damag,
                playerObject.walkSoundPath,
                playerObject.deadSoundPath,
            );
            this.#player = playertmp;
        } catch (e) {
            this.errors.push("The import of the player failed | " + e.message);
            console.log(e);
        }

        if(debug){
            console.log("dump of the player");
            console.log("player : "+this.player);
        }
            

    }
    /**
     * This function is used to set the objects in the level
     * @param {*} objectsArray a list of objects in the level
     */
    setObjects(objectsArray,debug = false) {
        //create the temporary objects
        let platformObject = [];
        let collisionBlockObject = [];
        let passageWaysObject = [];
        let collectibleObject = [];

        try {
            for (let i = 0; i < objectsArray.length; i++) {
                const element = objectsArray[i];
                const elementType = Object.keys(element)[0];
                const elementData = element[elementType];
    
                switch (elementType) {
                    case Platform.name:
                        const platform = new Platform(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.texturepath,
                            elementData.spriteSheetOffsetX,
                            elementData.spriteSheetOffsetY,
                            elementData.spriteSheetWidth,
                            elementData.spriteSheetHeight
                        );
                        platformObject.push(platform);
                        break;
    
                    case ActivationPlatform.name:
                        const activationPlatform = new ActivationPlatform(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.texturepath,
                            elementData.spriteSheetOffsetX,
                            elementData.spriteSheetOffsetY,
                            elementData.spriteSheetWidth,
                            elementData.spriteSheetHeight,
                            elementData.triggerZoneX,
                            elementData.triggerZoneY,
                            elementData.activationTimer
                        );
                        platformObject.push(activationPlatform);
                        break;
    
                    case CollisionBlock.name:
                        const collisionBlock = new CollisionBlock(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.collisionSide
                        );
                        collisionBlockObject.push(collisionBlock);
                        break;
    
                    case PassageWay.name:
                        const passageWay = new PassageWay(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.passageWayTo
                        );
                        passageWaysObject.push(passageWay);
                        break;
    
                    case Coin.name:
                        const coin = new Coin(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.texturepath,
                            elementData.spriteSheetOffsetX,
                            elementData.value,
                            elementData.sound
                        );
                        collectibleObject.push(coin);
                        break;
    
                    case Heart.name:
                        const heart = new Heart(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.texturepath,
                            elementData.spriteSheetOffsetX,
                            elementData.heal,
                            elementData.heart_gain,
                            elementData.sound
                        );
                        collectibleObject.push(heart);
                        break;
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
        }

        //check if there is at least one platform and one collision block in the level
        if(this.platforms.length == 0){
            this.#errors.push("There is no platform in this level");
        }
        if(this.collisionBlocks.length == 0){
            this.#errors.push("There is no collision block in this level");
        }

        if(debug){
            console.log("dump of the objects in the level");
            console.log("platforms : "+this.platforms.length);
            console.log("collisionBlocks : "+this.collisionBlocks.length);
            console.log("passageWays : "+this.passageWays.length);
            console.log("collectibles : "+this.collectibles.length);
        }
    }
    /**
     * This function is used to set the ennemies in the level
     * @param {*} ennemiesArray a list of ennemies in the level
     */
    setEnnemies(ennemiesArray,debug = false) {
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
                        const patrolman = new Patrolman(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.texturepath,
                            elementData.origin_x,
                            elementData.origin_y,
                            elementData.path,
                            elementData.speed,
                            elementData.damage
                        );
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
                            elementData.triggerZone
                        );
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

        if(debug){
            console.log("dump of the ennemies in the level");
            console.log("patrolmen : "+this.patrolmen.length);
            console.log("bats : "+this.bats.length);
        }
    }

    setStartMenuInformation(information, debug = false){
        
         //console.log(information);
        try {
            this.#StartScreenBackground = information[0].StartScreenBackground;
            this.#CommandBackground = information[0].CommandBackground;

            debug ? console.log(this.#StartScreenBackground) : null;
            debug ? console.log(this.#CommandBackground.path) : null;
            
            this.loadStartScreenBackground(this.#StartScreenBackground.path);
            this.loadCommandBackground(this.#CommandBackground.path);
            
            debug ? console.log(this.#StartScreenBackground) : null;
            debug ? console.log(this.#CommandBackground.path) : null;
        } catch (e) {
            this.#errors.push("The import of the background failed | " + e.message);
        }
        

    }

    setStartMenuObjects(objectsArray,debug = false){
        //TODO : code for the start screen objects

        debug ? console.log(objectsArray) : null;

        let buttonObject = [];
        try {
            for (let i = 0; i < objectsArray.length; i++) {
                const element = objectsArray[i];
                const elementType = Object.keys(element)[0];
                const elementData = element[elementType];

                switch (elementType) {
                    case Button.name:
                        const button = new Button(
                            elementData.x,
                            elementData.y,
                            elementData.width,
                            elementData.height,
                            elementData.screen
                           
                        );
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
        console.log(path);
        let image = new Image();
        if (path != null) {
            image.src = path;
        } else {
            console.log(image);
            image = null;
        }
        image.onerror = () => {
            console.log(image);
            this.#errors.push("The background image could not be found");
            return image;
        };
      
        return image;
        
    }

    loadBackground(path) {
        try {
            this.#backgroundImage = this.loadImage(path);
        } catch (e) {
            this.#backgroundImage = null
            this.#errors.push(`The import of the background image failed | ${e.message}`);
        }
    }

   loadStartScreenBackground(path) {
        console.log(path);
        try {
            this.#StartScreenBackgroundImage = this.loadImage(path);
           
        } catch (e) {
            this.#StartScreenBackgroundImage = null;
            this.#errors.push(`The import of the start background image failed | ${e.message}`);
        }
    }

    loadCommandBackground(path){
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
    get numberOfEnnemies(){
        let numberOfEnnemies = 0;
        this.#patrolmen.forEach(patrolman => {
            if(patrolman.isAlive == true){
                numberOfEnnemies++;
            }
        });
        this.#bats.forEach(bat => {
            if(bat.isAlive == true){
                numberOfEnnemies++;
            }
        });
        
        return numberOfEnnemies;
    }

    /**
     * This function is used to reset the loader completely
     */
    reset(){
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

        // Pause and reset the song if it exists
        if (this.#song != null) {
            this.#song.pause();
        }
        this.#song = null;
    }

    setbuttonAction(intIndex, executed_function){

        this.startScreenButton[intIndex].executed_function = executed_function;

    
        let canvas = document.getElementById("canvas");

        canvas.addEventListener('click', (event) => {
           
            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        
            this.startScreenButton[intIndex].handleClickEvent(event);
        });

    }
}

export default Loader;