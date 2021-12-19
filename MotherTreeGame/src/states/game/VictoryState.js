/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine } from "../../globals.js";
import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";

export default class GameOverState extends State { 
    static NUM_ITERATIONS = 3;
    
    constructor() {
		super();
	}

    enter(time){
        sounds.play(SoundName.DeathMusic);
		this.time = time;
    }

	update(dt){
        if(keys.Enter){
			stateMachine.change(GameStateName.Transition, {
				fromState: stateMachine.states[GameStateName.Victory],
				toState: stateMachine.states[GameStateName.TitleScreen],
			});
			keys.Enter = false;
		}
	}

	render() {
		context.fillStyle = 'red';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
        context.font = '100px Smalimar';
        context.fillText('Victory', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
		

		context.font = '20px Smalimar';
		for(let i = 0; i < GameOverState.NUM_ITERATIONS; i++){
            context.fillText('Mother Tree Has Been Saved', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
            context.fillText('Your Score Is: ' + this.time, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
        }
	}
}