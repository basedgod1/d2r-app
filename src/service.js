const { dbConnect, checkSchema } = require('./db');
const { api } = require('./api');

class Service {
    constructor(mainWindow) {
      // console.log('serice.constructor');
      this.mainWindow = mainWindow;
      const db = dbConnect();
      checkSchema(db);
      api.clearLog(db);
      api.log('Initializing service...', db, this.mainWindow);
      db.close();
    }
}

module.exports = Service;
