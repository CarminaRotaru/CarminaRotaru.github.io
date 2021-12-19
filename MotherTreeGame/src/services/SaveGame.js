import { MAX_GAME_SAVES, MAX_HIGH_SCORES } from "../globals.js";
import Map from "../objects/Map.js";

export default class SaveManager{
    static loadHighScores(){
        let highScrores = JSON.parse(localStorage.getItem('highScores'));

        if(highScrores == null || highScrores.length == 0){
            highScrores = [];
            
            for(let i = 0; i < MAX_HIGH_SCORES; i++){
                highScrores.push({score: (i + 2) * 20});
            }

            localStorage.setItem('highScores', JSON.stringify(highScrores));
        }

        return highScrores;
    }

    /**
     * @param {Number} time 
     */
    static addHighScore(time){
        let highScores = SaveManager.loadHighScores();

        highScores.push({score: time});
        highScores = highScores.sort((a, b) => a.score - b.score);
        highScores.splice(MAX_HIGH_SCORES, 1);

        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    static loadSaveGame(){
        let saveGame = JSON.parse(localStorage.getItem('saveGame'));

        if(saveGame == null || saveGame.length == 0){
            saveGame = [];

            localStorage.setItem('saveGame', JSON.stringify(saveGame));
        }

        return saveGame;
    }

    /**
     * 
     * @param {Map} map 
     * @param {Number} time 
     */
    static addSaveGame(map, time){
        let saveGame = SaveManager.loadSaveGame();

        let enem = [];
        map.enemies.forEach(enemy => {
            enem.push({
                mapPosition: {
                    x: enemy.mapPosition.x,
                    y: enemy.mapPosition.y
                },
                isDead: enemy.isDead,
                isImmune: enemy.isImmune,
                type: enemy.type,
                stats: {
                    speed: enemy.speed,
                    strength: enemy.strength,
                    defence: enemy.defence,
                    energy: enemy.energy,
                    health: enemy.health
                },
            })
        });

        let tilx = [];
        let tily;
        map.tiles.forEach(tilex => {
            tily = [];

            tilex.forEach(tiley => {
                tily.push({
                    mapPosition: {
                        x: tiley.position.x,
                        y: tiley.position.y
                    },
                    sprite: tiley.spriteNum
                })
            });

            tilx.push(tily);
        });

        saveGame.push({
            player: {
                mapPosition: {
                    x: map.player.mapPosition.x,
                    y: map.player.mapPosition.y
                },
                direction: map.player.direction,
                bloodBag: map.player.bloodBag,
                isDead: map.player.isDead,
                isImmune: map.player.isImmune,
                health: map.player.health,
            },
            motherTree: {
                mapPosition: {
                    x: map.motherTree.mapPosition.x,
                    y: map.motherTree.mapPosition.y
                },
                currentFrame: map.motherTree.currentFrame,
                level: map.motherTree.level,
                blood: map.motherTree.blood,
                nextLevel: map.motherTree.nextLevel
            },
            enemies: enem,
            tile: tilx,
            objects: map.objects,
            time: time,
            name: Date.now().toString()
        });

        saveGame = saveGame.splice(MAX_GAME_SAVES - 1, 1);

        localStorage.setItem('saveGame', JSON.stringify(saveGame));
    }
}