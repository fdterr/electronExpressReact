const electron = require('electron');
const app = electron.app;
const server = require('../server/');
console.log('server is', server);
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

const waitOn = require('wait-on');
const opts = {
  resources: [
    'http://localhost:8080'
    // 'http://foo.com:8000/bar',
    // 'https://my.com/cat',
    // 'http-get://foo.com:8000/bar',
    // 'https-get://my.com/cat',
    // 'tcp:foo.com:8000',
    // 'socket:/my/sock',
    // 'http://unix:/my/sock:/my/url',
    // 'http-get://unix:/my/sock:/my/url'
  ],
  delay: 1000, // initial delay in ms, default 0
  interval: 100, // poll interval in ms, default 250ms
  timeout: 30000, // timeout in ms, default Infinity
  tcpTimeout: 1000, // tcp timeout in ms, default 300ms
  window: 1000 // stabilization time in ms, default 750ms

  // // http options
  // ca: [
  //   /* strings or binaries */
  // ],
  // cert: [
  //   /* strings or binaries */
  // ],
  // key: [
  //   /* strings or binaries */
  // ],
  // passphrase: 'yourpassphrase',
  // auth: {
  //   user: 'theuser', // or username
  //   pass: 'thepassword' // or password
  // },
  // httpSignature: {
  //   keyId: 'yourKeyId',
  //   key: 'yourKey'
  // },
  // strictSSL: false,
  // followAllRedirects: true,
  // followRedirect: true,
  // headers: {
  //   'x-custom': 'headers'
  // }
};

let mainWindow;

async function createWindow() {
  try {
    await waitOn(opts);
    // once here, all resources are available
  } catch (err) {
    handleError(err);
  }
  mainWindow = new BrowserWindow({width: 900, height: 680});

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:8080'
      : //   `file://${path.join(__dirname, '..', 'public/index.html')}`
        // : `file://${path.join(__dirname, '..', 'public/index.html')}`
        'http://localhost:8080'
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on('closed', () => (mainWindow = null));
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
