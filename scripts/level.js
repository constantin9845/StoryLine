import { gameScreen } from '../gameAssets/gameScreen.js';
const { ipcRenderer } = require('electron');

document.body.width = window.innerWidth;
document.body.height = window.innerHeight;

let LEVEL = 0;
let transform = 0;

const game = new gameScreen();

game.loadImage(game.getImage());

constructLevel();


const title = document.getElementById('title');
const canvas = document.getElementById('canvas');

async function constructLevel(){
    
    LEVEL = await waitForLevelReq();

    title.innerHTML = `Level ${LEVEL}`;

    document.body.style.backgroundImage = `url('./level_imgs/bg.jpg')`;

    let front_bg = document.createElement('img');
    front_bg.src = './level_imgs/front_bg.png';
    front_bg.id = 'front_bg';

    document.body.appendChild(front_bg);
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


