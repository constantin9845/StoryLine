import { gameScreen } from '../gameAssets/gameScreen.js';
const { ipcRenderer } = require('electron');
const {readFile} = require('node:fs/promises')

document.body.width = window.innerWidth;
document.body.height = window.innerHeight;

let LEVEL = 0;
let transform = 0;

const game = new gameScreen();

game.loadImage(game.getImage());

constructLevel();


const title = document.getElementById('title');
const canvas = document.getElementById('canvas');
const clue = document.getElementById('clue');

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
    for(let i = 0; i < 3; i++){
        riddles.push(level_assests['clues'][i])
    }

    game.clues = riddles;

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

window.addEventListener('keydown', (e)=>{

    checkClue();

    if(game.keyMap.hasOwnProperty(e.key)){
        game.keyMap[e.key] = true;
    }

    if(e.key == 'Escape'){
        ipcRenderer.send('level-selection');
    }
});

window.addEventListener('keyup', (e)=>{

    if(game.keyMap.hasOwnProperty(e.key)){
        game.keyMap[e.key] = false;
    }
});

function checkClue(){

    if(Math.abs((game.MID+game.clues[0][0])-game.WALK_X) < 75){
        clue.innerHTML = `${game.clues[0][1]}`;
        clue.style.opacity = '1';
    }
    else if(Math.abs((game.MID+game.clues[1][0])-game.WALK_X) < 75){
        clue.innerHTML = `${game.clues[1][1]}`;
        clue.style.opacity = '1';
    }
    else{
        clue.style.opacity = '0';
        //clue.innerHTML = ` `;
    }

}


