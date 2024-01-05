import Patrolman from '../entity/enemy/Patrolman.js';
import Bat from '../entity/enemy/Bat.js';
import Boss from '../entity/boss/Boss.js';
import Hand from '../entity/boss/Hand.js';

class EnemyFactory {
    createEnemy(type, data) {
        switch (type) {
            case Patrolman.name:
                return this.createPatrolman(data);
            case Bat.name:
                return this.createBat(data);
            case Boss.name:
                return this.createBoss(data);
            case Hand.name:
                return this.createHand(data);
            default:
                throw new Error(`Unknown enemy type: ${type}`);
        }
    }

    createPatrolman(data) {
        const patrolman = Object.assign(new Patrolman(), data);
        patrolman.loadTexture();
        return patrolman;
    }

    createBat(data) {
        const bat = new Bat(
            data.x,
            data.y,
            data.width,
            data.height,
            data.texturepath,
            data.speed,
            data.damage,
            data.hitSound,
            data.deathSound,
            data.origin_x,
            data.origin_y,
            data.triggerZoneWidth,
            data.triggerZoneHeight,
            data.triggerZoneX,
            data.triggerZoneY,
            data.triggeredMode,
            data.triggerZoneFollow,
        );

        bat.loadTexture();

        return bat;
    }

    createBoss(data) {
        let boss = new Boss(
            data.x,
            data.y,
            data.width,
            data.height,
            data.texturepath,
            data.bossbarpath,
            data.origin_x,
            data.origin_y,
            data.path,
            data.damage,
            data.health,
            data.handTrampleDamage,
        )
        boss.loadTexture();
        boss.loadTextureBossBar();

        return boss;
    }

    createHand(data) {
        let hand = new Hand(
            data.x,
            data.y,
            data.width,
            data.height,
            data.texturepath,
            data.origin_x,
            data.origin_y,
            data.speed,
            data.damage,
            data.right,
            data.levelBottom
        )
        hand.loadTexture();
        return hand;
    }
}

export default EnemyFactory;