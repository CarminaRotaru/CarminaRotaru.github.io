import Vector from "../../lib/Vector.js";
import { getCollisionDirection } from "../../lib/CollisionHelpers.js";
import Hitbox from "../../lib/Hitbox.js";
import Direction from "../enums/Direction.js";
import { context, DEBUG } from "../globals.js";

export default class GameObject {
	static UP_CORRECTOR = 10;
	static HORIZONTAL_CORRECTOR = 13;
	
	constructor(dimensions, mapPosition) {
		this.dimensions = dimensions;
		this.mapPosition = mapPosition;
		this.position = new Vector();
		this.hitboxOffsets = new Hitbox();
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);

		this.mapHitbox = new Hitbox(
			this.mapPosition.x + this.hitboxOffsets.position.x,
			this.mapPosition.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);

		this.sprites = [];
		this.currentFrame = 0;
		this.cleanUp = false;
		this.renderPriority = 0;

		// If an entity can overlap with this game object.
		this.isSolid = false;

		// If an entity should detect if it's overlapping this game object.
		this.isCollidable = false;

		// If the game object should disappear when collided with.
		this.isConsumable = false;

		// If the game object was collided with already.
		this.wasCollided = false;

		// If the game object was consumed already.
		this.wasConsumed = false;
	}

	update(dt) { }

	render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y));

		if (DEBUG) {
			this.hitbox.render(context);
		}
	}

	onConsume(consumer) {
		this.wasConsumed = true;
	}

	onCollision(collider) {
		/**
		 * If this object is solid, then set the
		 * collider's position relative to this object.
		 */
		if (this.isSolid) {
			const collisionDirection = this.getEntityCollisionDirection(collider.hitbox);

			switch (collisionDirection) {
				case Direction.Up:
					collider.mapPosition.y = this.mapHitbox.position.y - (this.mapHitbox.dimensions.y - Math.abs(collider.mapPosition.y - collider.mapHitbox.position.y) - GameObject.UP_CORRECTOR);
					break;
				case Direction.Down:
					collider.mapPosition.y = this.mapHitbox.position.y + (this.mapHitbox.dimensions.y - Math.abs(collider.mapPosition.y - collider.mapHitbox.position.y));
					break;
				case Direction.Left:
					collider.mapPosition.x = this.mapHitbox.position.x - (this.mapHitbox.dimensions.x - Math.abs(collider.mapPosition.x - collider.mapHitbox.position.x) - GameObject.HORIZONTAL_CORRECTOR);
					break;
				case Direction.Right:
					collider.mapPosition.x = this.mapHitbox.position.x + this.mapHitbox.dimensions.x - Math.abs(collider.mapPosition.x - collider.mapHitbox.position.x) - GameObject.HORIZONTAL_CORRECTOR;
					break;
			}
		}

		if (this.wasCollided) {
			return;
		}

		this.wasCollided = true;
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns Whether this game object collided with an hitbox using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox);
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns The direction that the hitbox collided with this game object.
	 */
	getEntityCollisionDirection(hitbox) {
		return getCollisionDirection(
			this.hitbox.position.x,
			this.hitbox.position.y,
			this.hitbox.dimensions.x,
			this.hitbox.dimensions.y,
			hitbox.position.x,
			hitbox.position.y,
			hitbox.dimensions.x,
			hitbox.dimensions.y,
		);
	}
}
