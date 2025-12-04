//import { gameScreen } from '../gameAssets/gameScreen.js';
import { riddle } from '../gameAssets/riddle.js';
import { DB } from '../gameAssets/db_handler.js';

import { Game } from '../gameAssets/Game.js';


const { ipcRenderer } = require('electron');
const {readFile} = require('node:fs/promises');

document.body.width = window.innerWidth;
document.body.height = window.innerHeight;

let LEVEL = 0;
let PAUSE = false;
let riddleW;

//const game = new gameScreen();
let game;


const title = document.getElementById('title');

async function constructLevel(){
    
    LEVEL = await waitForLevelReq();

    title.innerHTML = `Level ${LEVEL}`;

    const data = JSON.parse(await readFile('./assets.json', 'utf-8'));

    let level_assets =
        data[`level${LEVEL}`] !== undefined ?
        data[`level${LEVEL}`] :
        data['default'];

    document.body.style.backgroundImage = `url('./level_imgs/${level_assets['bg']}')`;

    let front_bg = document.createElement('img');
    front_bg.src = `./level_imgs/${level_assets['front_bg']}`;
    front_bg.id = 'front_bg';

    document.body.appendChild(front_bg);

    let riddles = []
    for(let i = 0; i < level_assets['clues'].length; i++){
        riddles.push(level_assets['clues'][i])
    }

    return {
        clues: riddles,
        riddle: level_assets['riddle'],
        answer: level_assets['answer'],
        story: level_assets['story'],
        assets: level_assets
    }
}

function waitForLevelReq(){
    return new Promise((resolve)=>{

        const handler = (event, data) =>{
            resolve(data);
        }

        ipcRenderer.once('res_current_level', handler);
        ipcRenderer.send('get_current_level');
    })
}

constructLevel().then((levelData) => {
    game = new Game();

    game.clues.setClues(levelData.clues);
    game.clues.setRiddle(levelData.riddle);
    game.clues.setAnswer(levelData.answer);
    game.clues.setStory(levelData.story);

    riddleW = new riddle(levelData.assets);
});

const pauseWidow = document.createElement('div');
pauseWidow.id = 'pause';
document.body.appendChild(pauseWidow);

const riddleWindow = document.createElement('div');
riddleWindow.id = 'riddle';
document.body.appendChild(riddleWindow);

let riddle_content = document.createElement('p');
riddle_content.id = 'clue_text';
riddleWindow.appendChild(riddle_content);

const storyWindow = document.createElement('div');
storyWindow.id = 'story';
document.body.appendChild(storyWindow);

let story_content = document.createElement('p');
story_content.id = 'story_text';
storyWindow.appendChild(story_content);

window.addEventListener('keydown', (e)=>{

    const p = game.player;

    // Diplay starting paragraph
    if(Math.abs(p.MID-p.WALK_X) <= 150){
        story_content.innerHTML = game.clues.story;
        storyWindow.style.display = 'flex';
    }
    else if(Math.abs(p.MID-p.WALK_X) > 150){
        storyWindow.style.display = 'none';
    }


    // If not in last part and not in riddle state --> display riddle mode button
    if(Math.abs(p.WALK_RANGE-p.WALK_X) <= 500 && !game.RIDDLE_STATE){
        riddleWindow.style.display = 'flex';
        riddle_content.innerHTML = 'Press [e] to start riddle';
        
        // enter riddle mode
        if(e.key === 'e'){
            game.RIDDLE_STATE = true;
            let ridt = riddleW.create_riddle();
            riddleWindow.appendChild(ridt);
            riddleWindow.style.width = '70vw';
            riddleWindow.style.height = '50vh';

            if(riddleW.type == 1){
                riddle_content.innerHTML = `press [Esc] to leave<br>press [Enter] to submit<br>[...] start typing`;
            }
            else if(riddleW.type == 2){
                document.getElementById(`band${riddleW.Sequence_col}`).style.backgroundColor = '#c7c7c7';
                riddle_content.innerHTML = `press [Esc] to leave<br>press [Enter] to submit<br>Use [a,w,s,d] to find the right combination`;
            }
            else{
                riddle_content.innerHTML = `press [Esc] to leave<br>press [Space] to submit`;
            }

            return;
        }
    }
    // hide riddle mode button
    else if(Math.abs(p.WALK_RANGE-p.WALK_X) > 500){
        riddleWindow.style.display = 'none';
    }

    // after entering riddle state
    if(game.RIDDLE_STATE){
        // exit riddle state
        if(e.key === 'Escape'){
            game.RIDDLE_STATE = false; 
            riddleWindow.style.width = '30%';
            riddleWindow.style.height = 'unset';

            riddleWindow.removeChild(riddleWindow.childNodes[1]);
            riddle_content.innerHTML = 'Press [e] to start riddle';
            return;
        }

        // check what type of riddle
        switch(riddleW.type){
            // MCQ
            case 0:
                if(e.key === 'a' || e.key === 'd'){
                    riddleW.update_MCQ(e.key);
                }

                if(e.key === ' '){
                    if(riddleW.check_input()){
                        DB.addClue(LEVEL);
                        alert('Correct!')
                        ipcRenderer.send('level-selection')
                    }
                    else{
                        alert("Wrong!");
                    }
                    
                }
                break;
            // Entering a word
            case 1:
                riddle_content.innerHTML = `press [Esc] to leave<br>press [Enter] to submit<br>[...] start typing`;
                if(e.key != 'Enter'){
                    if(e.key != 'Shift' && e.key != 'Alt' && e.key != 'Control'){
                        riddleW.update_Enter(e.key);
                    }
                    
                }
                if(e.key == 'Enter'){
                    if(riddleW.check_input()){
                        DB.addClue(LEVEL);
                        alert("correct!");
                        ipcRenderer.send('level-selection')
                    }
                    else{
                        riddle_content.innerHTML = `INCORRECT!`;
                    }
                    riddleW.empty_Enter();
                }
                break;
            // match sequence
            case 2:
                riddle_content.innerHTML = `press [Esc] to leave<br>press [Enter] to submit<br>Use [a,w,s,d] to find the right combination`;
                if(e.key == 'Enter'){
                    if(riddleW.check_input()){
                        DB.addClue(LEVEL);
                        alert("correct!");
                        ipcRenderer.send('level-selection')
                    }
                    else{
                        riddle_content.innerHTML = `INCORRECT!`;
                    }
                }
                else if(e.key == 'a' || e.key == 'w' || e.key == 'd' || e.key == 's'){
                    riddleW.update_Wheel(e.key);
                }
        }
        
        return;
    }

    // During free walk
    if(!PAUSE && !game.RIDDLE_STATE){
        if(game.input.isPressed(e.key)){
            game.input.keyMap[e.key] = true;
        }
        // exit game?
        else if(e.key === 'Escape'){
            riddleWindow.style.display = 'none';
            storyWindow.style.display = 'none';
            pauseWidow.style.display = 'flex';
            let text = document.createElement('p');
            text.id = 'warning'
            text.innerHTML = "Are you sure you want to quit?";

            let p = document.createElement('p');
            p.id = 'confirm';
            p.innerHTML = "Press: [ Enter (quit) | Escape (continue) ]"

            pauseWidow.appendChild(text);
            pauseWidow.appendChild(p);

            PAUSE = true;
        }
    }
    else if(PAUSE){
        if(e.key === 'Enter'){
            pauseWidow.removeChild(document.getElementById('warning'));
            pauseWidow.removeChild(document.getElementById('confirm'));
            pauseWidow.style.display = 'none';
            ipcRenderer.send('level-selection');
            PAUSE = false;
        }
        else if(e.key === 'Escape'){
            // continue
            pauseWidow.removeChild(document.getElementById('warning'));
            pauseWidow.removeChild(document.getElementById('confirm'));
            pauseWidow.style.display = 'none';
            PAUSE = false;
        }
    }
});

window.addEventListener('keyup', (e)=>{

    if(game.input.isPressed(e.key)){
        game.input.keyMap[e.key] = false;
    }
});









