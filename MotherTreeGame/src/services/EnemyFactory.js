/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import EnemyType from "../enums/EntityType.js";
import Goblin from "../entities/Enemy/Goblin.js";
import EntityType from "../enums/EntityType.js";
import Warrior from "../entities/Enemy/Warrior.js";
import Skeleton from "../entities/Enemy/Skeleton.js";

export default class EnemyFactory{
    static createEnemy(type){
        switch(type){
            case EnemyType.Goblin:
                return new Goblin();
            case EntityType.Warrior:
                return new Warrior();
            case EntityType.Skeleton:
                return new Skeleton();
        }
    }
}