/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds, timer } from "../../../globals.js";
import EntityAnimationFactory from "../../../services/EntityAnimationFactory.js";

export default class EnemyAttackState extends State {	
	constructor(enemy){
        super();

        this.enemy = enemy;

		let tmp = EntityAnimationFactory.createAnimation(this.enemy.type, EnemyStateName.Attack);

        this.animation = {
            [Direction.Up]: new Animation(tmp.up, 0.2, 1),
			[Direction.Down]: new Animation(tmp.down, 0.2, 1),
			[Direction.Left]: new Animation(tmp.left, 0.2, 1),
			[Direction.Right]: new Animation(tmp.right, 0.2, 1),
        }
    }

    enter(target) {
		this.enemy.positionOffset = { x: 0, y: 0 };
		this.enemy.sprites = this.enemy.attackSprite;
        this.target = target;

		if(target.position.x > this.enemy.position.x)
			this.enemy.direction = Direction.Right;
		else if (target.position.x < this.enemy.position.x)
			this.enemy.direction = Direction.Left;
		if(target.position.y > this.enemy.position.y)
			this.enemy.direction = Direction.Down;
		else if(target.position.y < this.enemy.position.y)
			this.enemy.direction = Direction.Up;

		this.enemy.currentAnimation = this.animation[this.enemy.direction];
	}

	exit() {
		this.enemy.positionOffset = { x: 0, y: 0 };
		this.enemy.swordHitbox.set(0, 0, 0, 0);
	}

    update(){//
		if (this.enemy.currentAnimation.isDone()) {
				this.enemy.currentAnimation.refresh();
				this.enemy.changeState(EnemyStateName.Following, this.target);
		}

        if (this.enemy.currentAnimation.isHalfwayDone()) {
			this.setWeaponHitbox();
			if(this.enemy.didCollideWithEntityAttack(this.target.hitbox)){				
				this.target.tackDamage(this.enemy.strength);
				sounds.play(SoundName.Hit);
			}

			if(this.enemy.isDead){
				this.enemy.speed += this.target.speed / 4;
				this.enemy.strength += this.target.strength / 4;
				this.enemy.defence += this.target.defence / 4;
				this.enemy.energy += this.target.energy / 4;
				this.enemy.health += this.target.health / 4;
			}
		}
    }

    setWeaponHitbox() {
		let hitboxX, hitboxY, hitboxWidth, hitboxHeight;

		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.enemy.direction === Direction.Left) {
			hitboxWidth = this.enemy.dimensions.x / 3;
			hitboxHeight = this.enemy.dimensions.x / 3;
			hitboxX = this.enemy.position.x - hitboxWidth + 15;
			hitboxY = this.enemy.position.y + this.enemy.dimensions.y / 2;
		}
		else if (this.enemy.direction === Direction.Right) {
			hitboxWidth = this.enemy.dimensions.x / 3;
			hitboxHeight = this.enemy.dimensions.x / 3;
			hitboxX = this.enemy.position.x + this.enemy.dimensions.x - 15;
			hitboxY = this.enemy.position.y + this.enemy.dimensions.y / 2;
		}
		else if (this.enemy.direction === Direction.Up) {
			hitboxWidth = this.enemy.dimensions.x / 3;
			hitboxHeight = this.enemy.dimensions.x / 3;
			hitboxX = this.enemy.position.x + this.enemy.dimensions.x / 3;
			hitboxY = this.enemy.position.y + 8;
		}
		else {
			hitboxWidth = this.enemy.dimensions.x / 3;
			hitboxHeight = this.enemy.dimensions.x / 3;
			hitboxX = this.enemy.position.x + this.enemy.dimensions.x / 3;
			hitboxY = this.enemy.position.y + this.enemy.dimensions.y - 8;
		}

		this.enemy.swordHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);

		timer.wait(0.5, () => {
			this.enemy.swordHitbox.set(0, 0, 0, 0);
		});
	}
}