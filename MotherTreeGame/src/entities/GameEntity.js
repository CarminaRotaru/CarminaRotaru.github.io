/**
 * Codder: Vikram Singh
 * Modified by Carmina Rotaru
 * Date: 12/18/2021
 */
import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
import { context, DEBUG } from "../globals.js";

export default class GameEntity {
	static MAX_ENERGY = 100;
    static MAX_HEALTH = 100;
	static MAX_SPEED = 200;
    static MAX_STRENGTH = 100;
    static MAX_DEFENCE = 100;
	
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {object} entityDefinition
	 */
	constructor(entityDefinition = {}) {
		this.position = entityDefinition.position ?? new Vector();
		this.dimensions = entityDefinition.dimensions ?? new Vector();
		
        this.totalHealth = entityDefinition.health ?? 1;
        this.health = this.totalHealth;
		this.damage = entityDefinition.damage ?? 1;
		
        this.hitboxOffsets = entityDefinition.hitboxOffsets ?? new Hitbox();
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);

		this.mapHitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
		
		this.stateMachine = null;
		this.currentAnimation = null;
		this.sprites = [];
		
        //this.direction = Direction.Down;
		
        this.isDead = false;
		this.cleanUp = false;
		this.renderPriority = 0;

		//Stats
		this.speed = entityDefinition.speed ?? 1;
		this.strength = entityDefinition.strength ?? 1;
		this.defence = entityDefinition.defence ?? 1;
		this.energy = entityDefinition.energy ?? 1;
		this.health = entityDefinition.health ?? 1;
	}

	update(dt) {
		this.stateMachine.update(dt);
        this.currentAnimation.update(dt);
        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
	}

	render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		this.stateMachine.render();

		if(this.sprites[this.currentAnimation.getCurrentFrame()] == undefined){
			return;
		}

		this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));

		if (DEBUG) {
			this.hitbox.render(context);
		}
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns Whether this hitbox collided with another using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox);
	}

	changeState(state, params) {
		this.stateMachine.change(state, params);
	}
}