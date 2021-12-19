import Player from "../entities/Player.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, timer } from "../globals.js";
import MotherTree from "../objects/MotherTree.js";

export default class UserInterface {
	static SECONDS_IN_DAY = 60;
    static BAR_WIDTH = 75;
    static BAR_HEIGHT = 5;
    
    /**
	 * Displays the number of hearts in the top-left corner.
	 *
	 * @param {Player} player
     * @param {MotherTree} tree
	 */
	constructor(player, tree) {
		this.player = player;
        this.tree = tree;
	}

	render(time) {
        context.font = "12px Marker";
        context.fillText('Health: ', 40, 10);
        this.renderBar(70, 10, this.player.health, Player.INITIAL_HEALTH, true);

        context.fillText('Tree Lv.' + this.tree.level + ': ', 40, 20);
        this.renderBar(70, 20, this.tree.blood, this.tree.nextLevel, false);

        context.font = "15px Marker";

        let day = Math.floor(time / UserInterface.SECONDS_IN_DAY) + 1;
        let timeOfDay = time - (UserInterface.SECONDS_IN_DAY * (day - 1));

        context.fillText('Bag: ' + this.player.bloodBag + '/' + Player.BAG_MAX_CAPACITY, CANVAS_WIDTH - 50, 25);
        
        let fadeValue = timeOfDay / (UserInterface.SECONDS_IN_DAY / 2);
        
        if(timeOfDay < UserInterface.SECONDS_IN_DAY / 2){
            context.fillText('Day ' + day, CANVAS_WIDTH - 50, 10);
            context.fillStyle = 'rgb(0, 0, 0, 0)';
        } else{
            context.fillText('Night ' + day, CANVAS_WIDTH - 50, 10);
            context.fillStyle = 'rgb(0, 0, 0, 0.5)';
        }

        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

    renderBar(x, y, current, total, health){
        let radius = Math.PI / 2;
        
        context.fillStyle = 'white';
        this.roundedRect(x, y, UserInterface.BAR_WIDTH, UserInterface.BAR_HEIGHT, radius, true);

        let percentage = current / total;
        if(percentage == 0 && current > 0)
            percentage = 1;

        if(health){
            if(percentage > 0.75)
                context.fillStyle = 'green';
            else if(percentage > 0.25)
                context.fillStyle = 'yellow';
            else
                context.fillStyle = 'red';
        } else{
            context.fillStyle = 'purple';
        }

        this.roundedRect(x, y, UserInterface.BAR_WIDTH * percentage, UserInterface.BAR_HEIGHT, radius, true);

        context.fillStyle = 'black';
        this.roundedRect(x, y, UserInterface.BAR_WIDTH, UserInterface.BAR_HEIGHT, radius, false);
    }

    roundedRect(x, y, width, height, radius, fill){
        //https://www.codegrepper.com/code-examples/javascript/javascript+canvas+rectangle+rounded+corners
        //https://github.com/JAC-CS-Game-Programming-F21/7-Pokemon/blob/main/src/Pokemon-7/lib/DrawingHelpers.js
        context.save();
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();

        if(fill)
            context.fill();
        else
            context.stroke();
        
        context.restore();
    }
}
