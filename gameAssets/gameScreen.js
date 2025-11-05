export class gameScreen{

    constructor(){
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

        this.canvas = document.getElementById('canvas');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext('2d');
        this.keyPresses = {a:false, d:false, space:false};

        this.CURRENT_DIR = this.FACING_DOWN;
        this.CURRENT_LOOP_INDEX = 0;
        this.framecount = 0;

        this.X = this.canvas.width/2;
        this.Y = this.canvas.height*0.94;
        

        this.MID = this.canvas.width/2;
        this.WALK_RANGE = this.canvas.width*2;
        this.RANGE_MID = this.WALK_RANGE-this.MID;
        this.WALK_X = this.X;

        this.MOVE_BG = false;

        this.GRAVITY = 0.5;
        this.JUMP_VELOCITY = -10;
        this.VERTICAL_VELOCITY = 0;

        this.isJumping = false;
        this.isGround = true;
        this.FLOOR = this.Y;

        this.spriteSheet = new Image();

        this.isLoaded = false;

        this.spriteSheet.onload = () => {
            this.isLoaded = true;
            console.log("Assets loaded. Game starting...");
            this.startLoop();
        };
    }

    getImage(){return this.spriteSheet;}

    loadImage(image){
        image.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
        image.onload = ()=>{
            window.requestAnimationFrame(this.gameLoop);
        }
    }

    keyDownListener(key){
        this.keyPresses[key] = true;
    }

    keyUpListener(key){
        this.keyPresses[key] = false;
    }

    drawImage(frameX, frameY, canvasX, canvasY){
        this.ctx.drawImage(
            this.spriteSheet,
            frameX * this.WIDTH,
            frameY * this.HEIGHT,
            this.WIDTH,
            this.HEIGHT,
            canvasX,
            canvasY,
            this.scaled_width,
            this.scaled_height
        )
    }

    startJump(){
        if(this.isGround){
            this.isJumping = true;
            this.isGround = false;
            this.VERTICAL_VELOCITY = this.JUMP_VELOCITY;
        }
    }

    moveCharacter(deltaX, direction){

        console.log(`X: ${this.WALK_X}`);
        console.log(this.MID);
        console.log(this.WALK_RANGE-this.MID);

        // rules to move background
        if(this.WALK_X >= this.MID && this.WALK_X <= (this.WALK_RANGE-this.MID)){
            this.MOVE_BG = true;
            console.log('MOVE BG!');
        }
        else{
            this.MOVE_BG = false;
        }

        if(this.X + deltaX > 0 && this.X+this.scaled_width+deltaX < this.canvas.width){
            
            if(this.WALK_X > this.MID && this.WALK_X < (this.WALK_RANGE-this.MID)){
                this.WALK_X += deltaX;
            }
            else{
                this.WALK_X += deltaX;
                this.X += deltaX;
            }
        }

        this.CURRENT_DIR = direction;
    }

    gameLoop = () => {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        let hasMoved = false;

        if(this.keyPresses.a){
            this.moveCharacter(-this.MOVEMENT_SPEED, this.FACING_LEFT);
            hasMoved = true;
        }
        else if(this.keyPresses.d){
            this.moveCharacter(this.MOVEMENT_SPEED, this.FACING_RIGHT);
            hasMoved = true;
        }

        if(this.keyPresses.space && this.isGround){
            this.startJump();
        }

        if(!this.isGround || this.isJumping){
            this.VERTICAL_VELOCITY += this.GRAVITY;

            this.Y += this.VERTICAL_VELOCITY;

            if(this.Y >= this.FLOOR){
                this.Y = this.FLOOR;
                this.isJumping = false;
                this.isGround = true;
                this.VERTICAL_VELOCITY = 0;
            }
        }

        if(hasMoved){
            this.framecount++;
            if(this.framecount >= this.FRAME_LIMIT){
                this.framecount = 0;
                this.CURRENT_LOOP_INDEX++;

                if(this.CURRENT_LOOP_INDEX >= this.CYCLE_LOOP.length){
                    this.CURRENT_LOOP_INDEX = 0;
                }
            }
        }

        if(!hasMoved){
            this.CURRENT_LOOP_INDEX = 0;
            this.CURRENT_DIR = this.FACING_DOWN;
        }

        this.drawImage(this.CYCLE_LOOP[this.CURRENT_LOOP_INDEX], this.CURRENT_DIR, this.X, this.Y);
        window.requestAnimationFrame(this.gameLoop);
    }

    

    startLoop() {
        const loop = () => {
            this.update();
            this.draw();
            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
    }


}