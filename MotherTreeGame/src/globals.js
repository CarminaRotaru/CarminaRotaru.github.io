import Images from "../lib/Images.js";
import StateMachine from "../lib/StateMachine.js";
import Timer from "../lib/Timer.js";
import Fonts from "../lib/Fonts.js";
import Sounds from "../lib/Sounds.js";

export const canvas = document.querySelector('canvas');
export const context = canvas.getContext('2d');

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

export const MAX_HIGH_SCORES = 10;
export const MAX_GAME_SAVES = 2;

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const timer = new Timer();
export const sounds = new Sounds();

// If true, render all hitboxes.
export const DEBUG = true;
