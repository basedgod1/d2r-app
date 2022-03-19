const Database = require('better-sqlite3');
const fs = require('fs');
const { exec } = require('child_process');

function dbConnect() {
  return new Database('./data/sqlite3.db');
}

const api = {
  checkSchema: () => {
    const db = dbConnect();
    for (table of tables) {
      checkTable(table, db);
    }
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
  }
};

function checkTable (table = {}, db = dbConnect()) {
  if (table.sql) {
    const stmt = db.prepare(table.sql);
    stmt.run();
  }
  if (table.data) {
    for (data of table.data) {
      if (!api[data.fn](data.id, db)) {
        const stmt = db.prepare(`INSERT INTO config (${data.key}) VALUES (${data.value})`);
        stmt.run();
      }
    }
  }
}

const tables = [{
  name: 'config',
  sql: `
    CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameDir TEXT NOT NULL DEFAULT '',
      saveDir TEXT NOT NULL DEFAULT '',
      bakDirs TEXT NOT NULL DEFAULT '[]'
    )
  `,
  data: [{
    fn: 'getConfig',
    key: 'id',
    value: 1,
    keys: ['gameDir', 'saveDir', 'bakDirs'],
    values: ['', '', '[]']
  }]
}];

module.exports = { api };
