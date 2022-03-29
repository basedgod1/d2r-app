const { dbConnect, checkSchema } = require('./db');
const { api } = require('./api');
const crypto = require('crypto');
const fs = require('fs');
let service = null;

class Service {
    constructor(mainWindow) {
      if (!service) {
        service = this;
      }
      this.mainWindow = mainWindow;
    }

    async init(mainWindow) {
      const db = dbConnect();
      checkSchema(db);
      api.clearLog(db);
      service.log({ msg: 'Initializing service...' }, db);
      await this.checkConfig(db);
      this.log({ msg: 'Done' }, db);
      db.close();
      }

      log(entry, db = dbConnect()) {
        api.log(entry, db, service.mainWindow);
    }

    async checkConfig(db = dbConnect()) {
      service.log({ msg: 'Checking config...' }, db);
      const config = api.getConfig(db);
      await service.checkGameDir(null, config.gameDir, db);
      await service.checkSaveDir(null, config.saveDir, db);
      await service.checkBakDirs(null, config.bakDirs, db);
    }

    async checkGameDir(event, gameDir, db = dbConnect()) {
      if (!gameDir) {
        service.log({ msg: 'Game directory not set!',  err: 'Set your game directory via d2r.app -> config' }, db);
        return { msg: '', err: 1 };
      }
      try {
        const files = await fs.promises.readdir(gameDir);
        if (files.includes('D2R.exe')) {
          return { msg: 'Verified' };
        }
        const res = `Unable to locate D2R.exe in ${gameDir}`;
        service.log({ msg: 'Game directory not set!',  err: res }, db);
        return { msg: res, err: 1 };
      }
      catch (e) {
        service.log({ msg: 'Error checking game directory!',  err: e.message }, db);
        return { msg: e.message, err: 1 };
      }
    }

    async checkSaveDir(event, saveDir, db = dbConnect()) {
      if (!saveDir) {
        service.log({ msg: 'Save directory not set!',  err: 'Set your saved games directory via d2r.app -> config' }, db);
        return { msg: '', err: 1 };
      }
      try {
        const files = await fs.promises.readdir(saveDir);
        const saveFiles = files.filter(file => /\.d2s$/.test(file));
        await service.checkSaveFiles(saveDir, saveFiles, db);
        if (saveFiles.length) {
          return { msg: 'Verified' };
        }
        const res = `No d2s files in ${saveDir}`;
        service.log({ msg: 'Save directory not set!',  err: res }, db);
        return { msg: res, err: 1 };
      }
      catch (e) {
        service.log({ msg: 'Error checking saved games directory!',  err: e.message }, db);
        return { msg: e.message, err: 1 };
      }
    }

    async checkSaveFiles(saveDir, saveFiles, db){
      const dbFiles = {};
      for (const dbFile of api.getFiles(db)) {
        dbFiles[dbFile.path] = dbFile;
      }
      for (const file of saveFiles) {
        try {
          const path = saveDir + `\\${file}`;
          // Track

          // Sync
          const data = await fs.promises.readFile(path);
          const hash = service.generateChecksum(data);
          if (!dbFiles[path]){
            api.insertFile({ path: path, hash: hash }, db);
          }
          else if (dbFiles[path].hash != hash) {
            api.updateFile({ path: path, hash: hash }, db);
          }
          // Backup
          
        }
        catch (e) {
          console.log({ msg: 'Error reading save file',  err: e.message , path: saveDir + `\\${file}`});
          service.log({ msg: 'Error reading save file',  err: e.message }, db);
        }
      }
    }

    generateChecksum(data) {
      return crypto.createHash('md5').update(data, 'utf8').digest('hex');
    }

    async checkBakDirs(event, bakDirs, db = dbConnect()) {
      if (!bakDirs?.length) {
        service.log({ msg: 'No backup directories set!',  err: 'Set your backup directories via d2r.app -> config' }, db);
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
        service.log({ msg: 'Error checking backup directories!',  err: e.message }, db);
        return [{ msg: e.message, err: 1, dir: new Date().getTime() }];
      }
    }
}

module.exports = Service;
