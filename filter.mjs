import { readFile, writeFile } from 'fs/promises';

const readJson = async (file) => {
  const data = await readFile(file, 'utf8');
  return JSON.parse(data);
};

const affixFilters = await readJson('data/item-nameaffixes.original.json');
const itemFilters = await readJson('data/item-names.original.json');

const readExcel = async (file, key) => {
  const items = {};
  const data = await readFile(file, 'utf8');
  const lines = data.split(/\r?\n/);
  const headers = lines.shift().split(/\t/);
  lines.forEach((line) => {
    var item = {};
    const values = line.split(/\t/);
    values.forEach((value, index) => {
      item[headers[index].toLowerCase().replace(/\s/g, '')] = value;
    });
    if (item[key]) {
      items[item[key]] = item;
    }
  });
  return items;
};

const armor = await readExcel('data/armor.txt', 'code');
const misc = await readExcel('data/misc.txt', 'code');
const weapons = await readExcel('data/weapons.txt', 'code');
const items = { ...armor, ...misc, ...weapons };
const types = await readExcel('data/itemtypes.txt', 'code');
const sets = await readExcel('data/setitems.txt', 'index');
const uniques = await readExcel('data/uniqueitems.txt', 'index');

const readD2x = async (file) => {
  const grail = {};
  const data = await readFile(file, 'utf8');
  const sections = data.split(/\r?\n(\r?\n)+/);
  sections.forEach((section) => {
    grail[section.split(/\r?\n/)[0]] = true;
  });
  return grail;
};

const grail = await readD2x('data/Grail.d2x.txt');
const alwaysShow = await readExcel('data/alwaysshow.csv', 'index');
const groupedItems = {}; // Items grouped by code

const filterGems = (filter, item) => {
  if (!item) {
    return filter;
  }
  if (/^Perfect (Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = filter.enUS.replace('Perfect', 'P');
  }
  else if (/^Flawless (Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = filter.enUS.replace('Flawless ', '');
  }
  else if (/^(Chipped|Flawed|)\s?(Amethyst|Diamond|Emerald|Ruby|Sapphire|Skull|Topaz)$/.test(item.name)) {
    filter.enUS = '';
  }
  return filter;
};

const affixMap = {};
affixMap['Gold'] = '??c6'; // Black
affixMap['Low Quality'] = '??cT'; // Sky blue
affixMap['Damaged'] = '??cT';
affixMap['Cracked'] = '??cT';
affixMap['Crude'] = '??cT';
affixMap['Superior'] = '??cO'; // Pink

const filterQuality = (filter, item) => {
  if (affixMap[filter.enUS] && (filter.enUS != 'Gold' || item)) {
    filter.enUS = affixMap[filter.enUS];
  }
  return filter;
};

affixFilters.forEach((filter, index) => {
  let item = items[filter.Key];
  affixFilters[index] = filterGems(filter, item);
  affixFilters[index] = filterQuality(filter, item);
});

await writeFile('data/item-nameaffixes.json', JSON.stringify(affixFilters, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');

const filterAmmo = (filter, item) => {
  if (item.code == 'aqv' || item.code == 'cqv') {
    filter.enUS = '';
  }
  return filter;
};

const filterPotions = (filter, item) => {
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

const filterScolls = (filter, item) => {
  if (item.code == 'isc' || item.code == 'tsc') {
    filter.enUS = '';
  }
  return filter;
};

const filterSets = (filter) => {
  let item = sets[filter.Key];
  if (!item) {
    return filter;
  }
  groupedItems[item.item] = groupedItems[item.item] || [];
  groupedItems[item.item].push((lookup) => !alwaysShow[item.index] && (lookup[filter.enUS] || lookup[item.index])); // Humongous/The Humongous
  if (grail[filter.enUS] && !alwaysShow[item.index]) {
    filter.enUS = '';
  }
  return filter;
};

const filterUniques = (filter) => {
  let item = uniques[filter.Key];
  if (!item) {
    return filter;
  }
  groupedItems[item.code] = groupedItems[item.code] || [];
  groupedItems[item.code].push((lookup) => !alwaysShow[item.index] && (lookup[filter.enUS] || lookup[item.index]));
  if (grail[filter.enUS] && !alwaysShow[item.index]) {
    filter.enUS = '';
  }
  return filter;
};

const filterBody = (filter, item) => {

  if (!(item.type.body && item.ultracode)) { // Skip non-body, jewelry, and quest items
    return filter;
  }
  else if (alwaysShow[item.name] || /^(h2h2|phlm|pelt|ashd|orb|wand|circ)$/.test(item.type.code)) { // Skip specific items
    return filter;
  }
  if (groupedItems[item.code]) { // Don't hide basic items until they have been grailed
    let grailed = true;
    groupedItems[item.code].forEach((groupedItem) => {
      if (!groupedItem(grail)) {
        return grailed = false;
      }
    });
    if (!grailed) {
      return filter;
    }
  }
  filter.enUS = '';
  return filter;
};

itemFilters.forEach((filter, index) => {
  itemFilters[index] = filterSets(filter);
  itemFilters[index] = filterUniques(filter);
});

itemFilters.forEach((filter, index) => {
  const item = items[filter.Key];
  if (!item || !types[item.type]) {
    return;
  }
  item.type = types[item.type];
  itemFilters[index] = filterAmmo(filter, item);
  itemFilters[index] = filterGems(filter, item);
  itemFilters[index] = filterPotions(filter, item);
  itemFilters[index] = filterScolls(filter, item);
  itemFilters[index] = filterBody(filter, item);
});

await writeFile('data/item-names.json', JSON.stringify(itemFilters, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');
