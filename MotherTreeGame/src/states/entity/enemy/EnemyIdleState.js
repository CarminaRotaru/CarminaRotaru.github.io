/**
 * Codder: Vikram Singh
 * Modified by Carmina Rotaru
 * Date: 12/18/2021
 */
import Animation from "../../../../lib/Animation.js";
import { getRandomPositiveInteger } from "../../../../lib/RandomNumberHelpers.js";
import State from "../../../../lib/State.js";
import Direction from "../../../enums/Direction.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";
import { timer } from "../../../globals.js";
import EntityAnimationFactory from "../../../services/EntityAnimationFactory.js";

export default class EnemyIdleState extends State{
    static IDLE_DURATION_MIN = 2;
    static IDLE_DURATION_MAX = 6;
    
    constructor(enemy){
        super();

        this.enemy = enemy;

        let tmp = EntityAnimationFactory.createAnimation(this.enemy.type, EnemyStateName.Idle);

        this.animation = {
            [Direction.Up]: new Animation(tmp.up, 1),
			[Direction.Down]: new Animation(tmp.down, 1),
			[Direction.Left]: new Animation(tmp.left, 1),
			[Direction.Right]: new Animation(tmp.right, 1),
        }
    }

    enter(){
        this.enemy.sprites = this.enemy.walkingSprites;
        this.enemy.currentAnimation = this.animation[this.enemy.direction];

        this.startMovementTimer();
    }
    
    startMovementTimer(){
        let time = getRandomPositiveInteger(EnemyIdleState.IDLE_DURATION_MIN, EnemyIdleState.IDLE_DURATION_MAX);
        
        this.timer = timer.wait(time, () => {
            if(this.enemy.isDazed)
                this.startMovementTimer();
            else
                this.enemy.changeState(EnemyStateName.Walking);
        });
    }
}