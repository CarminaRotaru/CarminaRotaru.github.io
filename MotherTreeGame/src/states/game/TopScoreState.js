/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
 import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, MAX_HIGH_SCORES, sounds, stateMachine, timer } from "../../globals.js";
import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import SaveGame from "../../services/SaveGame.js";

export default class TopScoreState extends State { 
    static NUM_ITERATIONS = 3;
    
    constructor() {
		super();
	}

    enter(){
        sounds.play(SoundName.TitleMusic);
		this.scores = SaveGame.loadHighScores();
    }

	update(dt){
        if(keys.Enter){
            stateMachine.change(GameStateName.Transition, {
                fromState: stateMachine.states[GameStateName.TopScore],
                toState: stateMachine.states[GameStateName.TitleScreen]
            });
			keys.Enter = false;
		}
	}

	render() {
		images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
        context.font = '50px Smalimar';
        context.fillText('Top Scores', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
		
		context.font = '15px Marker';
        
        let x = MAX_HIGH_SCORES - 1;
        for(let i = 0; i < MAX_HIGH_SCORES; i++){
            context.fillText((i + 1) + '. ' + this.scores[i].score, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 25 + (13 * i));
            x--;
        }
	}
}