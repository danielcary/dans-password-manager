/*
 * Dan's Password Manager
 * main.js (based off main.js from https://electronjs.org/docs/tutorial/quick-start)
 * Copyright 2017 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/dans-password-manager/blob/master/LICENSE)
*/
const { app, BrowserWindow, ipcMain, Menu, dialog, shell } = require('electron');
const path = require('path');
const url = require('url');
require('electron-context-menu')({ showInspectElement: false });


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 1000, height: 600 })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.setTitle("Dan's Password Manager");

    win.setMenu(Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { label: 'Open File...', click: () => win.webContents.send('cmd-open') },
                { type: 'separator' },
                { label: 'Save', accelerator: 'Ctrl+S', click: () => win.webContents.send('cmd-save') },
                { label: 'Save As...', accelerator: 'Ctrl+Shift+S', click: () => win.webContents.send('cmd-save-as') },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'Help',
            submenu: [
                { label: 'Github Repo', click: () => shell.openExternal('https://github.com/danielcary/dans-password-manager') },
                { type: 'separator' },
                {
                    label: 'About',
                    click: () => dialog.showMessageBox(win, {
                        type: "info",
                        title: "About",
                        message: "Version 1.0\nMade by Daniel Cary"
                    })
                }
            ]
        }
    ]));

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});