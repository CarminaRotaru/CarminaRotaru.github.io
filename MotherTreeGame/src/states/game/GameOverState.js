import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import TitleSelect from "../../enums/TitleSelect.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine, timer } from "../../globals.js";
import Map from "../../objects/Map.js";
import MotherTree from "../../objects/MotherTree.js";

export default class GameOverState extends State { 
    static NUM_ITERATIONS = 3;
    
    constructor() {
		super();
	}

    enter(){
        sounds.play(SoundName.DeathMusic);
    }

	update(dt){
        if(keys.Enter){
			stateMachine.change(GameStateName.Transition, {
				fromState: stateMachine.states[GameStateName.GameOver],
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
        context.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
		

		context.font = '20px Smalimar';
		for(let i = 0; i < GameOverState.NUM_ITERATIONS; i++){
            context.fillText('Mother Tree Has Dies', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
        }
	}
}
