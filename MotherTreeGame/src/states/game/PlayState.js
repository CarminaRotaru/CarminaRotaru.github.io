/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import State from "../../../lib/State.js";
import Player from "../../entities/Player.js";
import GameStateName from "../../enums/GameStateName.js";
import SoundName from "../../enums/SoundName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, keys, sounds, stateMachine, timer } from "../../globals.js";
import Map from "../../objects/Map.js";
import MotherTree from "../../objects/MotherTree.js";
import UserInterface from "../../services/UserInterface.js";
import SaveGame from "../../services/SaveGame.js";
import EnemyFactory from "../../services/EnemyFactory.js";
import PlayerStateName from "../../enums/PlayerStateName.js";
import Blood from "../../objects/Blood.js";
import Vector from "../../../lib/Vector.js";
import ImageName from "../../enums/ImageName.js";

export default class PlayState extends State {
	static MAX_DAYS = 30;
	static FAST_FORWARD_LENGTH = 40;
	static DT_SPEED_UP = 6;
	
	constructor() {
		super();

		this.player = new Player();
		this.map = new Map(this.player);
		this.userInterface = new UserInterface(this.player, this.map.motherTree);
		this.time = 0;
		this.fastForward = false;
	}

	enter(game){
		sounds.play(SoundName.GameMusic);
		
		if(game == undefined){
			this.player.reset();
			this.map = new Map(this.player);
	
			this.map.enemies.forEach(enemy => {
				enemy.reset();
			});

			this.fastForward = false;
		} else{
			this.time = game.time;
			this.loadPlayer(game);
			this.loadMotherTree(game);
			this.loadEnemies(game);
			this.loadObjects(game);
			this.loadTiles(game);
		}

		timer.clear();
		timer.addTask(() => {
			this.time++;
			if(this.time >= UserInterface.SECONDS_IN_DAY * PlayState.MAX_DAYS){
				stateMachine.change(GameStateName.Transition, {
					fromState: stateMachine.states[GameStateName.Play],
					toState: stateMachine.states[GameStateName.GameOver]
				});
			}
		}, 1, Infinity);

		this.userInterface = new UserInterface(this.player, this.map.motherTree);
	}

	exit(){
		sounds.stop(SoundName.GameMusic);
	}

	update(dt){
		if(keys['f']){
			keys['f'] = false;
			this.fastForward = true;
			this.player.changeState(PlayerStateName.Sleep);

			timer.wait(PlayState.FAST_FORWARD_LENGTH, () => {
				this.fastForward = false;
				this.player.changeState(PlayerStateName.Idle);
				this.player.sleep();
				dt = dt / PlayState.DT_SPEED_UP;
			});
		}
		
		if(this.fastForward){
			dt = dt * PlayState.DT_SPEED_UP;
		}
		
		this.map.update(dt, this.time);

		if(this.map.motherTree.level == MotherTree.MAX_LEVEL){
			stateMachine.change(GameStateName.Transition, {
				fromState: stateMachine.states[GameStateName.Play],
				toState: stateMachine.states[GameStateName.Victory],
				toStateEnterParameters: this.time
			});
			//stateMachine.change(GameStateName.Victory, this.time);
			SaveGame.addHighScore(this.time);
		}

		if(keys['l']){
			keys['l'] = false;
			SaveGame.addSaveGame(this.map, this.time);
		}

		timer.update(dt);
	}

	render() {
		if(this.fastForward){
			images.render(ImageName.Night, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		}else{
			this.map.render();
			this.userInterface.render(this.time);
		}
	}

	loadObjects(game){
		let object;
		this.map.objects = [];
		
		game.objects.forEach(obj => {
			object = new Blood(
				new Vector(obj.mapPosition.x, obj.mapPosition.y)
			);
			
			this.map.objects.push(object);
		});
	}

	loadTiles(game){
		let x = 0;
		let y = 0;
		
		this.map.tiles.forEach(tileRow => {
			tileRow.forEach(tile => {
				tile.position.x = game.tile[y][x].mapPosition.x;
				tile.position.y = game.tile[y][x].mapPosition.y;
				tile.spriteNum = game.tile[y][x].sprite;
				tile.sprite = this.map.sprites[game.tile[y][x].sprite];

				x++;
			});

			console.log(y);
			x = 0;
			y++;
		});
	}

	loadEnemies(game){
		let enemy;
		this.map.enemies = [];
		
		for(let i = 0; i < game.enemies.length; i++){
			enemy = EnemyFactory.createEnemy(game.enemies[i].type);
			enemy.reset();

			enemy.mapPosition.x = game.enemies[i].mapPosition.x;
			enemy.mapPosition.y = game.enemies[i].mapPosition.y;

			enemy.isDead = game.enemies[i].isDead;
			enemy.isImmune = game.enemies[i].IsImmune;
			enemy.type = game.enemies[i].type;
			
			enemy.speed = game.enemies[i].stats.speed;
			enemy.strength = game.enemies[i].stats.strength;
			enemy.defence = game.enemies[i].stats.defence;
			enemy.energy = game.enemies[i].stats.energy;
			enemy.health = game.enemies[i].stats.health;
			
			this.map.enemies.push(enemy);
		}
	}

	loadMotherTree(game){
		this.map.motherTree.mapPosition.x = game.motherTree.mapPosition.x;
		this.map.motherTree.mapPosition.y = game.motherTree.mapPosition.y;
		this.map.motherTree.currentFrame = game.motherTree.currentFrame;
		this.map.motherTree.level = game.motherTree.level;
		this.map.motherTree.blood = game.motherTree.blood;
		this.map.motherTree.nextLevel = game.motherTree.nextLevel;
	}

	loadPlayer(game){
		this.player = new Player();

		this.player.mapPosition.x = game.player.mapPosition.x;
		this.player.mapPosition.y = game.player.mapPosition.y;
		this.player.direction = game.player.direction;
		this.player.bloodBag = game.player.bloodBag;
		this.player.isDead = game.player.isDead;
		this.player.isImmune = game.player.isImmune;
		this.player.health = game.player.health;

		this.player.stateMachine.change(PlayerStateName.Idle);

		this.map.player = this.player;
	}
}
