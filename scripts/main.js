const { ipcRenderer } = require('electron');

// Disable mouse 
document.body.classList.add('disable-mouse');


// Menu selection
const menu = document.getElementById('menu');

const playBtn = document.getElementById('play-btn');
const storyBtn = document.getElementById('story-btn');
const exitBtn = document.getElementById('exit-btn');

// 0 = menu, 1 = story, 2 = game
let menuState = 0;
menuEffect(exitBtn, playBtn, menuState);
playBtn.classList.add('menu-select');

document.addEventListener('keydown', (e)=>{

    switch(e.code){
        case 'ArrowLeft':
            updateMenu(0);
            break;

        case 'ArrowRight':
            updateMenu(1);
            break;

        case 'Space':
            switch(menuState){
                
                case 0:
                    ipcRenderer.send('level-selection');
                    break;
                case 1:
                    ipcRenderer.send('story-page');
                    break;
                case 2:
                    ipcRenderer.send('exit');
                    break;
            }
            break;
    }
});


function updateMenu(direction){

    // left
    if(!direction){
        menuState = (menuState-1)%3;
        if(menuState < 0){ menuState = 2; }

        switch(menuState){
            case 0:
                // move 1 -> 0
                menuEffect(storyBtn, playBtn, menuState);
                storyBtn.classList.remove('menu-select');
                playBtn.classList.add('menu-select');
                break;

            case 1:
                // move 2 -> 1
                menuEffect(exitBtn, storyBtn, menuState);
                exitBtn.classList.remove('menu-select');
                storyBtn.classList.add('menu-select');
                break;

            case 2: 
                // move 0 -> 2
                menuEffect(playBtn, exitBtn, menuState);
                playBtn.classList.remove('menu-select');
                exitBtn.classList.add('menu-select');
                break;
        }
    }
    else{
        menuState = (menuState+1)%3;
        switch(menuState){
            case 0:
                // move 2 -> 0
                menuEffect(exitBtn, playBtn, menuState);
                exitBtn.classList.remove('menu-select');
                playBtn.classList.add('menu-select');
                break;

            case 1:
                // move 0 -> 1
                menuEffect(playBtn, storyBtn, menuState);
                playBtn.classList.remove('menu-select');
                storyBtn.classList.add('menu-select');
                break;

            case 2: 
                // move 1 -> 2
                menuEffect(storyBtn, exitBtn, menuState);
                storyBtn.classList.remove('menu-select');
                exitBtn.classList.add('menu-select');
                break;
        }
    }
}

function menuEffect(prev, next, state){
    prev.style.backgroundImage = "url('#')"; 
    switch(state){
        case 0:
            next.style.backgroundImage = "url('resources/img1.jpg')";
            break;

        case 1:
            next.style.backgroundImage = "url('resources/img2.jpg')";
            break;

        case 2:
            next.style.backgroundImage = "url('resources/img3.jpg')";
            break;
    }
    
}