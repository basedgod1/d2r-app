const { dbConnect, checkSchema } = require('./db');
const { api } = require('./api');

const service = {
  init: () => {
    console.log('si');
  },
  checkConfig: function(){
    const config = api.getConfig();
    service.verifyGameDir(config);
  },
  checkGameDir: function(config){
    if (!config.gameDir) {
      return;
    }
  }
};

module.exports = { service };
