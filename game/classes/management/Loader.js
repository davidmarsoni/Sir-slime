import loaderManager from "../management/LoaderManager.js";
import Player from "../entity/Player.js";
import Platform from "../Platform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../entity/ennemy/Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../entity/ennemy/Bat.js";
import Collectible from "../collactiables/Collectible.js";
import Coin from "../collactiables/Coin.js";
import Heart from "../collactiables/Heart.js";

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
    #backgroundStartScreen;
    #backgroundStartScreenImage;

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

    get backgroundStartScreenImage(){
    return this.#backgroundStartScreenImage
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
            //set some constants for the function
            const levelFolder = "./assets/levels/";
            const levelExtension = ".json";

            //check if the level exists
            this.findFile(levelFolder, levelname, levelExtension).then((result) => {
                if (result) {
                    debug ? console.log("The level " + levelname + " was found") : null;
                    //Load the level
                    loaderManager.loadLevelFromJSON(levelFolder + levelname + levelExtension, debug).then(([Information, player_info_level, objects, ennemies] )=>{
                        this.setInformation(Information);
                        this.setObjects(objects,debug);
                        this.setEnnemies(ennemies,debug);
                        
                        if (this.player == null || this.player == undefined || this.player == []) {
                            debug ? console.log("player is empty") : null;
                            //load the player if it is not already loaded to keep is state between level
                            loaderManager.loadPlayerFromJSON("./assets/jsons/player.json", debug).then((player_info) => {
                                this.setPlayer(player_info);
                                this.updatePlayer(player_info_level);
                                this.errors.size != 0 && debug ? console.log(this.errors) : null;
                                resolve(true);
                            });
                        } else {
                            debug ? console.log("player is not empty") : null;
                            this.updatePlayer(player_info_level);
                            this.errors.size != 0 && debug ? console.log(this.errors) : null;
                            resolve(true);
                        }
                    });
                } else {
                    this.#errors.push("The level " + levelname + levelExtension + " could not be found in the folder " + levelFolder + " or the folder does not exist");
                    resolve(false);
                }
            });
       })
    }

    loadStartScreen(fileName, debug = false) {
        this.clean();
        return new Promise((resolve) => {
            //set some constants for the function
            const StartScreenFolder = "./assets/jsons/";
            const StartScreenExtension = ".json";

            //check if the level exists
            this.findFile(StartScreenFolder, fileName, StartScreenExtension).then((result) => {
                if (result) {
                    loaderManager.loadStartScreenFromJSON(StartScreenFolder + fileName + StartScreenExtension, debug).then((startScreen_info) => {
                        this.setStartScreenInfo(startScreen_info);
                        this.errors.size != 0 && debug ? console.log(this.errors) : null;
                    resolve(true);
                    });
                } else {
                    this.#errors.push("The Start Screen " + fileName + StartScreenExtension + " could not be found in the folder " + StartScreenFolder + " or the folder does not exist");
                    resolve(false);
                }
            });
       })
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
        try {
            this.#levelName = Information[0]["Name"];
        }
        catch (e) {
            this.#errors.push("The import of the level name failed |" + e.message);
        }

        try {
            this.#levelAuthor = Information[1]["Author"];
        } catch (e) {
            this.#errors.push("The import of the author failed | " + e.message);
        }
        try {
            this.loadBackground(Information[2]["Background"].path);
        } catch (e) {
            this.#errors.push("The import of the background failed | " + e.message);
        }

        try {
            this.#song = new Audio(Information[3]["Song"].path);
            this.#song.loop = true;
            this.#song.volume = 0.5;
            if(this.playMusic){
                this.#song.play();
            }
        } catch (e) {
            this.#errors.push("The import of the song failed | " + e.message);
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
                if(element[Platform.name]){
                    const platform = new Platform(
                        element[Platform.name].x,
                        element[Platform.name].y,
                        element[Platform.name].width,
                        element[Platform.name].height,
                        element[Platform.name].texturepath,
                        element[Platform.name].spriteSheetOffsetX,
                        element[Platform.name].spriteSheetOffsetY,
                        element[Platform.name].spriteSheetWidth,
                        element[Platform.name].spriteSheetHeight
                        );
                    platformObject.push(platform);
                }
                if(element[CollisionBlock.name]){
                    const collisionBlock = new CollisionBlock(
                        element[CollisionBlock.name].x,
                        element[CollisionBlock.name].y,
                        element[CollisionBlock.name].width,
                        element[CollisionBlock.name].height,
                        element[CollisionBlock.name].collisionSide
                        );
                    collisionBlockObject.push(collisionBlock);
                }
                if(element[PassageWay.name]){
                    const passageWay = new PassageWay(
                        element[PassageWay.name].x,
                        element[PassageWay.name].y,
                        element[PassageWay.name].width,
                        element[PassageWay.name].height,
                        element[PassageWay.name].passageWayTo
                        );
                    passageWaysObject.push(passageWay);
                }
                if(element[Coin.name]){
                    const collectible = new Coin(
                        element[Coin.name].x,
                        element[Coin.name].y,
                        element[Coin.name].width,
                        element[Coin.name].height,
                        element[Coin.name].texturepath,
                        element[Coin.name].spriteSheetOffsetX,
                        element[Coin.name].value,
                        element[Coin.name].sound
                        );
                    collectibleObject.push(collectible);
                }
                if(element[Heart.name]){
                    const collectible = new Heart(
                        element[Heart.name].x,
                        element[Heart.name].y,
                        element[Heart.name].width,
                        element[Heart.name].height,
                        element[Heart.name].texturepath,
                        element[Heart.name].spriteSheetOffsetX,
                        element[Heart.name].heal,
                        element[Heart.name].hearthGain,
                        element[Heart.name].sound
                        );
                    collectibleObject.push(collectible);
                }
            }
        } catch (e) {
            this.#errors.push("The import of the objects failed | " + e.message);
            console.log(e);
        }

        
        //set the global variables
        this.#platforms = platformObject;
        this.#collisionBlocks = collisionBlockObject;
        this.#passageWays = passageWaysObject;
        this.#collectibles = collectibleObject;

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
                if(element[Patrolman.name]){
                    const patrolman = new Patrolman(
                        element[Patrolman.name].x,
                        element[Patrolman.name].y,
                        element[Patrolman.name].width,
                        element[Patrolman.name].height,
                        element[Patrolman.name].texturepath,
                        element[Patrolman.name].origin_x,
                        element[Patrolman.name].origin_y,
                        element[Patrolman.name].path,
                        element[Patrolman.name].speed,
                        element[Patrolman.name].damage
                    );
                    patrolmanObject.push(patrolman);
                }

                if(element[Bat.name]){
                    const bat = new Bat(
                        element[Bat.name].x,
                        element[Bat.name].y,
                        element[Bat.name].width,
                        element[Bat.name].height,
                        element[Bat.name].texturepath,
                        element[Bat.name].origin_x,
                        element[Bat.name].origin_y,
                        element[Bat.name].speed,
                        element[Bat.name].damage,
                        element[Bat.name].triggerZone
                    );
                    batObject.push(bat);
                }
            }
        } catch (e) {
            this.#errors.push("The import of the ennemies failed | " + e.message);
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

    setStartScreenInfo(startScreenArray){
        try {
            this.#backgroundStartScreen = startScreenArray[0]["Background"];
            this.loadBackground();
        } catch (e) {
            this.#errors.push("The import of the background failed | " + e.message);
        }
        this.loadBackgroundStartScreen();

    }

    /**
     * This function is used to load the background image only one time when the level is loaded
     */
    loadBackground(path){
        try {
            this.#backgroundImage = new Image();
            if(path != null){
                this.#backgroundImage.src = path;
            }else{
                this.#backgroundImage = null;
            }
            this.#backgroundImage.onerror = () => {
                this.#backgroundImage = null;
                this.#errors.push("The background image could not be found");
            };
        } catch (e) {
            this.#backgroundImage = null;
            this.#errors.push("The import of the background image failed | " + e.message);
        }
    }

    loadBackgroundStartScreen(){
        try {
            this.#backgroundStartScreenImage = new Image();
            if(this.#backgroundStartScreen.path != null)
            {
                this.#backgroundStartScreenImage.src = this.#backgroundStartScreen.path;
            }else{
                this.#backgroundStartScreenImage = null;
            }
            this.#backgroundStartScreenImage.onerror = () => {
                this.#backgroundStartScreenImage = null;
                this.#errors.push("The background image could not be found");
            };
        } catch (e) {
            this.#backgroundStartScreenImage = null;
            this.#errors.push("The import of the background image failed | " + e.message);
        }
    }

    /**
     * This function is used to find a file in a folder
     * @param {*} folder folder where the file is located exemple : "./levels/"
     * @param {*} name name of the file exemple : "level1"
     * @param {*} extension extension of the file exemple : ".json"
     * @returns true if the file is found false otherwise
     */
    findFile(folder, name, extension) {
        //create a promise to return the result only when the process is finished
        return new Promise((resolve, reject) => {
            //create a list of all the files in the folder
            let fileList = [];
            const xhr = new XMLHttpRequest();
            xhr.open('GET', folder);
            xhr.onload = function () {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
                const links = htmlDoc.getElementsByTagName('a');
                //create a list of all the files in the folder
                for (let i = 0; i < links.length; i++) {
                    const fileName = links[i].getAttribute('href');
                    if (fileName.endsWith(extension)) {
                        const filename = fileName.slice(0, -5);
                        fileList.push(filename);
                    }
                }
                //check if the file is in the list
                if (fileList.includes(name)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            // error handling
            xhr.onerror = function () {
                reject(new Error("An error occurred while trying to find the file."));
            };
            // send request
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
    clean(){
        this.#errors = [];
        this.#levelName = null;
        this.#levelAuthor = null;
        this.#patrolmen = [];
        this.#platforms = [];
        this.#collisionBlocks = [];
        this.#passageWays = [];
        this.#backgroundImage = null;
        this.#bats = [];
        this.#collectibles = [];
        if(this.#song != null){
            this.#song.pause();
        }
        this.#song = null;
    }
}

export default Loader;