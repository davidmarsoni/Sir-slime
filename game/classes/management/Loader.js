import {loadLevelFromJSON,loadPlayerFromJSON} from "./LoaderManager.js";
import Player from "../Player.js";
import Weapon from "../Weapon.js";
import Platform from "../Platform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../Patrolman.js";
import PassageWay from "../PassageWay.js";

/**
 * This class is used to load a level from a json file
 * It contains all the data of the loaded level and the player
 */
class Loader{
    #errors = [];
    #levelName;
    #levelAuthor;
    #background;
    #music;
    #player = null;
    #patrolmen = [];
    #platforms = [];
    #collisionBlocks = [];
    #passageWays = [];
    #backgroundImage = null;
  
    get levelName() {
        return this.#levelName;
    }
    
    get levelAuthor() {
        return this.#levelAuthor;
    }

    get background() {
        return this.#background;
    }

    get music() {
        return this.#music;
    }

    get player() {
        return this.#player;
    }

    get patrolmen() {
        return this.#patrolmen;
    }

    get platforms() {
        return this.#platforms;
    }

    get collisionBlocks() {
        return this.#collisionBlocks;
    }

    get passageWays() {
        return this.#passageWays;
    }

    get errors() {
        return this.#errors;
    }


    get backgroundImage() {
        return this.#backgroundImage;
    }

    load(levelname, debug = false) {
        return new Promise((resolve) => {
            const levelFolder = "./levels/";
            const levelExtension = ".json";
            let levelFound = false;
            this.#errors = [];
            this.findFile(levelFolder, levelname, levelExtension).then((result) => {
                if (result) {
                    debug ? console.log("The level " + levelname + " was found") : null;
                    loadLevelFromJSON(levelFolder + levelname + levelExtension, debug).then(([Information, player_info, objects, ennemies] )=>{
                        this.setInformation(Information);
                        this.setObjects(objects);
                        this.setEnnemies(ennemies);
                        if (this.player == null) {
                            debug ? console.log("player is empty") : null;
                            loadPlayerFromJSON("jsons/player.json", debug).then((player_info) => {
                                this.setPlayer(player_info);
                                this.updatePlayer(player_info);
                                this.errors.size != 0 || debug ? console.log(this.errors) : null;
                            resolve(true);
                            });
                        } else {
                            debug ? console.log("player is not empty") : null;
                            this.updatePlayer(player_info);
                            this.errors.size != 0 ||  debug ? console.log(this.errors) : null;
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

    updatePlayer(player_info){
        let playerObject = player_info[0][Player.name];
        this.#player.x = playerObject.origin_x;
        this.#player.y = playerObject.origin_y;
        this.#player.origin_x = playerObject.origin_x;
        this.#player.origin_y = playerObject.origin_y;
    }

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
            this.#background = Information[2]["Background"];
            this.loadBackground();
        } catch (e) {
            this.#errors.push("The import of the background failed | " + e.message);
        }

        try {
            this.music = Information[3]["Music"];
        } catch (e) {
            this.#errors.push("The import of the music failed | " + e.message);
        }
    }

     setPlayer(player_info) {
        let playerObject = player_info[0][Player.name];
        let playerWeaponObject = player_info[1][Player.name+Weapon.name];
        let playertmp;
        let weapon;
        /* deprecated for now 
        try {
           
            #weapon = new Weapon(
                playerWeaponObject.width,
                playerWeaponObject.height,
                playerWeaponObject.texturepath,
                playerWeaponObject.damage,
                playerWeaponObject.range,
                playerWeaponObject.attackSpeed
            );
        } catch (e) {
            this.errors.push("The import of the weapon failed | " + e.message );
        }*/
        
        try {
            playertmp = new Player(
                playerObject.x, 
                playerObject.y, 
                playerObject.width, 
                playerObject.height, 
                playerObject.texturepath, 
                playerObject.origin_x,
                playerObject.origin_y,
                weapon,
                playerObject.lifes,
                playerObject.maxHealth,
                playerObject.speed
            );
            this.#player = playertmp;
        } catch (e) {
            this.errors.push("The import of the player failed | " + e.message);
        }
    }

    setObjects(objectsArray) {
    
        let platformObject = [];
        let collisionBlockObject = [];
        let passageWaysObject = [];
        
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
            }
        } catch (e) {
            this.#errors.push("The import of the objects failed | " + e.message);
        }

        //set the global variables
        this.#platforms = platformObject;
        this.#collisionBlocks = collisionBlockObject;
        this.#passageWays = passageWaysObject;

        if(this.platforms.length == 0){
            this.#errors.push("There is no platform in this level");
        }
        if(this.collisionBlocks.length == 0){
            this.#errors.push("There is no collision block in this level");
        }
    }

    setEnnemies(ennemiesArray) {
        let patrolmanObject = [];
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
                        element[Patrolman.name].direction,
                        element[Patrolman.name].animStep,
                        element[Patrolman.name].animTimer,
                        element[Patrolman.name].path,
                        element[Patrolman.name].speed,
                        element[Patrolman.name].step,
                        element[Patrolman.name].damage
                    );
                    patrolmanObject.push(patrolman);
                }
            }
        } catch (e) {
            this.#errors.push("The import of the ennemies failed | " + e.message);
        }
        this.#patrolmen = patrolmanObject;
    }

    loadBackground(){
        try {
            this.#backgroundImage = new Image();
            if(this.background.path != null)
            {
                this.#backgroundImage.src = this.background.path;
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

    findFile(folder, name, extension) {
        return new Promise((resolve, reject) => {
            let fileList = [];
            const xhr = new XMLHttpRequest();
            xhr.open('GET', folder);
            xhr.onload = function () {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(xhr.responseText, 'text/html');
                const links = htmlDoc.getElementsByTagName('a');
                for (let i = 0; i < links.length; i++) {
                    const fileName = links[i].getAttribute('href');
                    if (fileName.endsWith(extension)) {
                        const filename = fileName.slice(0, -5);
                        fileList.push(filename);
                    }
                }
                if (fileList.includes(name)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            xhr.onerror = function () {
                reject(new Error("An error occurred while trying to find the file."));
            };
            xhr.send();
        });
    }

    reset(){
        this.#errors = [];
        this.#levelName;
        this.#levelAuthor;
        this.#background;
        this.#music;
        this.#player = null;
        this.#patrolmen = [];
        this.#platforms = [];
        this.#collisionBlocks = [];
        this.#passageWays = [];
        this.#backgroundImage = null;
    }
}

export default Loader;