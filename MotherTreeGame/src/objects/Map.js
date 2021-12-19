import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { getRandomPositiveInteger, didSucceedChance, getRandomNumber } from "../../lib/RandomNumberHelpers.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, images, timer, keys, stateMachine } from "../globals.js";
import Tile from "./Tile.js";
import Goblin from "../entities/Enemy/Goblin.js";
import EnemyStateName from "../enums/EnemyStateName.js";
import EnemyFactory from "../services/EnemyFactory.js";
import EnemyType from "../enums/EntityType.js";
import EnemyFollowingState from "../states/entity/enemy/EnemyFollowingState.js";
import MotherTree from "./MotherTree.js";
import Blood from "./Blood.js";
import GameObject from "./GameObject.js";
import GameStateName from "../enums/GameStateName.js";
import Skeleton from "../entities/Enemy/Skeleton.js";

export default class Map{
    static WIDTH = 100;//CANVAS_WIDTH / Tile.TILE_SIZE;
	static HEIGHT = 100;//Math.floor(CANVAS_HEIGHT / Tile.TILE_SIZE);

    static CENTER_X = CANVAS_WIDTH / 2;
    static CENTER_Y = CANVAS_HEIGHT / 2;

    static BOTTOM_EDGE = (Map.HEIGHT - 1) * (Tile.TILE_SIZE - Tile.BUFERSIZE);
    static TOP_EDGE = Tile.TILE_SIZE;
    static LEFT_EDGE = Tile.TILE_SIZE;
    static RIGHT_EDGE = (Map.WIDTH - 1) * (Tile.TILE_SIZE - Tile.BUFERSIZE);

    static NUM_ENEMIES = 50;

    constructor(player) {
		this.player = player;

        this.totalHeight = Map.HEIGHT * Tile.TILE_SIZE;
        this.totalWidth = Map.WIDTH * Tile.TILE_SIZE;

        this.dimensions = new Vector(Map.WIDTH, Map.HEIGHT);
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			Tile.TILE_SIZE,
			Tile.TILE_SIZE
		);

		this.tiles = this.generateMap();
        this.enemies = this.generateEnemies();
        this.motherTree = this.generateMotherTree();
        this.objects = [];

		// Used for centering the room on the canvas.
		//this.renderOffset = { x: Room.RENDER_OFFSET_X, y: Room.RENDER_OFFSET_Y };
	}

    update(dt, time){
        timer.update(dt);
        this.updatePlayer(dt);
        this.updateEnemies(dt);
    }

    updatePlayer(dt){
        let i = 0
        
        this.objects.forEach(obj => {
            if(obj.didCollideWithEntity(this.player.hitbox)){
                if(this.player.collectBlood()){
                    obj.onCollision(this.player);
                    this.objects.splice(i, 1);
                }
            }
        });

        if(this.motherTree.didCollideWithEntity(this.player.hitbox)){
            this.motherTree.onCollision(this.player);
            if(keys.Enter){
                this.motherTree.receiveBlood(this.player);
                keys.Enter = false;
            }
        }

        if(this.player.isDead)
            stateMachine.change(GameStateName.GameOver);
            /*stateMachine.change(GameStateName.Transition, {
                fromState: this,
                toState: stateMachine.states[GameStateName.GameOver]
            });*/

        this.player.update(dt);
    }

    updateEnemies(dt){
        let i = 0;

        this.enemies.forEach(enemy => {
            if(!enemy.isDazed){
                if(enemy.isWithinRange(this.player))
                    enemy.changeState(EnemyStateName.Following, this.player);
                
                this.enemies.forEach(colider => {
                    if(enemy != colider && enemy.isWithinRange(colider))
                        enemy.changeState(EnemyStateName.Following, enemy);
                });
                
                if(this.motherTree.didCollideWithEnemyEntity(enemy.hitbox)){
                    this.motherTree.onEnemyCollision(enemy);
                }

                if(enemy.isDead){
                    if(enemy.type != EnemyType.Skeleton){
                        this.objects.push(new Blood(enemy.mapPosition));

                        if(getRandomPositiveInteger(0, 100) < 60){
                            timer.wait(getRandomNumber(1, 100), () => {
                                let en = EnemyFactory.createEnemy(EnemyType.Skeleton);
                                en.reset();
                                en.changeState(EnemyStateName.Idle);
                                en.mapPosition.x = enemy.mapPosition.x;
                                en.mapPosition.y = enemy.mapPosition.y;
                                
                                this.enemies.push(en);
                            })
                        }
                    }

                    this.enemies.splice(i, 1);

                    return;
                }
                
                enemy.update(dt);
            }

            if(enemy.didCollideWithPlayerAttack(this.player.swordHitbox)){
                enemy.tackDamage(this.player.strength);
            }

            i++;
        });
    }

    createSkeleton(enemy){
        
    }

    render() {
		this.renderTiles();
        this.player.render();
        this.renderEnemies();
        this.renderObjects();
	}

    renderObjects(){
        var distanceX;
        var distanceY;

        this.renderMotherTree();
        
        this.objects.forEach(obj => {
            distanceX = obj.mapPosition.x - this.player.mapPosition.x;
            distanceY = obj.mapPosition.y - this.player.mapPosition.y;

            if(Math.abs(distanceX) < (canvas.width / 2) + Tile.TILE_SIZE
            && Math.abs(distanceY) < (canvas.height / 2) + Tile.TILE_SIZE){
                obj.position.x = this.player.position.x + distanceX;
                obj.position.y = this.player.position.y + distanceY;
                obj.setHitbox();

                obj.render();
            }
        });
    }

    renderMotherTree(){
        var distanceX;
        var distanceY;

        distanceX = this.motherTree.mapPosition.x - this.player.mapPosition.x;
        distanceY = this.motherTree.mapPosition.y - this.player.mapPosition.y;
        
        if(Math.abs(distanceX) < (canvas.width / 2) + Tile.TILE_SIZE
            && Math.abs(distanceY) < (canvas.height / 2) + Tile.TILE_SIZE){
                this.motherTree.position.x = this.player.position.x + distanceX;
                this.motherTree.position.y = this.player.position.y + distanceY;
                this.motherTree.setHitbox();

                this.motherTree.render();
        }
    }

    renderEnemies(){
        var distanceX;
        var distanceY;
        
        this.enemies.forEach(enemy => {
            distanceX = enemy.mapPosition.x - this.player.mapPosition.x;
            distanceY = enemy.mapPosition.y - this.player.mapPosition.y;
            
            if(Math.abs(distanceX) < (canvas.width / 2) + Tile.TILE_SIZE
                && Math.abs(distanceY) < (canvas.height / 2) + Tile.TILE_SIZE){
                enemy.position.x = this.player.position.x + distanceX;
                enemy.position.y = this.player.position.y + distanceY;

                enemy.render();
            }
        });
    }

    renderTiles(){
        var positionX = (canvas.width / 2) - this.player.mapPosition.x;
        var positionY = (canvas.height / 2) - this.player.mapPosition.y;
        
        for(let y = 0; y < Map.HEIGHT; y++){
            
            if(!(positionY < ((this.player.position.y - (canvas.height / 2)) - Tile.TILE_SIZE))){
                
                if(positionY > (this.player.position.y + (canvas.height / 2) + Tile.TILE_SIZE * 2))
                    break;
                
                for(let x = 0; x < Map.WIDTH; x++){
                    
                    if(!(positionX < ((this.player.position.x - (canvas.width / 2) - Tile.TILE_SIZE)))){
                        
                        if(positionX > (this.player.position.x + (canvas.width / 2) + Tile.TILE_SIZE * 2))
                            break;
                        
                        this.tiles[y][x].render(positionX, positionY);
                    }
                    
                    positionX += Tile.TILE_SIZE;
                }
            }

            positionX = (canvas.width / 2) - this.player.mapPosition.x;
            positionY += Tile.TILE_SIZE - Tile.BUFERSIZE;
        }
    }

    generateMap(){
        const tiles = [];
        
        for(let y = 0; y < Map.HEIGHT; y++){
            tiles.push([]);

            for(let x = 0; x < Map.WIDTH; x++){
                let tmp = getRandomPositiveInteger(0, Tile.TILENUMTYPE - 1);

                if(didSucceedChance(0.65)){
                    tiles[y].push(new Tile(x, y, this.sprites[0], 0));
                } else {
                    tiles[y].push(new Tile(x, y, this.sprites[tmp], tmp));
                }
            }
        }
        
        return tiles;
    }

    generateEnemies(){
        var enemies = [];
        let rnd = getRandomPositiveInteger(0, 100);
        
        for(let i = 0; i < Map.NUM_ENEMIES; i++){
            if(rnd < 50){
                enemies.push(EnemyFactory.createEnemy(EnemyType.Goblin));
            } else
                enemies.push(EnemyFactory.createEnemy(EnemyType.Warrior));
        }

        return enemies;
    }

    generateMotherTree(){
        //Create MotherTree
        var mapPosition = new Vector(
            Map.WIDTH * Tile.TILE_SIZE / 2,
            Map.HEIGHT * Tile.TILE_SIZE / 2,
        );
        return new MotherTree(mapPosition);
    }
}