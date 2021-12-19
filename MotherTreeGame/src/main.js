/**
 * Zelda-0
 * The "Day-0" Update
 *
 * Original Lua by: Colton Ogden (cogden@cs50.harvard.edu)
 * Adapted to JS by: Vikram Singh (vikram.singh@johnabbott.qc.ca)
 *
 * The Legend of Zelda is a top-down dungeon crawler where the player
 * controls a sword and shield wielding character named Link. The games
 * in this series generally all include elements of puzzles, action,
 * adventure, and exploration. Over the course of the game, Link will
 * acquire various items and upgrades that he can use to defeat enemies
 * and solve puzzles. The first game in the series was released in 1986
 * on Nintendo's Famicom Disk System and was revolutionary for its time.
 * It is widely considered to be one of the best game franchises to date.
 *
 * Art
 * https://opengameart.org/content/top-down-dungeon-tileset
 * https://opengameart.org/comment/50905
 * https://opengameart.org/content/zelda-like-tilesets-and-sprites
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/game/PlayState.js";
import TitleScreenState from "./states/game/TitleScreenState.js";
import GameOverState from "./states/game/GameOverState.js";
import TransitionState from "./states/game/TransitionState.js";
import VictoryState from "./states/game/VictoryState.js";
import TopScoreState from "./states/game/TopScoreState.js";
import SavedGameState from "./states/game/SavedGameState.js";

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
	// @ts-ignore
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.Play, new PlayState());
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.Transition, new TransitionState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.TopScore, new TopScoreState());
stateMachine.add(GameStateName.SavedGames, new SavedGameState());

stateMachine.change(GameStateName.TitleScreen, 30);

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
