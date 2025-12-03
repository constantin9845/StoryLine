import Player from "./Player.js";
import Camera from "./Camera.js";
import Input from "./Input.js";
import ClueManager from "./ClueManager.js";
import { riddle } from "./riddle.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");

        // Create modules
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.camera = new Camera(this.canvas.width, this.player);
        this.input = new Input();
        this.clues = new ClueManager();

        this.RIDDLE_STATE = false;

        // Load sprite
        this.player.loadImage(
            "https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png"
        ).then(() => {
            this.loop();
        });
    }

    loop = () => {
        this.update();
        this.draw();
        requestAnimationFrame(this.loop);
    };

    update() {
        this.player.update(this.input, this.RIDDLE_STATE);
        this.camera.update();

        this.clues.check(this.player.WALK_X, this.player.MID);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const { x: drawX } = this.camera.getDrawPosition();

        // Update background transform
        document.getElementById("front_bg").style.transform =
            `translateX(${this.camera.backgroundTransform}px)`;

        // Draw player
        this.player.draw(this.ctx, drawX, this.player.Y);
    }
}
