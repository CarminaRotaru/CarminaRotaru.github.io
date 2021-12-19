/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Vector from "../../lib/Vector.js";

export default class Blood extends GameObject {
	static WIDTH = 8;
	static HEIGHT = 11;

	constructor(mapPosition) {
		var dimensions = new Vector(Blood.WIDTH, Blood.HEIGHT);
        
        super(dimensions, mapPosition);

		this.isCollidable = true;
		this.isSolid = false;

        this.hitbox.dimensions.x = Blood.WIDTH;
        this.hitbox.dimensions.y = Blood.HEIGHT;

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Blood),
			Blood.WIDTH,
			Blood.HEIGHT
		);

        this.currentFrame = 0;
	}

    setHitbox(){
        this.hitbox.position.x = this.position.x + (Blood.WIDTH - this.hitbox.dimensions.x) / 2;
        this.hitbox.position.y = this.position.y + (Blood.HEIGHT - this.hitbox.dimensions.y);
    }
}