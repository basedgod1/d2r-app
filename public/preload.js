const { contextBridge } = require('electron');
const { api } = require('../src/api');

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('api', api);
});
