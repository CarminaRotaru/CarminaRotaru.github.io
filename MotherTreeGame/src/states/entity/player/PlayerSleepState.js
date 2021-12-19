import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";

export default class PlayerSleepState extends State{
    constructor(player){
        super();

        this.player = player;
    }

    enter(){
    }

    update(){

    }
}