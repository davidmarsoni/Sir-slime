/**
 * This file contains all specific variables that are used in LoaderManager.js
 * Thease variables are in a separate file to make the code more readable and esay to maintain
 * That way if we want to add a new object to the game we just have to add it to the list
 * and not modify the LoaderManager.js file
 */
import Player from "../Player.js";
import Weapon from "../Weapon.js";
import Platform from "../Platform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../Bat.js";


// list of all the objects that can be in a level divided in 4 categories
const Information_list = ["Name","Author","Background","Music"];
const ennemies_list = [Patrolman.name,Bat.name];
const player_list = [Player.name,Player.name+Weapon.name];
const objects_list = [Platform.name,CollisionBlock.name,PassageWay.name];

export {Information_list,ennemies_list,player_list,objects_list};
