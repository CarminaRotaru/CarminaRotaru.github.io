/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import Enemy from "./Enemy.js";
import EntitySpriteFactory from "../../services/EntitySpriteFactory.js"
import EntityType from "../../enums/EntityType.js";

export default class Goblin extends Enemy{
    static WIDTH = 48;
	static HEIGHT = 48;
    static MAX_SPEED = 100;

    constructor(){
        super();

        let tmp = EntitySpriteFactory.createSprites(EntityType.Goblin);

        this.walkingSprites = tmp.walking;
        this.attackSprite = tmp.attack;
        
        this.sprites = this.walkingSprites;

        this.dimensions.x  = Goblin.WIDTH;
        this.dimensions.y = Goblin.HEIGHT;

        this.type = EntityType.Goblin;

        this.stateMachine = this.initializeStateMachine();
    }
}