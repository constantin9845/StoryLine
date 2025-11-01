const { ipcRenderer } = require('electron');

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


// navigate levels
let currentLevel = 1;
selectionEffect(2, 1);

document.addEventListener('keydown', (e)=>{

    switch(e.code){
        // left = 3
        case 'ArrowLeft':
            updateLevel(3, currentLevel);
            break;

        // right = 1
        case 'ArrowRight':
            updateLevel(1, currentLevel);
            break;

        // up = 0
        case 'ArrowUp':
            updateLevel(0, currentLevel);
            break;

        // down = 2
        case 'ArrowDown':
            updateLevel(2, currentLevel);
            break;

        case 'Space':
            ipcRenderer.send(`start-level`, [currentLevel]);
            break;
    }
});

function updateLevel(direction, current){
    let temp = current;
    let curr = current;

    switch(direction){
        // up
        case 0:
            if(curr < 5){
                curr = (curr == 1 ? 13 : (curr == 2 ? 14 : (curr == 3 ? 15 : 16)));
            }
            else{
                curr -= 4;
            }
            break;
        
        case 1:
            if(curr % 4 == 0){
                curr -= 3;
            }
            else{
                curr += 1;
            }
            break;
        
        case 2:
            if(curr > 12){
                curr -= 12;
            }
            else{
                curr += 4;
            }
            break;
        
        case 3:
            if(curr == 1 || curr == 5 || curr == 9 || curr == 13){
                curr += 3;
            }
            else{
                curr -= 1;
            }
            break;
    }

    currentLevel = curr;
    selectionEffect(temp, currentLevel);
}


function selectionEffect(prev, next){

    document.getElementById(`l${prev}`).classList.remove('level-select');
    document.getElementById(`l${next}`).classList.add('level-select');
}