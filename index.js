const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path')

let mainWindow;

app.on('ready', ()=>{

    mainWindow = new BrowserWindow({

        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
        width: 1280,
        height: 720
        
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

ipcMain.on('start-level', async(event, data)=>{
    level = data[0];
    console.log(level);

    mainWindow.loadFile(`game.html`);
    
})