import { readFile, writeFile } from 'fs/promises';

const readJson = async (file) => {
  let data = await readFile(file, 'utf8');
  return JSON.parse(data);
};

const affixFilters = await readJson('data/item-nameaffixes.original.json');
const itemFilters = await readJson('data/item-names.original.json');
