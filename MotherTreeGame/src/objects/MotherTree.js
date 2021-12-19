import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, DEBUG, context, timer, sounds } from "../globals.js";
import Player from "../entities/Player.js";
import TreeLevel from "../enums/TreeLevel.js";
import Vector from "../../lib/Vector.js";
import Hitbox from "../../lib/Hitbox.js";
import Direction from "../enums/Direction.js";
import Tile from "./Tile.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import EnemyIdleState from "../states/entity/enemy/EnemyIdleState.js";
import SoundName from "../enums/SoundName.js";

export default class MotherTree extends GameObject {
	static WIDTH = 48;
	static HEIGHT = 48;
    static MAX_LEVEL = 4;
    static BLOOD_NEEDED = 1; //10
    static PUSH_BACK_LENGTH = 5 * Tile.TILE_SIZE;
    static DAZE_TIME = 1;

	constructor(mapPosition) {
		var dimensions = new Vector(MotherTree.WIDTH, MotherTree.HEIGHT);
        
        super(dimensions, mapPosition);

		this.isCollidable = true;
		this.isSolid = true;

        this.hitbox.dimensions.x = 20;
        this.hitbox.dimensions.y = 10;

        this.enemyHitbox = new Hitbox(
			this.mapPosition.x + this.hitboxOffsets.position.x,
			this.mapPosition.y + this.hitboxOffsets.position.y,
			(this.dimensions.x + this.hitboxOffsets.dimensions.x) * 2,
			(this.dimensions.y + this.hitboxOffsets.dimensions.y) * 2,
		);

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.MotherTree),
			MotherTree.WIDTH,
			MotherTree.HEIGHT
		);

        this.currentFrame = TreeLevel.LevelOne;
        this.level = 1;

        this.blood = 0;
        this.nextLevel = MotherTree.BLOOD_NEEDED;
	}

    setHitbox(){
        this.hitbox.position.x = this.position.x + (MotherTree.WIDTH - this.hitbox.dimensions.x) / 2;
        this.hitbox.position.y = this.position.y + (MotherTree.HEIGHT - this.hitbox.dimensions.y);
        
        this.enemyHitbox.position.x = this.hitbox.position.x - (this.enemyHitbox.dimensions.x - this.hitbox.dimensions.x) / 2; 
        this.enemyHitbox.position.y = this.hitbox.position.y - (this.enemyHitbox.dimensions.y - this.hitbox.dimensions.y) / 2;
    }

    //TODO: To be fixed if time allows
    onEnemyCollision(collider){
		if (this.isSolid) {
            const collisionDirection = this.getEntityCollisionDirection(collider.hitbox);

            var newPosition;

			switch (collisionDirection) {
				case Direction.Up:
                    newPosition = this.mapPosition.y - MotherTree.PUSH_BACK_LENGTH; //this.enemyHitbox.position.y - (collider.dimensions.y + Tile.TILE_SIZE * 2);
                    timer.tween(collider.mapPosition, 
                        ['y'], 
                        [newPosition],
                        MotherTree.DAZE_TIME, () => {collider.isDazed = false;});
					//collider.mapPosition.y = this.enemyHitbox.position.y + (collider.dimensions.y + Tile.TILE_SIZE * 2);
                    break;
				case Direction.Down:
                    newPosition = this.mapPosition.y + MotherTree.PUSH_BACK_LENGTH; //this.enemyHitbox.position.y + (collider.dimensions.y + Tile.TILE_SIZE * 2);
                    timer.tween(collider.mapPosition, 
                        ['y'], 
                        [newPosition],
                        MotherTree.DAZE_TIME, () => {collider.isDazed = false;});
                
                    //collider.mapPosition.y = this.enemyHitbox.position.y - (collider.dimensions.y + Tile.TILE_SIZE * 2);
                    break;
				case Direction.Left:
                    newPosition = this.mapPosition.x - MotherTree.PUSH_BACK_LENGTH; //this.enemyHitbox.position.x - (collider.dimensions.x + Tile.TILE_SIZE * 2);
                    timer.tween(collider.mapPosition, 
                        ['x'], 
                        [newPosition],
                        MotherTree.DAZE_TIME, () => {collider.isDazed = false;});

					//collider.mapPosition.x = this.enemyHitbox.position.x - (collider.dimensions.x + Tile.TILE_SIZE * 2);
                    break;
				case Direction.Right:
                    newPosition = this.mapPosition.x + MotherTree.PUSH_BACK_LENGTH //this.enemyHitbox.position.x + (collider.dimensions.x + Tile.TILE_SIZE * 2);
                    timer.tween(collider.mapPosition, 
                        ['x'], 
                        [newPosition],
                        MotherTree.DAZE_TIME, () => {collider.isDazed = false;});
					//collider.mapPosition.x = this.enemyHitbox.position.x + (collider.dimensions.x + Tile.TILE_SIZE * 2);
                    break;
			}

            collider.isDazed = true;
            collider.stateMachine.change(EnemyStateName.Idle);
		}

		if (this.wasCollided) {
			return;
		}

		this.wasCollided = true;
	}

    didCollideWithEnemyEntity(hitbox) {
		return this.enemyHitbox.didCollide(hitbox);
	}

    render(){
        super.render();

        if (DEBUG) {
			this.enemyHitbox.render(context);
		}
    }

    receiveBlood(player){
        if(player.bloodBag > 0){
            sounds.play(SoundName.Unload);
        }
        
        this.blood += player.bloodBag;
        player.bloodBag = 0;

        while(this.blood >= this.nextLevel){
            if(this.currentFrame < MotherTree.MAX_LEVEL){
                this.blood -= this.nextLevel;
                this.currentFrame = this.getNextTree();
                this.nextLevel *= 2;
                this.level++;
            }
        }
    }

    getNextTree(){
        if(this.currentFrame == TreeLevel.LevelOne)
            return TreeLevel.LevelTwo;
        else if(this.currentFrame == TreeLevel.LevelTwo)
            return TreeLevel.LevelTree;
        else (this.currentFrame == TreeLevel.LevelFour)
            return TreeLevel.LevelFour;
    }
}
