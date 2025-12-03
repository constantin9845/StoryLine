export default class Player {
    constructor(canvasWidth, canvasHeight) {

        // CONSTANTS
        this.SCALE = 2.5;
        this.WIDTH = 16;
        this.HEIGHT = 18;

        this.scaled_width = this.SCALE * this.WIDTH;
        this.scaled_height = this.SCALE * this.HEIGHT;

        this.CYCLE_LOOP = [0, 1, 0, 2];

        this.FACING_DOWN = 0;
        this.FACING_UP = 1;
        this.FACING_LEFT = 2;
        this.FACING_RIGHT = 3;

        this.FRAME_LIMIT = 12;
        this.MOVEMENT_SPEED = 4;

        // Position
        this.X = canvasWidth / 2;
        this.Y = canvasHeight * 0.94;

        this.FLOOR = this.Y;

        // Animation state
        this.CURRENT_DIR = this.FACING_DOWN;
        this.CURRENT_LOOP_INDEX = 0;
        this.framecount = 0;

        // Jump physics
        this.GRAVITY = 0.6;
        this.JUMP_VELOCITY = -15;
        this.VERTICAL_VELOCITY = 0;
        this.isJumping = false;
        this.isGround = true;

        // Walking range tracking
        this.MID = canvasWidth / 2;
        this.WALK_RANGE = canvasWidth * 3 - this.MID;
        this.RANGE_MID = this.WALK_RANGE - this.MID;
        this.WALK_X = this.X;

        // spriteSheet
        this.spriteSheet = new Image();
        this.isLoaded = false;
    }

    loadImage(url) {
        return new Promise(resolve => {
            this.spriteSheet.src = url;
            this.spriteSheet.onload = () => {
                this.isLoaded = true;
                resolve();
            };
        });
    }

    startJump() {
        if (this.isGround) {
            this.isJumping = true;
            this.isGround = false;
            this.VERTICAL_VELOCITY = this.JUMP_VELOCITY;
        }
    }

    update(input, riddleState) {
        if(riddleState){
            return;
        }

        // JUMP
        if (input.isPressed(" ") && this.isGround) {
            this.startJump();
        }

        if (!this.isGround || this.isJumping) {
            this.VERTICAL_VELOCITY += this.GRAVITY;
            this.Y += this.VERTICAL_VELOCITY;

            if (this.Y >= this.FLOOR) {
                this.Y = this.FLOOR;
                this.isJumping = false;
                this.isGround = true;
                this.VERTICAL_VELOCITY = 0;
            }
        }

        let hasHorizontalInput = false;

        // MOVE LEFT
        if (input.isPressed("a")) {
            this.move(-this.MOVEMENT_SPEED, this.FACING_LEFT);
            hasHorizontalInput = true;
        }
        // MOVE RIGHT
        if (input.isPressed("d")) {
            this.move(this.MOVEMENT_SPEED, this.FACING_RIGHT);
            hasHorizontalInput = true;
        }

        // ANIMATION TICK
        if (hasHorizontalInput && this.isGround) {
            this.framecount++;
            if (this.framecount >= this.FRAME_LIMIT) {
                this.framecount = 0;
                this.CURRENT_LOOP_INDEX =
                    (this.CURRENT_LOOP_INDEX + 1) % this.CYCLE_LOOP.length;
            }
        } else if (this.isGround) {
            this.CURRENT_LOOP_INDEX = 0;
            this.CURRENT_DIR = this.FACING_DOWN;
        }
    }

    move(dx, direction) {
        this.WALK_X += dx;
        this.WALK_X = Math.max(
            0,
            Math.min(this.WALK_X, this.WALK_RANGE - 25)
        );
        this.CURRENT_DIR = direction;
    }

    draw(ctx, drawX, drawY) {
        ctx.drawImage(
            this.spriteSheet,
            this.CYCLE_LOOP[this.CURRENT_LOOP_INDEX] * this.WIDTH,
            this.CURRENT_DIR * this.HEIGHT,
            this.WIDTH,
            this.HEIGHT,
            drawX,
            drawY,
            this.scaled_width,
            this.scaled_height
        );
    }
}
