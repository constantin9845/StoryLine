const { ipcRenderer } = require('electron');
import { DB } from '../gameAssets/db_handler.js';

let cluesData = [];
let solution = [];

getClues();

// navigate between clue board and queue option
let clueWindow = false;
let queueWindow = false;
let current = 0; // 0 = hovering over clue option
document.querySelector('.found-clues').style.backgroundColor = 'yellow';

// clue navigation
let currentClue = 1;

// pin navigation
let currentPin = 1;

// Check for selecting Clue tab and Queue
document.addEventListener('keydown', (e)=>{

    if(!clueWindow && !queueWindow){
        document.querySelector('.found-clues').style.opacity = '1';
        document.querySelector('.submit-zone').style.opacity = '1';
        switch(e.code){
            // up = 0
            case 'ArrowUp':
                hoverOptions(current);
                break;

            // down = 2
            case 'ArrowDown':
                hoverOptions(current);
                break;

            // select
            case 'Space':
                clueWindow = (current == 0);
                queueWindow = (current == 1);

                if(clueWindow){
                    document.getElementById(`clue0`).style.backgroundColor = 'red';
                    document.querySelector('.submit-zone').style.opacity = '0.1';
                    return;
                }
                if(queueWindow){
                    if(queue.length >= 1){
                        document.getElementById(`pin${queue[0]}`).style.backgroundColor = 'red';
                    }
                    document.querySelector('.found-clues').style.opacity = '0.1';
                    return;
                }

            case 'Escape':
                ipcRenderer.send('menu');
        }
    }
    if(clueWindow){
        document.querySelector('.submit-zone').style.opacity = '0.1';
        switch(e.code){
            // up = 0
            case 'ArrowUp':
                updateClue(0, currentClue, cluesData.length);
                break;

            // right = 1
            case 'ArrowRight':
                updateClue(1, currentClue, cluesData.length);
                break;

            // down = 2
            case 'ArrowDown':
                updateClue(2, currentClue, cluesData.length);
                break;

            // left = 3
            case 'ArrowLeft':
                updateClue(3, currentClue, cluesData.length);
                break;

            // select
            case 'Space':
                console.log(`Selected clue ${currentClue}`);
                queueClue(currentClue, cluesData[currentClue-1][0]);
                currentPin = 1;
                return;

            case 'Escape':
                clueWindow = false;
                document.querySelector('.submit-zone').style.opacity = '1';
                document.getElementById(`clue${currentClue-1}`).style.backgroundColor = 'unset';
                currentClue = 1;
                break;
        }
    }
    else if(queueWindow){
        document.querySelector('.found-clues').style.opacity = '0.1';

        print(queue)

        switch(e.code){

            case 'Escape':
                queueWindow = false;
                document.querySelector('.found-clues').style.opacity = '1';

                if(queue.length >= 1){
                    document.getElementById(`pin${queue[0]}`).style.backgroundColor = 'unset';
                }
                break;

            case 'ArrowLeft':
                updatePin(0, currentPin);
                break;

            case 'ArrowRight':
                updatePin(1, currentPin);
                break;

            case 'Space':
                if(queue.length >= 1){
                    removePin(currentPin);
                }
                break;
            
            case 'Enter':

                if(checkSolution()){
                    alert('Game Completed');
                }
                else{
                    alert("Wrong combination");
                }
                break;
        }
    }

});

function hoverOptions(curr){

    
    // currently on clues
    if(curr){
        document.querySelector('.found-clues').style.backgroundColor = 'yellow';
        document.querySelector('.submit-zone').style.backgroundColor = 'white';
        current = 0;
    }
    else{
        document.querySelector('.found-clues').style.backgroundColor = 'white';
        document.querySelector('.submit-zone').style.backgroundColor = 'yellow';
        current = 1;
    }
}

function updateClue(direction, current, totalClues){
    let temp = current;
    let curr = current;

    let rows = (totalClues < 6) ? 1 : (totalClues < 11) ? 2 : 3;
    let cols = []; // number of cols in each row
    
    // Find number of available rows and columns
    switch(rows){
        case 1:
            cols.push(totalClues)
            break;
        case 2:
            cols.push(5)
            cols.push(totalClues-5)
            break;
        case 3:
            cols.push(5);
            cols.push(5);
            cols.push(totalClues-10);
            break;
    }

    let r;

    print(`Current : ${currentClue}`);
    print(`Rows: ${rows}`);
    print(`Cols: ${cols}`)

    switch(direction){
        // up
        case 0:
            print('handle up')
            // only valid if more than 1 row
            if(rows > 1){
                if(curr >= 6){
                    curr -= 5;
                    break;
                }
            }
            return;
        
        // right
        case 1:
            // Not at right edge && a clue exists to your right
            r = (curr < 6) ? 0 : (curr < 11) ? 1 : 2;
            if(curr % 5 != 0 && curr < totalClues){
                curr += 1;
                break;
            }
            return;
        
        // down
        case 2:
            // If a row below exists
            r = (curr < 6) ? 0 : (curr < 11) ? 1 : 2;
            if(r < rows-1){
                // check if cell below exists
                if(curr+5 <= totalClues){
                    curr += 5;
                }
                else{
                    let next_row = ((r+1)*5);
                    let next_col = cols[r+1];
                    curr = next_row+next_col;
                }
                break;
            }
            return;
        
        // left
        case 3:
            // Not at right edge
            r = (curr < 6) ? 0 : (curr < 11) ? 1 : 2;
            if(curr != 1 && curr != 6 && curr != 11){
                curr -= 1;
                break;
            }
            return;
    }

    currentClue = curr;
    cluesSelectEffect(temp, currentClue);
}

function cluesSelectEffect(prev, next){
    document.getElementById(`clue${next-1}`).style.backgroundColor = 'red';
    document.getElementById(`clue${prev-1}`).style.backgroundColor = 'unset';
}

async function getClues(){
    let clues = await DB.getClues();
    let completed = await DB.checkFound();
    solution = await DB.solution();


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
        clue.className = 'clue_card';
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

function print(value){
    console.log(value);
}

let queue = []

function queueClue(level){

    for(let i = 0; i < queue.length; i++){
        if(queue[i] == level){
            return;
        }
    }

    queue.push(level);


    const pin = document.createElement('p');
    pin.innerHTML = `${level}.`;
    pin.id = `pin${level}`;
    pin.className = 'pin';

    document.querySelector('.submit-zone').appendChild(pin);
}

function updatePin(right, level){

    print(level)
    // right
    if(level < queue.length && right){
        document.getElementById(`pin${queue[level-1]}`).style.backgroundColor = 'unset';
        document.getElementById(`pin${queue[level]}`).style.backgroundColor = 'red';
        currentPin++;
    }
    else if(level > 1 && !right){
        document.getElementById(`pin${queue[level-1]}`).style.backgroundColor = 'unset';
        document.getElementById(`pin${queue[level-2]}`).style.backgroundColor = 'red';
        currentPin--;
    }
}

function removePin(level){

    if(queue.length == 1){
        const pin = document.getElementById(`pin${queue[0]}`);
        document.querySelector('.submit-zone').removeChild(pin);

        queue.pop();
        currentPin = 0;
        return;
    }

    let q = [];

    for(let i = 0; i < level-1; i++){
        q.push(queue[i]);
    }
    for(let i = level; i < queue.length; i++){
        q.push(queue[i]);
    }

    const pin = document.getElementById(`pin${queue[level-1]}`);
    document.querySelector('.submit-zone').removeChild(pin);

    queue = q;

    if(queue.length >= 1){
        if(level == 1){
            document.getElementById(`pin${queue[0]}`).style.backgroundColor = 'red';
            currentPin = 1;
        }
        else{
            document.getElementById(`pin${queue[level-2]}`).style.backgroundColor = 'red';
            currentPin = level-1;
        }
        
    }
}

function checkSolution(){
    if(queue.length != 15){
        return false;
    }

    for(let i = 0; i < 15; i++){
        if(solution[i] != queue[i]){
            return false;
        }
    }

    return true;
}
