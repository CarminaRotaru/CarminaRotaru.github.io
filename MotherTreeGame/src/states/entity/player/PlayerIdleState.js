/**
 * Codder: Vikram Singh
 * Modified by Carmina Rotaru
 * Date: 12/18/2021
 */
import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";

export default class PlayerIdleState extends State{
    constructor(player){
        super();

        this.player = player;
        this.animation = {
            [Direction.Up]: new Animation([0], 1),
			[Direction.Down]: new Animation([6], 1),
			[Direction.Left]: new Animation([12], 1),
			[Direction.Right]: new Animation([18], 1),
        }
    }

    enter(){
        this.player.sprites = this.player.walkingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    }

    update(){
        this.checkForMovement();
        this.checkForAttack();
    }

    checkForMovement(){
        if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.Walking);
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Walking);
		}
    }

    checkForAttack(){
        if (keys[' ']) {
			this.player.changeState(PlayerStateName.Attack);
		}
    }
}