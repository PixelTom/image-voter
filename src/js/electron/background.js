// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

var mainWindow;

app.on('ready', function () {
  // Create the browser window.
  win = new BrowserWindow({width: 1044, height:830})

  console.log('_dirnane', __dirname)
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }))

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