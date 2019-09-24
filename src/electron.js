const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {Menu, MenuItem, dialog, ipcMain }=electron;
const path = require('path');
const isDev = require('electron-is-dev');
// let safeExit = false;
let mainWindow;
ipcMain.on('getpath', (event, arg) => {
  // console.log("getpath")
  // console.log(__dirname);
  event.returnValue = __dirname;
})
ipcMain.on('print', (event, arg) => {
  mainWindow.webContents.print();
})
// ipcMain.on('close', (event, arg) => {
//   // console.log("ipcMain on close");
//   safeExit=true;
//   mainWindow.close();
// })
function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680});
    const template=
    [{
      label: '文件',
      submenu: [
        {
          label: '打印',
          accelerator: 'Ctrl+P',
          click: (item, win) =>{
            console.log(win);
            win.webContents.print();
            // win.webContents.send("print");
          },
        },
        {
          label: '新窗口',
          accelerator: 'Ctrl+N',
          click: () =>{createWindow()},
        },
        {
          label: '重启',
          accelerator: 'Ctrl+R',
          click: (item, win) =>{win.loadURL(indexUrl);},
        },
        {
          label: '后退',
          accelerator: 'Ctrl+B',
          click: (item, win) =>{
            win.webContents.send("goback");
          },
        },
         {
          label: '开发工具',
          accelerator: 'Ctrl+D',
          click: (item, win) =>{
            win.openDevTools();
          },
        },
        {
          label: '退出',
          accelerator: 'Ctrl+E',
          click: (item, win) =>{
             // console.log(win);
             // console.log(mainWindow);
             win.close();
          },
        }
        ]
    }];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  //

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});