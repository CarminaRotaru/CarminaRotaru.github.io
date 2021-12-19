import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";

export default class Tile {
	static TILE_SIZE = 16;
	static TILENUMTYPE = 7;
	static BUFERSIZE = 0.5;

	/**
	 * Represents one tile in the Tilemap and on the screen.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {Sprite} sprite
	 */
	constructor(x, y, sprite, spriteNum) {
		this.position = new Vector(x, y);
		this.canvasPosition = new Vector(x * Tile.TILE_SIZE, y * Tile.TILE_SIZE);
		this.dimensions = new Vector(Tile.TILE_SIZE, Tile.TILE_SIZE);
		this.spriteNum = spriteNum;
		this.sprite = sprite;
	}

	render(x, y) {
		this.sprite.render(x, y); //this.canvasPosition.x, this.canvasPosition.y
	}
}
