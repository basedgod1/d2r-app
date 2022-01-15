import { readFile, writeFile } from 'fs/promises';

const readD2x = async (file) => {
  let grails = {};
  let data = await readFile(file, 'utf8');
  let sections = data.split(/\r?\n\r?\n/);
  sections.forEach((section) => {
    grails[section.split(/\r?\n/)[0]] = true;
  });
  return grails;
};

const readExcel = async (file) => {
  let items = {};
  let data = await readFile(file, 'utf8');
  let lines = data.split(/\r?\n/);
  let keys = lines.shift().split(/\t/);
  lines.forEach((line) => {
    var item = {};
    let values = line.split(/\t/);
    values.forEach((value, index) => {
      item[keys[index].toLowerCase().replace(/\s/g, '')] = value;
    });
    if (item.index) {
      items[item.index] = item;
    }
  });
  return items;
};

const readJson = async (file) => {
  let data = await readFile(file, 'utf8');
  return JSON.parse(data);
};

const grails = await readD2x('data/Grail.d2x.txt');
const sets = await readExcel('data/setitems.txt');
const uniques = await readExcel('data/uniqueitems.txt');
const filters = await readJson('data/filter.json');

const checkSets = (filter) => {
  let item = sets[filter.Key];
  if (!item) {
    return filter;
  }
  if (grails[filter.enUS] && item.lvlreq < 34) {
    filter.enUS = '';
  }
  return filter;
};

filters.forEach((filter, index) => {
  filters[index] = checkSets(filter);
});

await writeFile('data/grail.json', JSON.stringify(filters, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');
