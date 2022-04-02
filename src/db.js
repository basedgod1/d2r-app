const Database = require('better-sqlite3');

function dbConnect() {
  return new Database('./data/sqlite3.db');
}

function checkSchema(db = dbConnect()) {
  for (table of tables) {
    checkTable(table, db);
  }
}

function checkTable (table = {}, db = dbConnect()) {
  let stmt = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?");
  if (stmt.get(table.name)) {
    return;
  }
  for (sql of table.setup) {
    stmt = db.prepare(sql);
    stmt.run();
  }
}

const tables = [{
  name: 'account',
  setup: [`
    CREATE TABLE account (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      password TEXT NOT NULL DEFAULT '[]'
    )
  `,`
    INSERT INTO account (name, email, password) VALUES ('Preston', 'preston.cargile@gmail.com', 'test')
  `]
},{
  name: 'config',
  setup: [`
    CREATE TABLE config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameDir TEXT NOT NULL DEFAULT '',
      saveDir TEXT NOT NULL DEFAULT '',
      bakDirs TEXT NOT NULL DEFAULT '[]',
      filterId INTEGER NOT NULL DEFAULT 0,
      filterHelp INTEGER NOT NULL DEFAULT 1
    )
  `,`
    INSERT INTO config (gameDir, saveDir, bakDirs) VALUES ('', '', '[]')
  `]
},{
  name: 'filter',
  setup: [`
    CREATE TABLE filter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      json TEXT NOT NULL,
      ts TEXT
    )
  `]
},{
  name: 'log',
  setup: [`
    CREATE TABLE log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts TEXT NOT NULL,
      msg TEXT NOT NULL,
      err TEXT
    )
  `]
},{
  name: 'file',
  setup: [`
    CREATE TABLE file (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT UNIQUE NOT NULL,
      hash TEXT NOT NULL,
      nb INTEGER NOT NULL DEFAULT 1
    )
  `]
}];

module.exports = { dbConnect, checkSchema };
