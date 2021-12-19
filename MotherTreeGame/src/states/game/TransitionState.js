import State from "../../../lib/State.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, keys, stateMachine, timer } from "../../globals.js";

export default class GameOverState extends State { 
    static DURATION = 5;
    
    constructor() {
        super();

        this.fadeValue = 0;
	}

    enter(parameters){
        this.fromState = parameters.fromState;
        this.toState = parameters.toState;
        this.toStateEnterParameters = parameters.toStateEnterParameters;
        this.currentState = this.fromState;
        this.fadeValue = 0;
        
        this.fadeOut();
    }

	update(dt){
        timer.update(dt);
        console.log(this.fadeValue);
	}

	render() {		
		this.currentState.render();
        context.fillStyle = 'rgb(0, 0, 0, ' + this.fadeValue + ')';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

    fadeIn(){
        timer.tween(this, ['fadeValue'], [0], 0.5, () => {
            stateMachine.currentState = this.currentState;
        });
    }

    fadeOut(){
        timer.tween(this, ['fadeValue'], [1], 0.5, () => {
            this.currentState = this.toState;
            this.currentState.enter(this.toStateEnterParameters);
            this.fadeIn();
        });
    }
}
