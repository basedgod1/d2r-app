const Database = require('better-sqlite3');
const fsPromises = require('fs').promises;

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
  getConfig: (db = dbConnect()) => {
    const stmt = db.prepare('SELECT * FROM config WHERE id = 1');
    return stmt.get();
  },
  setConfig: (key, value, db = dbConnect()) => {
    const stmt = db.prepare(`UPDATE config SET ${key} = ? WHERE id = 1`);
    stmt.run(value);
  },
  verifyGameDir: async (dir) => {
    const files = await fsPromises.readdir(dir);
    if (files.includes('D2R.exe')) {
      return 'Verified';
    }
    return `Unable to locate D2R.exe in ${dir}`;
  },
  verifySaveDir: async (dir) => {
    const files = await fsPromises.readdir(dir);
    for (file of files) {
      if (/\.d2s$/.test(file)) {
        return 'Verified';
      }
    }
    return `No d2s files in ${dir}`;
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
      bakDirs TEXT NOT NULL DEFAULT ''
    )
  `,
  data: [{
    fn: 'getConfig',
    key: 'id',
    value: 1,
    keys: ['gameDir', 'saveDir', 'bakDirs'],
    values: ['', '', '']
  }]
}];

module.exports = { api };
