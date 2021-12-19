import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger, didSucceedChance, pickRandomElement } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { keys, timer } from "../../../globals.js";
import Map from "../../../objects/Map.js";
import Tile from "../../../objects/Tile.js";
import Enemy from "../../../entities/Enemy/Enemy.js"
import EntityAnimationFactory from "../../../services/EntityAnimationFactory.js";

export default class EnemyWalkingState extends State{
    static IDLE_CHANCE = 0.5;
	static MOVE_DURATION_MIN = 2;
	static MOVE_DURATION_MAX = 6;
    
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

    enter() {
		this.enemy.sprites = this.enemy.walkingSprites;
		this.enemy.currentAnimation = this.animation[this.enemy.direction];

		this.reset();
		this.startTimer();
	}

	update(dt) {
		this.move(dt);
	}

	startTimer() {
		this.timer = timer.wait(this.moveDuration, () => {
            this.decideMovement();
        });
	}

	decideMovement() {
		if (didSucceedChance(EnemyWalkingState.IDLE_CHANCE)) {
			this.enemy.changeState(EnemyStateName.Idle);
		}
		else {
			this.reset();
			this.startTimer();
		}
	}

	reset() {
		this.enemy.direction = pickRandomElement([Direction.Up, Direction.Down, Direction.Left, Direction.Right]);
		this.enemy.currentAnimation = this.animation[this.enemy.direction];
		this.moveDuration = getRandomPositiveInteger(EnemyWalkingState.MOVE_DURATION_MIN, EnemyWalkingState.MOVE_DURATION_MAX);
	}

	move(dt) {
		if (this.enemy.direction === Direction.Down) {
			this.enemy.mapPosition.y += this.enemy.speed * dt;

			if (this.enemy.mapPosition.y + this.enemy.dimensions.y > Map.BOTTOM_EDGE) {
				this.enemy.mapPosition.y = Map.BOTTOM_EDGE - this.enemy.dimensions.y;
				this.reset();
			}
		}
		else if (this.enemy.direction === Direction.Right) {
			this.enemy.mapPosition.x += this.enemy.speed * dt;

			if (this.enemy.mapPosition.x + this.enemy.dimensions.x > Map.RIGHT_EDGE) {
				this.enemy.mapPosition.x = Map.RIGHT_EDGE - this.enemy.dimensions.x;
				this.reset();
			}
		}
		else if (this.enemy.direction === Direction.Up) {
			this.enemy.mapPosition.y -= this.enemy.speed * dt;

			if (this.enemy.mapPosition.y < Map.TOP_EDGE - this.enemy.dimensions.y / 2) {
				this.enemy.mapPosition.y = Map.TOP_EDGE - this.enemy.dimensions.y / 2;
				this.reset();
			}
		}
		else if (this.enemy.direction === Direction.Left) {
			this.enemy.mapPosition.x -= this.enemy.speed * dt;

			if (this.enemy.mapPosition.x < Map.LEFT_EDGE) {
				this.enemy.mapPosition.x = Map.LEFT_EDGE;
				this.reset();
			}
		}
	}
}