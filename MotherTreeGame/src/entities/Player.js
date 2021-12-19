/**
 * Codder: Vikram Singh
 * Modified by Carmina Rotaru
 * Date: 12/18/2021
 */
import GameEntity from "./GameEntity.js";
import { context, DEBUG, sounds, timer } from "../globals.js";
import StateMachine from "../../lib/StateMachine.js";
import Hitbox from "../../lib/Hitbox.js";
import Map from "../objects/Map.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import PlayerIdleState from "../states/entity/player/PlayerIdleState.js"
import Direction from "../enums/Direction.js";
import PlayerWalkingState from "../states/entity/player/PlayerWalkingState.js";
import PlayerAttackState from "../states/entity/player/PlayerAttackState.js";
import Vector from "../../lib/Vector.js";
import EntitySpriteFactory from "../services/EntitySpriteFactory.js"
import EntityType from "../enums/EntityType.js";
import SoundName from "../enums/SoundName.js";
import PlayerSleepState from "../states/entity/player/PlayerSleepState.js";

export default class Player extends GameEntity{
    static WIDTH = 48;
	static HEIGHT = 48;
    static MAX_SPEED = 100;
    static BAG_MAX_CAPACITY = 10;
    static SLEEP = 25;

    static INITIAL_HEALTH = 100;
    static INITIAL_SPEED = 100;
    static INITIAL_STRENGTH = 200;
    static INITIAL_DEFENCE = 50;
    static INITIAL_ENERGY = 100;

    constructor(){
        super();

        //this.canvasPosition = new Vector(canvas.width / 2, canvas.height / 2);
        this.mapPosition = new Vector(Map.RIGHT_EDGE / 2, Map.BOTTOM_EDGE / 2);

        let tmp = EntitySpriteFactory.createSprites(EntityType.Goblin)

        this.walkingSprites = tmp.walking;
        this.attackSprite = tmp.attack;
        
        this.sprites = this.walkingSprites;
        
        this.positionOffset = { x: 0, y: 0 };
        this.swordHitbox = new Hitbox(0, 0, 0, 0, 'blue');

        this.dimensions.x  = Player.WIDTH;
        this.dimensions.y = Player.HEIGHT;

        this.stateMachine = this.initializeStateMachine();

        this.hitboxOffsets.position.x = 16;
        this.hitboxOffsets.position.y = 33;

        this.isImmune = false;

        this.bloodBag = 0;

        this.position.x = Map.CENTER_X - Player.WIDTH / 2;
		this.position.y = Map.CENTER_Y - Player.HEIGHT / 2;

        this.initializaSatats();
    }

    initializaSatats(){
        this.speed = Player.INITIAL_SPEED;
		this.strength = Player.INITIAL_STRENGTH;
		this.defence = Player.INITIAL_DEFENCE;
		this.energy = Player.INITIAL_ENERGY;
		this.health = Player.INITIAL_HEALTH;
    }

    render(){
        super.render(this.positionOffset);

        if (DEBUG) {
			this.swordHitbox.render(context);
		}
    }

    update(dt){
        super.update(dt);
        
        this.mapHitbox.set(
            this.mapPosition.x + this.hitboxOffsets.position.x,
			this.mapPosition.y + this.hitboxOffsets.position.y,
			this.dimensions.x / 3,
			this.dimensions.y / 5,
        );
        
        this.hitbox.set(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x / 3,
			this.dimensions.y / 5,
		);

        if(this.isDead){}
            //this.changeState();
    }

    reset(){
        this.mapPosition = new Vector(Map.RIGHT_EDGE / 2, Map.BOTTOM_EDGE / 2);
        this.position.x = Map.CENTER_X - Player.WIDTH / 2;
		this.position.y = Map.CENTER_Y - Player.HEIGHT / 2;
		this.direction = Direction.Down;
		this.stateMachine.change(PlayerStateName.Idle);
        this.bloodBag = 0;
        this.isDead = false;
        this.isImmune = false;

        this.initializaSatats();
    }
''
    initializeStateMachine(){
        const stateMachine = new StateMachine();

        stateMachine.add(PlayerStateName.Idle, new PlayerIdleState(this));
        stateMachine.add(PlayerStateName.Walking, new PlayerWalkingState(this));
        stateMachine.add(PlayerStateName.Attack, new PlayerAttackState(this));
        stateMachine.add(PlayerStateName.Sleep, new PlayerSleepState(this));

        return stateMachine;
    }

    didCollideWithEntityAttack(Hitbox){
		return this.swordHitbox.didCollide(Hitbox);
	}

    immunize(){
        this.isImmune = true;
        timer.wait(0.5, () => {this.isImmune = false})
    }

    tackDamage(damage){
        if(damage - this.defence > 0 && !this.isImmune){
            this.health -= damage - this.defence;
            this.immunize();
        }

        if(this.health <= 0)
            this.isDead = true;
    }

    collectBlood(){
        if(this.bloodBag < Player.BAG_MAX_CAPACITY){
            this.bloodBag++;
            sounds.play(SoundName.PickUp);
            return true;
        }
        else
            return false;
    }

    sleep(){
        this.health += Player.SLEEP;
        if(this.health > this.totalHealth)
            this.health = Player.INITIAL_HEALTH;
    }
}