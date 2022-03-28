const { dbConnect, checkSchema } = require('./db');
const { api } = require('./api');

class Service {
    constructor(mainWindow) {
      // console.log('serice.constructor');
      this.mainWindow = mainWindow;
      const db = dbConnect();
      checkSchema(db);
      api.clearLog(db);
      this.log({ msg: 'Initializing service...' }, db);
      this.checkConfig(db);
      db.close();
    }

    log(entry, db) {
      api.log(entry, db, this.mainWindow);
    }

    checkConfig(db = dbConnect()) {
      this.log({ msg: 'Checking config...' }, db);
      const config = api.getConfig(db);
      this.checkGameDir(config.gameDir, db);
      // this.checkSaveDir(config.saveDir);
      // this.checkBakDirs(config.bakDirs);
    }

    checkGameDir(gameDir, db = dbConnect()) {
      if (!gameDir) {
        this.log({ msg: 'Game directory not set!',  err: 'Please set the game directory via d2r.app -> config' }, db);
      }
    }
}

module.exports = Service;
