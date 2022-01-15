import { readFile, writeFile } from 'fs/promises';

const readExcel = async (file) => {

  let items = {};
  let data = await readFile(file, 'utf8');
  let lines = data.split(/\r?\n/);
  let keys = lines.shift().split(/\t/);
  lines.forEach((line) => {
    var item = {};
    let values = line.split(/\t/);
    values.forEach((value, index) => {
      item[keys[index]] = value;
    });
    item.code = item.code || item.Code;
    if (item.code) {
      items[item.code] = item;
    }
  });
  return items;
};

const readJson = async (file) => {

  let data = await readFile(file, 'utf8');
  return JSON.parse(data);
};

const armor = await readExcel('data/armor.txt');
const misc = await readExcel('data/misc.txt');
const weapons = await readExcel('data/weapons.txt');
const items = { ...armor, ...misc, ...weapons };
const types = await readExcel('data/itemtypes.txt');
const filters = await readJson('data/item-names.json');

const potions = (filter, item, type) => {

  if (/^(a|s|w)pot$/.test(item.type.code) || /^(hp|mp)[1-4]$/.test(item.code)) {
    filter.enUS = '';
  }
  else if (item.code == 'hp5') {
    filter.enUS = 'HP';
  }
  else if (item.code == 'mp5') {
    filter.enUS = 'MP';
  }
  return filter;
};

const gems = (filter, item, type) => {

  if (/^Perfect\s(Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = filter.enUS.replace('Perfect', 'P');
  }
  else if (/^Flawless\s(Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = filter.enUS.replace('Flawless ', '');
  }
  else if (/^(Chipped|Flawed|)\s(Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = '';
  }
  return filter;
};

filters.forEach((filter, index) => {

  let item = items[filter.Key];
  if (!item || !types[item.type]) {
    return;
  }
  item.type = types[item.type];
  filters[index] = potions(filter, item);
  filters[index] = gems(filter, item);
});

await writeFile('data/filter.json', JSON.stringify(filters, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');
