const { ipcRenderer } = require('electron');
import { DB } from '../gameAssets/db_handler.js';

let cluesData = [];

getClues();

document.addEventListener('keydown', (e)=>{

    switch(e.code){
        case 'ArrowLeft':
            break;

        case 'ArrowRight':
            break;

        case 'Escape':
            ipcRenderer.send('menu');
            break;
    }
});

async function getClues(){
    let clues = await DB.getClues();
    let completed = await DB.checkFound();


    for(let i = 0; i < completed; i++){
        cluesData.push([clues[i], i+1]);
    }

    renderClues();
}

function renderClues(){

    const cluesWindow = document.querySelector('.found-clues');

    const row1 = document.createElement('div');
    const row2 = document.createElement('div');
    const row3 = document.createElement('div');

    for(let i = 0; i < cluesData.length; i++){
        const clue = document.createElement('p');
        clue.id = `clue${i}`;
        clue.innerHTML = `${cluesData[i][0]} <br> ${cluesData[i][1]}`;

        if(i < 5){
            row1.appendChild(clue)
        }
        else if(i < 10){
            row2.appendChild(clue);
        }
        else{
            row3.appendChild(clue);
        }
        
        cluesWindow.append(row1, row2, row3);

        //console.log(`${cluesData[i][0]} <br> ${cluesData[i][1]}`)
    }

}


