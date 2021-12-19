/**
 * Codder: Vikram Singh
 * Modified by Carmina Rotaru
 * Date: 12/18/2021
 */
import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds } from "../../../globals.js";

export default class PlayerAttackState extends State {
    constructor(player){
        super();

        this.player = player;

        this.animation = {
            [Direction.Up]: new Animation([0, 9, 10, 11, 12], 0.1, 1),
			[Direction.Down]: new Animation([21, 30, 31, 32, 33], 0.1, 1),
			[Direction.Left]: new Animation([42, 51, 52, 53, 54], 0.1, 1),
			[Direction.Right]: new Animation([63, 72, 73, 74, 75], 0.1, 1),
        }
    }

    enter() {
		this.player.positionOffset = { x: 0, y: 0 };
		this.player.sprites = this.player.attackSprite;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	exit() {
		this.player.positionOffset = { x: 0, y: 0 };
		this.player.swordHitbox.set(0, 0, 0, 0);
	}

    update(){
        if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			this.player.changeState(PlayerStateName.Idle);
		}

        if (this.player.currentAnimation.isHalfwayDone()) {
			this.setWeaponHitbox();
			sounds.play(SoundName.Hit);
		}
    }

    setWeaponHitbox() {
		let hitboxX, hitboxY, hitboxWidth, hitboxHeight;

		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.player.direction === Direction.Left) {
			hitboxWidth = this.player.dimensions.x / 3;
			hitboxHeight = this.player.dimensions.x / 3;
			hitboxX = this.player.position.x - hitboxWidth + 15;
			hitboxY = this.player.position.y + this.player.dimensions.y / 2;
		}
		else if (this.player.direction === Direction.Right) {
			hitboxWidth = this.player.dimensions.x / 3;
			hitboxHeight = this.player.dimensions.x / 3;
			hitboxX = this.player.position.x + this.player.dimensions.x - 15;
			hitboxY = this.player.position.y + this.player.dimensions.y / 2;
		}
		else if (this.player.direction === Direction.Up) {
			hitboxWidth = this.player.dimensions.x / 3;
			hitboxHeight = this.player.dimensions.x / 3;
			hitboxX = this.player.position.x + this.player.dimensions.x / 3;
			hitboxY = this.player.position.y + 8;
		}
		else {
			hitboxWidth = this.player.dimensions.x / 3;
			hitboxHeight = this.player.dimensions.x / 3;
			hitboxX = this.player.position.x + this.player.dimensions.x / 3;
			hitboxY = this.player.position.y + this.player.dimensions.y - 8;
		}

		this.player.swordHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
	}
}