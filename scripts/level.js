import { gameScreen } from '../gameAssets/gameScreen.js';
const { ipcRenderer } = require('electron');
const {readFile} = require('node:fs/promises')

document.body.width = window.innerWidth;
document.body.height = window.innerHeight;

let LEVEL = 0;
let PAUSE = false;
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

const pauseWidow = document.getElementById('pause')

window.addEventListener('keydown', (e)=>{

    if(!PAUSE){
        if(game.keyMap.hasOwnProperty(e.key)){
            game.keyMap[e.key] = true;
        }
        else if(e.key === 'Escape'){
            let text = document.createElement('p');
            text.id = 'warning'
            text.innerHTML = "Are you sure you want to quit?";

            pauseWidow.appendChild(text);

            PAUSE = true;
        }
    }
    else{

        if(e.key === 'Enter'){
            pauseWidow.removeChild(document.getElementById('warning'));
            ipcRenderer.send('level-selection');
            PAUSE = false;
        }
        else if(e.key === 'Escape'){
            // continue
            pauseWidow.removeChild(document.getElementById('warning'));
            PAUSE = false;
        }

    }


});

window.addEventListener('keyup', (e)=>{

    if(game.keyMap.hasOwnProperty(e.key)){
        game.keyMap[e.key] = false;
    }
});





