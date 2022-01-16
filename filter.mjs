import { readFile, writeFile } from 'fs/promises';

const readJson = async (file) => {
  const data = await readFile(file, 'utf8');
  return JSON.parse(data);
};

const affixFilters = await readJson('data/item-nameaffixes.original.json');
const itemFilters = await readJson('data/item-names.original.json');

const readExcel = async (file) => {
  const items = {};
  const data = await readFile(file, 'utf8');
  const lines = data.split(/\r?\n/);
  const keys = lines.shift().split(/\t/);
  lines.forEach((line) => {
    var item = {};
    const values = line.split(/\t/);
    values.forEach((value, index) => {
      item[keys[index].toLowerCase()] = value;
    });
    if (item.code) {
      items[item.code] = item;
    }
  });
  return items;
};

const armor = await readExcel('data/armor.txt');
const misc = await readExcel('data/misc.txt');
const weapons = await readExcel('data/weapons.txt');
const items = { ...armor, ...misc, ...weapons };
const types = await readExcel('data/itemtypes.txt');
const sets = await readExcel('data/setitems.txt');
const uniques = await readExcel('data/uniqueitems.txt');

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

const alwaysShow = {};
[
  'Natalya\'s Soul',
  'Chance Guards',
  'Skin of the Vipermagi',
  'String of Ears',
  'The Stone of Jordan',
  'Shaftstop',
  'Headstriker',
  'Vampiregaze'
].forEach((value) => alwaysShow[value] = true);

// Group by item/code
const groupedItems = {};
Object.values(sets).forEach((value) => {
  groupedItems[value.item] = groupedItems[value.item] || [];
  groupedItems[value.item].push(value);
});
Object.values(uniques).forEach((value) => {
  groupedItems[value.code] = groupedItems[value.code] || [];
  groupedItems[value.code].push(value);
});

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

const filterQuality = (filter, item) => {
  const makeBlack = {};
  [
    'Low Quality',
    'Damaged',
    'Cracked',
    'Superior',
    'Gold',
    'Crude'
  ].forEach((value) => makeBlack[value] = true);
  if (makeBlack[filter.enUS] && (filter.enUS != 'Gold' || item)) {
    filter.enUS = 'ÿc6';
  }
  return filter;
};

affixFilters.forEach((filter, index) => {
  let item = items[filter.Key];
  affixFilters[index] = filterGems(filter, item);
  affixFilters[index] = filterQuality(filter, item);
});

await writeFile('data/item-nameaffixes.json', JSON.stringify(affixFilters, null, 2).replace(/\n/g, '\r\n') + '\r\n', 'utf8');
