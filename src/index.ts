import {
  getHtml,
  getTotalAdsCount,
  getNextPageUrl,
  scrapeTruckItem,
} from './services/base-service';
import {
  addItems,
  getAllItems,
  updateItem,
  getItemsCount,
  clearDb,
} from './services/db-service';

const baseUrl = 'https://www.otomoto.pl';
const initialPath =
  '/ciezarowe/uzytkowe/mercedes-benz/od-2014/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at%3Adesc';

export const targetTruckDetailKeys: any = {
  productionDate: ['Year of production', 'Rok produkcji'],
  power: ['Power', 'Moc'],
  registrationDate: ['First registration', 'Pierwsza rejestracja'],
  mileage: ['Course', 'Przebieg'],
};

const scrapeAllTruckItem = async () => {
  const items = getAllItems();
  for (let item of items) {
    const result = await scrapeTruckItem(
      'main div.parametersArea div.offer-params.with-vin ul.offer-params__list li.offer-params__item',
      targetTruckDetailKeys,
      baseUrl,
      item
    );
    updateItem(item.id, result);
  }
};

const start = async () => {
  clearDb();
  try {
    let html = await getHtml(baseUrl, initialPath);

    console.log('Fetched the HTML');
    const { totalAds, totalPages } = getTotalAdsCount(
      'a.ooa-1d4naji.e6e262w0',
      'a.ooa-xdlax9.ekxs86z0',
      html
    );

    const pattern = 'main article';
    const subpattern = [
      {
        name: 'title',
        type: 'text',
        filterBy: 'div h2 a',
      },
      {
        name: 'href',
        type: 'attr',
        filterBy: 'div h2 a',
        attrName: 'href',
      },
      {
        name: 'price',
        type: 'text',
        filterBy: 'div.e1b25f6f9.ooa-1w7uott-Text.eu5v0x0 span',
      },
      {
        name: 'itemId',
        type: 'attr',
        filterBy: undefined,
        attrName: 'id',
      },
    ];

    let ads = await getNextPageUrl(pattern, subpattern, html);

    addItems(ads);

    console.log('item added', ads);
    for (let i = 2; i <= totalPages; i++) {
      console.log('page: ', i, ' of ', totalPages);
      html = await getHtml(baseUrl, `${initialPath}&page=${i}`);
      ads = await getNextPageUrl(pattern, subpattern, html);
      addItems(ads);
      console.log('item added', ads);
    }

    console.log('Detail Page Scraping starting......');
    await scrapeAllTruckItem();
    return getItemsCount() === totalAds;
  } catch (err) {
    console.log(err);
    return false;
  }
};

(async function startScrape() {
  try {
    const success = await start();
    if (!success) {
      throw {
        name: 'failedOperation',
        message: 'Failed to scrape all items',
      };
    }
    console.log('All detail page scrape successful');
  } catch (error) {
    // retry
    let maxRetryCount = 4;
    while (maxRetryCount) {
      console.log('Retry Remaining: ' + maxRetryCount);
      const success = await start();
      if (success) {
        break;
      }
      maxRetryCount--;
    }
  }
})();
