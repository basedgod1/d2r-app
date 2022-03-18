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
  getConfig: (id = 1, db = dbConnect()) => {
    const stmt = db.prepare('SELECT * FROM config WHERE id = ?');
    return stmt.get(id);
  },
  setConfig: (config, db = dbConnect()) => {
    const stmt = db.prepare('UPDATE config SET gameDir = ?, saveDir = ?, bakDirs = ? WHERE id = ?');
    stmt.run(config.gameDir, config.saveDir, config.bakDirs, config.id);
  },
  verifyGameDir: async (dir) => {
    const files = await fsPromises.readdir(dir);
    if (files.includes('D2R.exe')) {
      return 'Verified';
    }
    return `Unable to locate D2R.exe in ${dir}`;
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
