import GameEntity from "../GameEntity.js";
import { canvas, context, DEBUG, images, timer } from "../../globals.js";
import StateMachine from "../../../lib/StateMachine.js";
import Hitbox from "../../../lib/Hitbox.js";
import ImageName from "../../enums/ImageName.js";
import Sprite from "../../../lib/Sprite.js";
import Map from "../../objects/Map.js";
import Direction from "../../enums/Direction.js";
import Vector from "../../../lib/Vector.js";
import EnemyStateName from "../../enums/EnemyStateName.js"
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";
import EnemyIdleState from "../../states/entity/enemy/EnemyIdleState.js";
import EnemyWalkingState from "../../states/entity/enemy/EnemyWalkingState.js";
import Tile from "../../objects/Tile.js";
import EnemyCombatState from "../../states/entity/enemy/EnemyFollowingState.js";
import EnemyFollowingState from "../../states/entity/enemy/EnemyFollowingState.js";
import EnemyAttackState from "../../states/entity/enemy/EnemyAttackState.js";
import GameObject from "../../objects/GameObject.js";

export default class Enemy extends GameEntity{
    static WIDTH = 48;
	static HEIGHT = 48;
    static FOLLOW_DISTANCE = Tile.TILE_SIZE * 5;
    static ATTACK_DISTANCE = Tile.TILE_SIZE;

    constructor(){
        super();

        this.canvasPosition = new Vector(canvas.width / 2, canvas.height / 2);
        this.mapPosition = new Vector();

        this.positionOffset = { x: 0, y: 0 };
        this.swordHitbox = new Hitbox(0, 0, 0, 0, 'blue');

        this.hitboxOffsets.position.x = 16;
        this.hitboxOffsets.position.y = 33;

        this.isDazed = false;

        this.getRandomStats();
        this.setRandomPosition();

        this.type = null;
    }

    render(){
        super.render(this.positionOffset);

        if (DEBUG) {
			this.swordHitbox.render(context);
		}
    }

    update(dt){
        super.update(dt);

        this.mapHitbox.set(
            this.mapPosition.x + this.hitboxOffsets.position.x,
			this.mapPosition.y + this.hitboxOffsets.position.y,
			this.dimensions.x / 3,
			this.dimensions.y / 5,
        );
        
        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x / 3,
			this.dimensions.y / 5,
		);
    }

    reset(){
		this.direction = Direction.Down;
		this.stateMachine.change(EnemyStateName.Idle);
    }

    isWithinRange(entity){
        var distance = Math.sqrt(
            Math.pow(this.mapPosition.x - entity.mapPosition.x, 2)
            + Math.pow(this.mapPosition.y - entity.mapPosition.y, 2)
        );
        
        return (distance < Enemy.FOLLOW_DISTANCE
            && this.stateMachine.currentState.name != EnemyStateName.Following
            && this.stateMachine.currentState.name != EnemyStateName.Attack
            );
    }

    initializeStateMachine(){
        const stateMachine = new StateMachine();

        stateMachine.add(EnemyStateName.Idle, new EnemyIdleState(this));
        stateMachine.add(EnemyStateName.Walking, new EnemyWalkingState(this));
        stateMachine.add(EnemyStateName.Following, new EnemyFollowingState(this));
        stateMachine.add(EnemyStateName.Attack, new EnemyAttackState(this));

        return stateMachine;
    }

    getRandomStats(){
        this.speed = getRandomPositiveInteger(40, Enemy.MAX_SPEED);
		this.strength = getRandomPositiveInteger(40, Enemy.MAX_STRENGTH);
		this.defence = getRandomPositiveInteger(40, Enemy.MAX_DEFENCE);
		this.energy = getRandomPositiveInteger(10, Enemy.MAX_ENERGY);
		this.health = getRandomPositiveInteger(10, Enemy.MAX_HEALTH);
    }

    setRandomPosition(){
        this.mapPosition.x = getRandomPositiveInteger(Map.LEFT_EDGE, Map.RIGHT_EDGE - this.dimensions.x);
        this.mapPosition.y = getRandomPositiveInteger(Map.TOP_EDGE, Map.BOTTOM_EDGE - this.dimensions.y);
    }

    didCollideWithEntityAttack(Hitbox){
		return this.swordHitbox.didCollide(Hitbox);
	}

    didCollideWithPlayerAttack(attackHitbox){
		return (this.hitbox.didCollide(attackHitbox) && (this.hitbox.dimensions.x * this.hitbox.dimensions.y) != 0);
	}

    immunize(){
        this.isImmune = true;
        timer.wait(0.5, () => {this.isImmune = false})
    }

    tackDamage(damage){
        if(damage - this.defence > 0 && !this.isImmune){
            this.health -= damage - this.defence;
            this.immunize();

            if(this.health <= 0)
                this.isDead = true;
        }
    }
}