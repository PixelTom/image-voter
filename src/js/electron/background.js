// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
//import { devMenuTemplate } from './helpers/dev_menu_template';
//import { editMenuTemplate } from './helpers/edit_menu_template';
// import createWindow from './helpers/window';

// // Special module holding environment variables which you declared
// // in config/env_xxx.json file.
// import env from './env';

var mainWindow;

// var setApplicationMenu = function () {
//     var menus = [editMenuTemplate];
//     if (env.name !== 'production') {
//         menus.push(devMenuTemplate);
//     }
//     Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
// };

app.on('ready', function () {
  // setApplicationMenu();

    // Create the browser window.
  win = new BrowserWindow({width: 1024, height: 768})


  console.log('_dirnane', __dirname)
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
});

app.on('window-all-closed', function () {
  app.quit();
});