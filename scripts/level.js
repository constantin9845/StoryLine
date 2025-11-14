import { gameScreen } from '../gameAssets/gameScreen.js';
const { ipcRenderer } = require('electron');
const {readFile} = require('node:fs/promises')

document.body.width = window.innerWidth;
document.body.height = window.innerHeight;

let LEVEL = 0;
let PAUSE = false;
let RIDDLE_STATE = false;
let transform = 0;

const game = new gameScreen();

game.loadImage(game.getImage());

constructLevel();


const title = document.getElementById('title');
const canvas = document.getElementById('canvas');

async function constructLevel(){
    
    LEVEL = await waitForLevelReq();

    title.innerHTML = `Level ${LEVEL}`;

    const data = JSON.parse(await readFile('./assets.json', 'utf-8'));

    let level_assests;
    if(data[`level${LEVEL}`] == undefined){
        level_assests = data['default'];
    }
    else{
        level_assests = data[`level${LEVEL}`];
    }

    document.body.style.backgroundImage = `url('./level_imgs/${level_assests['bg']}')`;

    let front_bg = document.createElement('img');
    front_bg.src = `./level_imgs/${level_assests['front_bg']}`;
    front_bg.id = 'front_bg';

    document.body.appendChild(front_bg);

    let riddles = []
    for(let i = 0; i < level_assests['clues'].length; i++){
        riddles.push(level_assests['clues'][i])
    }

    game.clues = riddles;
    game.riddle = level_assests['riddle'];
    game.answer = level_assests['answer'];
    game.story = level_assests['story'];

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

    if(Math.abs(game.MID-game.WALK_X) <= 100){
        story_content.innerHTML = game.story;
        storyWindow.style.display = 'flex';
    }
    else if(Math.abs(game.MID-game.WALK_X) > 100){
        storyWindow.style.display = 'none';
    }


    if(Math.abs(game.WALK_RANGE-game.WALK_X) <= 500 && !RIDDLE_STATE){
        riddleWindow.style.display = 'flex';
        riddle_content.innerHTML = 'Press [e] to start riddle';
        
        // enter riddle mode
        if(e.key === 'e'){
            RIDDLE_STATE = true;
        }
    }
    else if(Math.abs(game.WALK_RANGE-game.WALK_X) > 500){
        riddleWindow.style.display = 'none';
    }

    if(RIDDLE_STATE){
        if(e.key === 'Escape'){
            RIDDLE_STATE = false; 
            riddle_content.innerHTML = 'Press [e] to start riddle';
        }
        else{
            riddle_content.innerHTML = `${game.riddle}\n(press [Esc] to leave)`;
        }
        return;
    }

    if(!PAUSE && !RIDDLE_STATE){
        if(game.keyMap.hasOwnProperty(e.key)){
            game.keyMap[e.key] = true;
        }
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

    if(game.keyMap.hasOwnProperty(e.key)){
        game.keyMap[e.key] = false;
    }
});









