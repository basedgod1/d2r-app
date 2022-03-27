const { ipcRenderer } = require('electron')
const { dbConnect } = require('./db');
const fs = require('fs');

const api = {
  log: (msg, db = dbConnect(), mainWindow) => {
    // console.log('api.log');
    const stmt = db.prepare(`INSERT INTO log (msg, ts) VALUES (?, datetime('now','localtime'))`);
    stmt.run(msg);
    if (mainWindow) {
      console.log('api sending log-change via main window');
      mainWindow.webContents.send('log-change', api.getLog(db));
    }
  },
  getLog: (db = dbConnect()) => {
    // console.log('api.clearLog');
    const stmt = db.prepare(`SELECT * FROM log`);
    return stmt.all();
  },
  clearLog: (db = dbConnect()) => {
    // console.log('api.clearLog');
    const stmt = db.prepare(`DELETE FROM log`);
    stmt.run();
  },
  onLogChange: (callback) => {
    // console.log('api.onLogChange');
    ipcRenderer.on('log-change', callback);
  },
  getConfig: (id = 1, db = dbConnect()) => {
    const stmt = db.prepare('SELECT * FROM config WHERE id = ?');
    const config = stmt.get(id);
    if (config) {
      config.bakDirs = JSON.parse(config.bakDirs);
    }
    return config;
  },
  setConfig: (key, value, db = dbConnect()) => {
    if (key == 'bakDirs') {
      value = JSON.stringify(value || '[]');
    }
    const stmt = db.prepare(`UPDATE config SET ${key} = ? WHERE id = 1`);
    stmt.run(value);
  },
  verifyGameDir: async (dir) => {
    if (!dir) {
      return '';
    }
    const files = await fs.promises.readdir(dir);
    if (files.includes('D2R.exe')) {
      return 'Verified';
    }
    return `Unable to locate D2R.exe in ${dir}`;
  },
  verifySaveDir: async (dir) => {
    if (!dir) {
      return '';
    }
    const files = await fs.promises.readdir(dir);
    for (file of files) {
      if (/\.d2s$/.test(file)) {
        return 'Verified';
      }
    }
    return `No d2s files in ${dir}`;
  },
  verifyBakDirs: async (dirs) => {
    if (!dirs.length) {
      return '';
    }
    const ret = {};
    for (dir of dirs) {
      ret[dir] = fs.existsSync(dir);
    }
    return ret;
  },
  play: () =>{
    exec('"C:\\Program Files (x86)\\Diablo II Resurrected\\D2R.exe"', ['-mod', 'filter', '-txt']);
  },
  getAccount: (id = 1, db = dbConnect()) => {
    const stmt = db.prepare('SELECT * FROM account WHERE id = ?');
    return stmt.get(id);
  },
  setAccount: (key, value, db = dbConnect()) => {
    const stmt = db.prepare(`UPDATE account SET ${key} = ? WHERE id = 1`);
    stmt.run(value);
  }
};

module.exports = { api };
