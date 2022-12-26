import cheerio from 'cheerio';
import { Item } from '../models/item';
import { GET } from './api';

export const getHtml = async (baseUrl: string, path: string) => {
  return await GET(baseUrl, path);
};

export const getTotalAdsCount = (
  totalAdsPattern: string,
  totalPagesPattern: string,
  html: string
) => {
  const $ = cheerio.load(html);

  const temp1 = $(totalAdsPattern).text().split(' ');
  const total = temp1[1].slice(1, temp1[1].length - 1);

  const temp2 = $(totalPagesPattern)
    .map((_, element: cheerio.Element) => {
      return $(element).text();
    })
    .get();

  return {
    totalAds: parseInt(total),
    totalPages: parseInt(temp2[temp2.length - 1]),
  };
};

export const getNextPageUrl = async (
  pattern: string,
  subpatterns: any[],
  html: string
): Promise<Item[]> => {
  const $ = cheerio.load(html);

  const ads = $(pattern)
    .map((index, element: cheerio.Element) => {
      const temp: any = {};

      for (let subpattern of subpatterns) {
        if (subpattern.type === 'text') {
          temp[subpattern.name] = $(element)
            .find(subpattern.filterBy)
            .text()
            .trim();
        } else if (subpattern.type === 'attr') {
          temp[subpattern.name] = subpattern.filterBy
            ? $(element).find(subpattern.filterBy).attr(subpattern.attrName) ||
              ''
            : $(element).attr(subpattern.attrName);
        }
      }

      return { id: index + 1, ...temp };
    })
    .get();

  return ads;
};

export const scrapeTruckItem = async (
  pattern: string,
  targetTruckDetailKeys: any,
  baseUrl: string,
  item: Item
) => {
  const url = item.href;
  let html = await getHtml(baseUrl, url.replace(baseUrl, ''));

  const $ = cheerio.load(html);

  const truckDetails: any = {};

  //'main div.parametersArea div.offer-params.with-vin ul.offer-params__list li.offer-params__item';

  $(pattern)
    .map((_, element: cheerio.Element) => {
      const key = $(element).find('span').text().trim();
      const value = $(element).find('div').text().trim();

      const outKey = getValidKey(key, targetTruckDetailKeys);

      if (outKey) {
        truckDetails[outKey] = value;
      }
    })
    .get();

  return truckDetails;
};

export const getValidKey = (
  inputKey: string,
  targetTruckDetailKeys: any
): string | undefined => {
  for (let key in targetTruckDetailKeys) {
    if (targetTruckDetailKeys[key].includes(inputKey)) {
      return key;
    }
  }
};
