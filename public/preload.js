const { contextBridge } = require('electron');
const { checkSchema } = require('../src/db');
const { api } = require('../src/api');
const { service } = require('../src/service');

process.once('loaded', () => {
  checkSchema();
  contextBridge.exposeInMainWorld('api', api);
  contextBridge.exposeInMainWorld('service', service);
});
