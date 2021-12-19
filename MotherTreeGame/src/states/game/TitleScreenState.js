import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import ImageName from "../../enums/ImageName.js";
import TitleSelect from "../../enums/TitleSelect.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, sounds, stateMachine } from "../../globals.js";
import Map from "../../objects/Map.js";
import MotherTree from "../../objects/MotherTree.js";
import SoundName from "../../enums/SoundName.js"
import Tile from "../../objects/Tile.js";
import Game from "../../../lib/Game.js";

export default class TitleScreenState extends State {
	static SELECT_TOKEN_TIZE = 3;
	
	constructor() {
		super();
		this.currentSelect = TitleSelect.Play;
	}

	enter(){
		sounds.play(SoundName.TitleMusic);
	}

	exit(){
		sounds.stop(SoundName.TitleMusic);
	}

	update(dt){
        if(keys.Enter){
			keys.Enter = false;
			
			switch(this.currentSelect){
				case TitleSelect.Play:
					stateMachine.change(GameStateName.Transition, {
						fromState: stateMachine.states[GameStateName.TitleScreen],
						toState: stateMachine.states[GameStateName.Play]
					});
					return;
				case TitleSelect.TopScore:
					stateMachine.change(GameStateName.Transition, {
						fromState: stateMachine.states[GameStateName.TitleScreen],
						toState: stateMachine.states[GameStateName.TopScore]
					});
					return;
				case TitleSelect.SavedGames:
					stateMachine.change(GameStateName.Transition, {
						fromState: stateMachine.states[GameStateName.TitleScreen],
						toState: stateMachine.states[GameStateName.SavedGames]
					});	
					return;
			}
		} else if(keys['s']){
			if(this.currentSelect == TitleSelect.Play)
				this.currentSelect = TitleSelect.TopScore;
		} else if(keys['w']){
			if(this.currentSelect == TitleSelect.TopScore)
				this.currentSelect = TitleSelect.Play;
		} else if(keys['d']){
			if(this.currentSelect == TitleSelect.Play)
				this.currentSelect = TitleSelect.SavedGames;
		} else if(keys['a']){
			if(this.currentSelect == TitleSelect.SavedGames)
				this.currentSelect = TitleSelect.Play;
		}
	}

	render() {
		images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		let treeX = (CANVAS_WIDTH - (MotherTree.WIDTH * MotherTree.MAX_LEVEL)) / 2;
		let treeY = (CANVAS_HEIGHT - MotherTree.HEIGHT) / 2 + 20;
		images.render(ImageName.MotherTree, treeX, treeY, (MotherTree.WIDTH * MotherTree.MAX_LEVEL), MotherTree.HEIGHT);
		
		context.font = '120px Smalimar';
		context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Mother Tree', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);

		context.font = '15px Marker';
		context.fillText('Play Game', (CANVAS_WIDTH / 4) + 2, CANVAS_HEIGHT - (CANVAS_HEIGHT / 5) - 10);
		context.fillText('Top Scores', (CANVAS_WIDTH / 4) + 2, CANVAS_HEIGHT - (CANVAS_HEIGHT / 5) + 5);
		context.fillText('Saved Games', CANVAS_WIDTH - (CANVAS_WIDTH / 3) + 2, CANVAS_HEIGHT - (CANVAS_HEIGHT / 5) -10);

		this.displayeSelected();
	}

	displayeSelected(){
		context.fillStyle = 'black';

		switch(this.currentSelect){
			case TitleSelect.Play:
				context.fillRect((CANVAS_WIDTH / 8), CANVAS_HEIGHT - (CANVAS_HEIGHT / 5) - 10, 
				TitleScreenState.SELECT_TOKEN_TIZE, TitleScreenState.SELECT_TOKEN_TIZE);
				return;
			case TitleSelect.TopScore:
				context.fillRect((CANVAS_WIDTH / 8), CANVAS_HEIGHT - (CANVAS_HEIGHT / 5) + 5, 
				TitleScreenState.SELECT_TOKEN_TIZE, TitleScreenState.SELECT_TOKEN_TIZE);
				return;
			case TitleSelect.SavedGames:
				context.fillRect((CANVAS_WIDTH / 2) + 10, CANVAS_HEIGHT - (CANVAS_HEIGHT / 5) - 10, 
				TitleScreenState.SELECT_TOKEN_TIZE, TitleScreenState.SELECT_TOKEN_TIZE);
				return;
		}
	}
}
