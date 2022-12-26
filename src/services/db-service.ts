import { Item } from '../models/item';

let items: Item[] = [];

export const clearDb = () => {
  items = [];
  console.log('Database cleared');
};

export const addItems = (ads: Item[]) => {
  let lastId = items.length === 0 ? 0 : items[items.length - 1].id;

  for (let i = 0; i < ads.length; i++) {
    ads[i].id = ads[i].id + lastId;
  }
  items = items.concat(ads);
};

export const getAllItems = (): Item[] => {
  return items;
};

export const getItemsCount = () => {
  return items.length;
};

export const updateItem = (id: number, truckDetails: any) => {
  const item = items[id - 1];
  const modifiedItem = { ...item, ...truckDetails };
  items[id - 1] = modifiedItem;
};
