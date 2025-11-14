const { app, BrowserWindow, ipcMain, dialog, ipcRenderer } = require('electron');
const path = require('path');
let CURRENT_LEVEL;

let mainWindow;

app.on('ready', ()=>{

    mainWindow = new BrowserWindow({

        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
        width: 1280,
        height: 720,
        resizable: false,
        maximizable: false,
        
    });

    mainWindow.loadFile('index.html');

});

ipcMain.on('level-selection', async(event,data)=>{
    mainWindow.loadFile('level-selection.html');
});

ipcMain.on('menu', async(event,data)=>{
    mainWindow.loadFile('index.html');
});

ipcMain.on('exit', async(event,data)=>{
    app.quit();
});

ipcMain.on('get_current_level', (event) =>{
    event.reply('res_current_level', CURRENT_LEVEL);
})

ipcMain.on('start-level', async(event, data)=>{
    CURRENT_LEVEL = data[0];

    mainWindow.loadFile(`game.html`);
});

