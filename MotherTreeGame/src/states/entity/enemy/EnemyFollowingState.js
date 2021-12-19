/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import Animation from "../../../../lib/Animation.js";
import { pickRandomElement } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Enemy from "../../../entities/Enemy/Enemy.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import EntityAnimationFactory from "../../../services/EntityAnimationFactory.js";

export default class EnemyFollowingState extends State{
    constructor(enemy){
        super();

        this.enemy = enemy;

		let tmp = EntityAnimationFactory.createAnimation(this.enemy.type, EnemyStateName.Walking);

        this.animation = {
			[Direction.Up]: new Animation(tmp.up, 0.1),
			[Direction.Down]: new Animation(tmp.down, 0.1),
			[Direction.Left]: new Animation(tmp.left, 0.1),
			[Direction.Right]: new Animation(tmp.right, 0.1),
		};
    }

    enter(target) {
		this.enemy.sprites = this.enemy.walkingSprites;
		this.enemy.currentAnimation = this.animation[this.enemy.direction];
        this.target = target;

		this.reset();
	}

	update(dt) {
		this.move(dt);
	}

	reset() {
		this.enemy.direction = pickRandomElement([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);
		this.enemy.currentAnimation = this.animation[this.enemy.direction];
	}

	move(dt) {
		var withinX = false;
        var withinY = false;
        
        if(this.target.mapPosition.x - Enemy.ATTACK_DISTANCE > this.enemy.mapPosition.x){
			this.enemy.direction = Direction.Right;
            this.enemy.mapPosition.x += this.enemy.speed * dt;
		}
        else if(this.target.mapPosition.x + Enemy.ATTACK_DISTANCE < this.enemy.mapPosition.x){
			this.enemy.direction = Direction.Left;
			this.enemy.mapPosition.x -= this.enemy.speed * dt;
		}   
        else
            withinX = true;
        
        if(this.target.mapPosition.y - Enemy.ATTACK_DISTANCE > this.enemy.mapPosition.y){
			this.enemy.direction = Direction.Down;
			this.enemy.mapPosition.y += this.enemy.speed * dt;
		}            
        else if(this.target.mapPosition.y + Enemy.ATTACK_DISTANCE < this.enemy.mapPosition.y){
			this.enemy.direction = Direction.Up;
			this.enemy.mapPosition.y -= this.enemy.speed * dt;
		}
            
        else
            withinY = true;
        
        if(withinX && withinY){
            this.enemy.changeState(EnemyStateName.Attack, this.target);
        }
	}
}