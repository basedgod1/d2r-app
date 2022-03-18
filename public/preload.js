const { contextBridge } = require('electron');
const { api } = require('../src/db');

process.once('loaded', () => {
  api.checkSchema();
  contextBridge.exposeInMainWorld('api', api);
});
