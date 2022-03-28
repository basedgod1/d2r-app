const { dbConnect, checkSchema } = require('./db');
const { api } = require('./api');
const fs = require('fs');

class Service {
    constructor(mainWindow) {
      // console.log('serice.constructor');
      this.mainWindow = mainWindow;
      const db = dbConnect();
      checkSchema(db);
      api.clearLog(db);
      this.log({ msg: 'Initializing service...' }, db);
      this.checkConfig(db);
      this.log({ msg: 'Done' }, db);
      db.close();
    }

    log(entry, db) {
      api.log(entry, db, this.mainWindow);
    }

    checkConfig(db = dbConnect()) {
      this.log({ msg: 'Checking config...' }, db);
      const config = api.getConfig(db);
      this.checkGameDir(null, config.gameDir, db);
      this.checkSaveDir(null, config.saveDir, db);
      this.checkBakDirs(null, config.bakDirs, db);
    }

    async checkGameDir(event, gameDir, db = dbConnect()) {
      if (!gameDir) {
        api.log({ msg: 'Game directory not set!',  err: 'Set your game directory via d2r.app -> config' }, db);
        return { msg: '', err: 1 };
      }
      try {
        const files = await fs.promises.readdir(gameDir);
        if (files.includes('D2R.exe')) {
          return { msg: 'Verified' };
        }
        const res = `Unable to locate D2R.exe in ${gameDir}`;
        api.log({ msg: 'Game directory not set!',  err: res }, db);
        return { msg: res, err: 1 };
      }
      catch (e) {
        api.log({ msg: 'Error checking game directory!',  err: e.message}, db);
        return { msg: e.message, err: 1 };
      }
    }

    async checkSaveDir(event, saveDir, db = dbConnect()) {
      if (!saveDir) {
        api.log({ msg: 'Save directory not set!',  err: 'Set your saved games directory via d2r.app -> config' }, db);
        return { msg: '', err: 1 };
      }
      try {
        const files = await fs.promises.readdir(saveDir);
        for (const file of files) {
          if (/\.d2s$/.test(file)) {
            return { msg: 'Verified' };
          }
        }
        const res = `No d2s files in ${saveDir}`;
        api.log({ msg: 'Save directory not set!',  err: res }, db);
        return { msg: res, err: 1 };
      }
      catch (e) {
        api.log({ msg: 'Error checking saved games directory!',  err: e.message}, db);
        return { msg: e.message, err: 1 };
      }
    }

    async checkBakDirs(event, bakDirs, db = dbConnect()) {
      if (!bakDirs?.length) {
        api.log({ msg: 'No backup directories set!',  err: 'Set your backup directories via d2r.app -> config' }, db);
        return [{ msg: '', err: 1, dir: new Date().getTime() }];
      }
      try {
        const ret = [];
        for (const dir of bakDirs) {
          if (fs.existsSync(dir)) {
            ret.push({ dir: dir, msg: 'Verified' });
          }
          else {
            ret.push({ dir: dir, msg: 'Cannot access directory', err: 1 });
          }
        }
        return ret;
      }
      catch (e) {
        api.log({ msg: 'Error checking backup directories!',  err: e.message}, db);
        return [{ msg: e.message, err: 1, dir: new Date().getTime() }];
      }
    }
}

module.exports = Service;
