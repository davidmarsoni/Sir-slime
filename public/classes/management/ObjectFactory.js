import CollisionBlock from "../CollisionBlock.js";
import Door from "../Door.js";
import PassageWay from "../PassageWay.js";
import Coin from "../collectible/Coin.js";
import Heart from "../collectible/Heart.js";
import Spike from "../entity/Spike.js";
import ActivationPlatform from "../platform/ActivationPlatform.js";
import MovablePlatform from "../platform/MovablePlatform.js";
import Platform from "../platform/Platform.js";

class ObjectFactory {
    createObject(type, data) {
        switch (type) {
            case Platform.name:
                return this.createPlatform(data);
            case ActivationPlatform.name:
                return this.createActivationPlatform(data);
            case MovablePlatform.name:
                return this.createMovablePlatform(data);
            case CollisionBlock.name:
                return this.createCollisionBlock(data);
            case PassageWay.name:
                return this.createPassageWay(data);
            case Coin.name:
                return this.createCoin(data);
            case Heart.name:
                return this.createHeart(data);
            case Spike.name:
                return this.createSpike(data);
            case Door.name:
                return this.createDoor(data);
            default:
                throw new Error(`Unknown object type: ${type}`);
        }
    }

    createPlatform(data) {
        const platform = Object.assign(new Platform(), data);
        platform.loadTexture();
        return platform;
    }

    createActivationPlatform(data) {
        const activationPlatform = Object.assign(new ActivationPlatform(), data);
        activationPlatform.loadTexture();
        return activationPlatform;
    }

    createMovablePlatform(data) {
        const movablePlatform = new MovablePlatform(
            data.path,
            data.width,
            data.height,
            data.texturepath,
            data.spriteSheetOffsetX,
            data.spriteSheetOffsetY,
            data.spriteSheetWidth,
            data.spriteSheetHeight,
            data.speed,
        );
        movablePlatform.loadTexture();
        return movablePlatform;
    }

    createCollisionBlock(data) {
        const collisionBlock = Object.assign(new CollisionBlock(), data);
        return collisionBlock;
    }

    createPassageWay(data) {
        const passageWay = Object.assign(new PassageWay(), data);
        return passageWay;
    }

    createCoin(data) {
        const coin = new Coin(
            data.x,
            data.y,
            data.width,
            data.height,
            data.texturepath,
            data.spriteSheetOffsetX,
            data.value,
            data.soundPath
        );
        coin.loadTexture();
        //constructor(x, y, width, height, texturepath,spriteSheetOffsetX,value,soundPath) {
        return coin;
    }

    createHeart(data) {
        const heart = Object.assign(new Heart(), data);
        heart.loadTexture();
        return heart;
    }

    createSpike(data) {
        const spike = Object.assign(new Spike(), data);
        spike.loadTexture();
        return spike;
    }

    createDoor(data) {
        // use the constructor of the door instead of the object assign because the door has important logic in the constructor
        const door = new Door(
            data.x,
            data.y,
            data.width,
            data.height,
            data.texturepath,
            data.spriteSheetOffsetX,
            data.spriteSheetOffsetY,
            data.spriteSheetWidth,
            data.spriteSheetHeight,
            data.trrigerZoneX,
            data.trrigerZoneY,
            data.trrigerZoneWidth,
            data.trrigerZoneHeight,
            data.trigerZoneImagePath,
            data.timeToOpen,
            data.passageWayTo,
            data.title,
            data.content
        );

        door.loadTexture();
        return door;
    }
}

export default ObjectFactory;