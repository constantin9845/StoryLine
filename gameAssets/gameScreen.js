export class gameScreen{

    constructor(){
        this.SCALE = 2.5;
        this.WIDTH = 16;
        this.HEIGHT = 16;

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
        this.clueWindow = document.getElementById('clue');

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
        this.WALK_RANGE = (this.canvas.width*3)-this.MID;
        this.RANGE_MID = this.WALK_RANGE-this.MID;
        this.WALK_X = this.X;

        this.MOVE_BG_R = false;
        this.MOVE_BG_L = false;

        this.GRAVITY = 0.6;
        this.JUMP_VELOCITY = -15;
        this.VERTICAL_VELOCITY = 0;

        this.isJumping = false;
        this.isGround = true;
        this.FLOOR = this.Y;

        this.keyMap = {
            'a' : false,
            'd' : false,
            ' ' : false
        }

        this.clues;
        this.riddle;
        this.answer;
        this.story;

        this.backgroundTransform = 0;

        this.spriteSheet = new Image();

        this.isLoaded = false;

        this.spriteSheet.onload = () => {
            this.isLoaded = true;
            console.log("Assets loaded. Game starting...");
            this.startLoop();
        };

        this.characterRow = 0; 
        this.characterCol = 2; 
    }

    getImage(){return this.spriteSheet;}

    loadImage(image){
        image.src = 'https://opengameart.org/sites/default/files/tiny16_expaned_again.png';
        image.onload = ()=>{
            window.requestAnimationFrame(this.gameLoop);
        }
    }

    drawImage(frameX, frameY, canvasX, canvasY){

        const sheetX = (this.characterCol + frameX) * this.WIDTH;
        const sheetY = (this.characterRow + frameY) * this.HEIGHT;

        this.ctx.drawImage(
            this.spriteSheet,
            sheetX,
            sheetY,
            this.WIDTH,
            this.HEIGHT,
            canvasX,
            canvasY,
            this.scaled_width,
            this.scaled_height
        );
    }

    startJump(){
        if(this.isGround){
            this.isJumping = true;
            this.isGround = false;
            this.VERTICAL_VELOCITY = this.JUMP_VELOCITY;
        }
    }

    moveCharacter(deltaX, direction){

        this.WALK_X += deltaX;
        this.WALK_X = Math.max(0, Math.min(this.WALK_X, this.WALK_RANGE-25));

        this.CURRENT_DIR = direction;
    }

    gameLoop = () => {
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        let hasHorizontalInput = false;
        let isScrollingActive = false;

        if(this.keyMap[' '] && this.isGround){
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

        if(this.keyMap['a']){
            this.moveCharacter(-this.MOVEMENT_SPEED, this.FACING_LEFT);
            hasHorizontalInput = true;
        }
        if(this.keyMap['d']){
            this.moveCharacter(this.MOVEMENT_SPEED, this.FACING_RIGHT);
            hasHorizontalInput = true;
        }

        const isInScrollZone = this.WALK_X > this.MID && this.WALK_X < this.RANGE_MID;

        if(hasHorizontalInput && isInScrollZone){
            isScrollingActive = true;
        }

        if(isScrollingActive){
            this.MOVE_BG_L = (this.CURRENT_DIR === this.FACING_LEFT);
            this.MOVE_BG_R = (this.CURRENT_DIR === this.FACING_RIGHT);
        } 
        else{
            this.MOVE_BG_L = false;
            this.MOVE_BG_R = false;
        }

        if(hasHorizontalInput && this.isGround){
            this.framecount++;
            if(this.framecount>=this.FRAME_LIMIT){
                this.framecount = 0;
                this.CURRENT_LOOP_INDEX = (this.CURRENT_LOOP_INDEX + 1) % this.CYCLE_LOOP.length;
            }
        }
        else if(!hasHorizontalInput && this.isGround){
            this.CURRENT_LOOP_INDEX = 0;
            this.CURRENT_DIR = this.FACING_DOWN;
        }

        if (this.MOVE_BG_L) {
            this.backgroundTransform += 5; 
        } else if (this.MOVE_BG_R) {
            this.backgroundTransform -= 5;
        }

        document.getElementById('front_bg').style.transform = 
            `translateX(${this.backgroundTransform}px)`;


        if(this.WALK_X > this.MID && this.WALK_X < this.RANGE_MID){
            cameraOffset = this.WALK_X - this.MID;
            this.X = this.MID;
        }
        else if(this.WALK_X >= this.RANGE_MID){
            cameraOffset = this.WALK_RANGE - this.canvas.width;
            
            this.X = this.canvas.width - (this.WALK_RANGE - this.WALK_X)-10;
        }
        else { 
            cameraOffset = 0;
            this.X = this.WALK_X;
        }

        this.checkClue();


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

    checkClue(){

        switch(this.clues.length){
            case 1: 
                if(Math.abs((this.MID+this.clues[0][0])-this.WALK_X) < 30){
                    clue.innerHTML = `${this.clues[0][1]}`;
                    clue.style.opacity = '1';
                }
                else{
                    clue.style.opacity = '0';
                }
                break;
            case 2:
                if(Math.abs((this.MID+this.clues[0][0])-this.WALK_X) < 30){
                    clue.innerHTML = `${this.clues[0][1]}`;
                    clue.style.opacity = '1';
                }
                else if(Math.abs((this.MID+this.clues[1][0])-this.WALK_X) < 30){
                    clue.innerHTML = `${this.clues[1][1]}`;
                    clue.style.opacity = '1';
                }
                else{
                    clue.style.opacity = '0';
                }
                break;
            case 3:
                if(Math.abs((this.MID+this.clues[0][0])-this.WALK_X) < 30){
                    clue.innerHTML = `${this.clues[0][1]}`;
                    clue.style.opacity = '1';
                }
                else if(Math.abs((this.MID+this.clues[1][0])-this.WALK_X) < 30){
                    clue.innerHTML = `${this.clues[1][1]}`;
                    clue.style.opacity = '1';
                }
                else if(Math.abs((this.MID+this.clues[2][0])-this.WALK_X) < 30){
                    clue.innerHTML = `${this.clues[2][1]}`;
                    clue.style.opacity = '1';
                }
                else{
                    clue.style.opacity = '0';
                }
                break;
        }
    }

    loadRiddle(){
        if(Math.abs(this.WALK_RANGE-this.WALK_X) < 500){
            clue.innerHTML = `${this.riddle}`;
            clue.style.opacity = '1';
        }
    }
}