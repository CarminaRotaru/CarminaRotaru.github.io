/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
 import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, MAX_GAME_SAVES, MAX_HIGH_SCORES, sounds, stateMachine, timer } from "../../globals.js";
import State from "../../../lib/State.js";
import GameStateName from "../../enums/GameStateName.js";
import ImageName from "../../enums/ImageName.js";
import SoundName from "../../enums/SoundName.js";
import SaveGame from "../../services/SaveGame.js"

export default class SavedGameState extends State { 
    static SELECT_TOKEN_TIZE = 3;
    
    constructor() {
		super();
	}

    enter(){
        sounds.play(SoundName.TitleMusic);
		this.games = SaveGame.loadSaveGame();
        this.selected = 0;
    }

	update(dt){
        if(keys.Enter){
            stateMachine.change(GameStateName.Transition, {
				fromState: stateMachine.states[GameStateName.SavedGames],
				toState: stateMachine.states[GameStateName.Play],
				toStateEnterParameters: this.games[this.selected]
			});
			keys.Enter = false;
		} if(keys['w'] && this.selected > 0){
            this.selected--;
            keys['w'] = false;
        } if(keys['s'] && this.selected < this.games.length - 1){
            this.selected++;
            keys['s'] = false;
        } if(keys['b']){
            stateMachine.change(GameStateName.Transition, {
				fromState: stateMachine.states[GameStateName.SavedGames],
				toState: stateMachine.states[GameStateName.TitleScreen],
			});
            keys['b'] = false;
        }
	}

	render() {
		images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
        context.font = '50px Smalimar';
        context.fillText('Saved Games', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
		
		context.font = '15px Marker';
        
        for(let i = 0; i < this.games.length; i++){
            context.fillText(this.games[i].name, (CANVAS_WIDTH / 3) + 30, CANVAS_HEIGHT / 2 - 25 + (13 * i));
            context.fillText(this.games[i].time, CANVAS_WIDTH - 130, CANVAS_HEIGHT / 2 - 25 + (13 * i));
        }

        context.fillRect(100, CANVAS_HEIGHT / 2 - 25 + (13 * this.selected), 
				SavedGameState.SELECT_TOKEN_TIZE, SavedGameState.SELECT_TOKEN_TIZE);
	}
}