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
      item[keys[index].toLowerCase()] = value;
    });
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


const itemIsQuest = (item) => {
  return !item.ultracode;
};

const itemIsElite = (item) => {
  return item.code == item.ultracode;
};

const itemIsClassSpecific = (item) => {
  return (item.type.equiv2 && /^(amaz|assn|barb|drui|necr|pala|sorc)$/.test(item.type.equiv2) || /^(h2h|h2h2)$/.test(item.type.code));
};

const ammo = (filter, item) => {
  if (item.code == 'aqv' || item.code == 'cqv') {
    filter.enUS = '';
  }
  return filter;
};

const body = (filter, item) => {

  if (!item.type.body || itemIsQuest(item)) {
    return filter;
  }
  else if (item.code == 'crs') { // Crystal sword
    return filter;
  }
  else if (item.code == 'fla') { // Flail
    return filter;
  }
  else if (/^(scep|wand|staf|glov|boot)$/.test(item.type.code)) {
    return filter;
  }
  else if (itemIsElite(item) && /tors|arm/.test(item.type.bodyloc1)) { // Elite body armor and weapons
    return filter;
  }
  else if (!/nec|rin/.test(item.type.bodyloc1) && !itemIsClassSpecific(item)){
    filter.enUS = '';
  }
  return filter;
};

const gems = (filter, item) => {
  if (/^Perfect (Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = filter.enUS.replace('Perfect', 'P');
  }
  else if (/^Flawless (Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = filter.enUS.replace('Flawless ', '');
  }
  else if (/^(Chipped|Flawed|) (Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = '';
  }
  return filter;
};

const potions = (filter, item) => {
  if (/^(a|s|t|w)pot$/.test(item.type.code) || /^(hp|mp)[1-4]$/.test(item.code)) {
    filter.enUS = '';
  }
  else if (item.code == 'hp5') {
    filter.enUS = 'HP';
  }
  else if (item.code == 'mp5') {
    filter.enUS = 'MP';
  }
  else if (item.code == 'rvs') {
    filter.enUS = '';
  }
  else if (item.code == 'rvl') {
    filter.enUS = 'RP';
  }
  return filter;
};

const scolls = (filter, item) => {
  if (/^Scroll of (Identify|Town Portal)$/.test(item.name)) {
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
  filters[index] = ammo(filter, item);
  filters[index] = body(filter, item);
  filters[index] = gems(filter, item);
  filters[index] = potions(filter, item);
  filters[index] = scolls(filter, item);
});

await writeFile('data/filter.json', JSON.stringify(filters, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');
