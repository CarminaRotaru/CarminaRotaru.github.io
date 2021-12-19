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
import Map from "../../../objects/Map.js";

export default class PlayerWalkingState extends State{
    constructor(player){
        super();

        this.player = player;

        this.animation = {
			[Direction.Up]: new Animation([0, 1, 2, 3, 4, 5], 0.1),
			[Direction.Down]: new Animation([6, 7, 8, 9, 10, 11], 0.1),
			[Direction.Left]: new Animation([12, 13, 14, 15, 16, 17], 0.1),
			[Direction.Right]: new Animation([18, 19, 20, 21, 22, 23], 0.1),
		};
    }

    enter(){
        this.player.sprites = this.player.walkingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    }

    update(dt){
        this.handleMovement(dt);
        this.checkForAttack();
    }

    handleMovement(dt){
        this.player.currentAnimation = this.animation[this.player.direction];

		if (keys.s) {
			this.player.direction = Direction.Down;

			if(this.player.mapPosition.y <= Map.BOTTOM_EDGE)
				this.player.mapPosition.y += this.player.speed * dt;
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;

			if(this.player.mapPosition.x <= Map.RIGHT_EDGE)
				this.player.mapPosition.x += this.player.speed * dt;
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;

			if(this.player.mapPosition.y >= Map.TOP_EDGE)
				this.player.mapPosition.y -= this.player.speed * dt;
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;

			if(this.player.mapPosition.x >= Map.LEFT_EDGE)
				this.player.mapPosition.x -= this.player.speed * dt;
		}
		else {
			this.player.changeState(PlayerStateName.Idle);
		}
    }

    checkForAttack(){
        if (keys[' ']) {
			this.player.changeState(PlayerStateName.Attack);
		}
    }
}