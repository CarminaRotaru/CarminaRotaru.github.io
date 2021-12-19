/**
 * Codder: Carmina Rotaru
 * Date: 12/18/2021
 */
import EntityType from "../enums/EntityType.js";
import Goblin from "../entities/Enemy/Goblin.js";
import Sprite from "../../lib/Sprite.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import Warrior from "../entities/Enemy/Warrior.js";
import Skeleton from "../entities/Enemy/Skeleton.js";

export default class EnemyFactory{
    static createSprites(type){
        switch(type){
            case EntityType.Goblin:
                return {
                    walking: this.getGoblinWalkingSprite(),
                    attack: this.getGoblinAttackSprite()
                };
            case EntityType.Warrior:
                return {
                    walking: this.getWarriorWalkingSprite(),
                    attack: this.getWarriorAttackSprite()
                }
            case EntityType.Skeleton:
                return {
                    walking: this.getSkeletonWalkingSprite(),
                    attack: this.getSkeletonAttackSprite()
                }
        }
    }

    static getSkeletonWalkingSprite(){
        var up = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.SkeletonUpRun),
            Skeleton.WIDTH,
            Skeleton.HEIGHT
        );
        var down = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.SkeletonDownRun),
                    Skeleton.WIDTH,
                    Skeleton.HEIGHT
                );
        var left = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.SkeletonLeftRun),
                    Skeleton.WIDTH,
                    Skeleton.HEIGHT
                );
        var right = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.SkeletonRightRun),
                    Skeleton.WIDTH,
                    Skeleton.HEIGHT
                );

        return up.concat(down, left, right);
    }

    static getSkeletonAttackSprite(){
        var up = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.SkeletonUpAttack),
            Skeleton.WIDTH,
            Skeleton.HEIGHT
        );
        var down = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.SkeletonDownAttack),
                    Skeleton.WIDTH,
                    Skeleton.HEIGHT
                );
        var left = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.SkeletonLeftAttack),
                    Skeleton.WIDTH,
                    Skeleton.HEIGHT
                );
        var right = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.SkeletonRightAttack),
                    Skeleton.WIDTH,
                    Skeleton.HEIGHT
                );

        return up.concat(down, left, right);
    }

    static getWarriorWalkingSprite(){
        var up = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.WarriorUpRun),
            Warrior.WIDTH,
            Warrior.HEIGHT
        );
        var down = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.WarriorDownRun),
                    Warrior.WIDTH,
                    Warrior.HEIGHT
                );
        var left = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.WarriorLeftRun),
                    Warrior.WIDTH,
                    Warrior.HEIGHT
                );
        var right = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.WarriorRightRun),
                    Warrior.WIDTH,
                    Warrior.HEIGHT
                );

        return up.concat(down, left, right);
    }

    static getWarriorAttackSprite(){
        var up = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.WarriorUpAttack),
            Warrior.WIDTH,
            Warrior.HEIGHT
        );
        var down = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.WarriorDownAttack),
                    Warrior.WIDTH,
                    Warrior.HEIGHT
                );
        var left = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.WarriorLeftAttack),
                    Warrior.WIDTH,
                    Warrior.HEIGHT
                );
        var right = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.WarriorRightAttack),
                    Warrior.WIDTH,
                    Warrior.HEIGHT
                );

        return up.concat(down, left, right);
    }

    static getGoblinWalkingSprite(){
        var up = Sprite.generateSpritesFromSpriteSheet(
                        images.get(ImageName.GoblinUpRun),
                        Goblin.WIDTH,
                        Goblin.HEIGHT
                    );
        var down = Sprite.generateSpritesFromSpriteSheet(
                        images.get(ImageName.GoblinDownRun),
                        Goblin.WIDTH,
                        Goblin.HEIGHT
                    );
        var left = Sprite.generateSpritesFromSpriteSheet(
                        images.get(ImageName.GoblinLeftRun),
                        Goblin.WIDTH,
                        Goblin.HEIGHT
                    );
        var right = Sprite.generateSpritesFromSpriteSheet(
                        images.get(ImageName.GoblinRightRun),
                        Goblin.WIDTH,
                        Goblin.HEIGHT
                    );

        return up.concat(down, left, right);
    }

    static getGoblinAttackSprite(){
        var up = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.GoblinUpAttack),
            Goblin.WIDTH,
            Goblin.HEIGHT
        );
        var down = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.GoblinDownAttack),
                    Goblin.WIDTH,
                    Goblin.HEIGHT
                );
        var left = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.GoblinLeftAttack),
                    Goblin.WIDTH,
                    Goblin.HEIGHT
                );
        var right = Sprite.generateSpritesFromSpriteSheet(
                    images.get(ImageName.GoblinRightAttack),
                    Goblin.WIDTH,
                    Goblin.HEIGHT
                );

        return up.concat(down, left, right);
    }
}