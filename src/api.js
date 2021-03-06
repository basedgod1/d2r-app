const { ipcRenderer } = require('electron')
const { dbConnect } = require('./db');
const fs = require('fs');

const api = {
  log: (entry, db = dbConnect(), mainWindow) => {
    // console.log('api.log');
    const stmt = db.prepare(`INSERT INTO log (msg, err, ts) VALUES (?, ?, datetime('now','localtime'))`);
    stmt.run(entry.msg, entry.err);
    if (mainWindow) {
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
  getConfig: (db = dbConnect()) => {
    const stmt = db.prepare('SELECT * FROM config WHERE id = 1');
    const config = stmt.get();
    if (config) {
      config.filters = api.getFilters(db);
      config.bakDirs = JSON.parse(config.bakDirs);
    }
    return config; 
  },
  updateConfig: (key, value, db = dbConnect()) => {
    // console.log('api.setConfig', key, value);
    if (key == 'bakDirs') {
      value = JSON.stringify(value || '[]');
    }
    if (value === true) {
      value = 1;
    }
    else if (value === false) {
      value = 0;
    }
    const stmt = db.prepare(`UPDATE config SET ${key} = ? WHERE id = 1`);
    stmt.run(value);
  },
  getFilter: (id, db) => {
    const stmt = db.prepare('SELECT * FROM filter WHERE id = ?');
    return stmt.get(id);
  },
  getFilters: (db) => {
    const stmt = db.prepare(`SELECT * FROM filter ORDER BY name`);
    return stmt.all();
  },
  getFiles: (db) => {
    const stmt = db.prepare(`SELECT * FROM file`);
    return stmt.all();
  },
  insertFile: (file, db) => {
    let stmt = db.prepare(`INSERT INTO file (path, hash) VALUES (?, ?)`);
    stmt.run(file.path, file.hash);
  },
  updateFile: (file, db) => {
    const keys = Object.keys(file).filter(f => f != file.path);
    const updates = keys.join(' = ?, ') + ' = ?';
    stmt = db.prepare(`UPDATE file SET ${updates} WHERE path = ?`);
    stmt.run(...keys.map(key => file[key]), file.path);
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
