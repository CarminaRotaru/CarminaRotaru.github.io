/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import EnemyType from "../enums/EntityType.js";
import EntityType from "../enums/EntityType.js";
import EnemyStateName from "../enums/EnemyStateName.js";

export default class EntityAnimationFactory{
    static createAnimation(type, state){
        if(type == undefined){
            return {
                up: [],
                down: [],
                left: [],
                right: []
            }
        }
        
        switch(type){
            case EnemyType.Goblin:
                switch(state){
                    case EnemyStateName.Walking:
                        return {
                            up: [0, 1, 2, 3, 4, 5],
                            down: [6, 7, 8, 9, 10, 11],
                            left: [12, 13, 14, 15, 16, 17],
                            right: [18, 19, 20, 21, 22, 23]
                        };
                    case EnemyStateName.Idle:
                        return {
                            up: [0],
                            down: [6],
                            left: [12],
                            right: [18]
                        };
                    case EnemyStateName.Attack:
                        return {
                            up: [0, 9, 10, 11, 12],
                            down: [21, 30, 31, 32, 33],
                            left: [42, 51, 52, 53, 54],
                            right: [63, 72, 73, 74, 75]
                        }
                }
                
            case EntityType.Warrior:
                switch(state){
                    case EnemyStateName.Walking:
                        return {
                            up: [0, 1, 2, 3, 4],
                            down: [8, 9, 10, 11, 12],
                            left: [17, 18, 19, 20, 21],
                            right: [25, 26, 27, 28, 29]
                        };
                    case EnemyStateName.Idle:
                        return {
                            up: [0],
                            down: [8],
                            left: [17],
                            right: [25]
                        };
                    case EnemyStateName.Attack:
                        return {
                            up: [0, 1, 2, 3, 4, 5],
                            down: [6, 7, 8, 9, 10, 11],
                            left: [12, 13, 14, 15, 16, 17],
                            right: [18, 19, 20, 21, 22]
                        }
                }
            case EntityType.Skeleton:
                switch(state){
                    case EnemyStateName.Walking:
                        return{
                            up: [0, 1, 2, 3, 4, 5],
                            down: [6, 7, 8, 9, 10, 11],
                            left: [12, 13, 14, 15, 16, 17],
                            right: [18, 19, 20, 21, 22]
                        };
                    case EnemyStateName.Idle:
                        return {
                            up: [0],
                            down: [6],
                            left: [12],
                            right: [18]
                        };
                    case EnemyStateName.Attack:
                        return {
                            up: [1, 5, 6, 7],
                            down: [9, 13, 14, 15],
                            left: [17, 21, 22, 23],
                            right: [25, 29, 30, 31]
                        };
                }
        }
    }
}