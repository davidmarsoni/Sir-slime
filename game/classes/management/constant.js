/**
 * This file contains all specific variables that are used in LoaderManager.js
 * Thease variables are in a separate file to make the code more readable and esay to maintain
 * That way if we want to add a new object to the game we just have to add it to the list
 * and not modify the LoaderManager.js file
 */
import Player from "../entity/Player.js";
import Platform from "../Platform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../entity/ennemy/Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../entity/ennemy/Bat.js";
import Coin from "../collacteables/Coin.js";
import Heart from "../collacteables/Heart.js";

const GRAVITY = 0.6;
// list of all the objects that can be loaded from a JSON file
const startScreen_list = ["Background"];
const Information_list = ["Name","Author","Background","Music"];
const ennemies_list = [Patrolman.name,Bat.name];
const player_list = [Player.name];
const objects_list = [Platform.name,CollisionBlock.name,PassageWay.name,Coin.name,Heart.name];

export {Information_list,ennemies_list,player_list,objects_list,startScreen_list,GRAVITY};
