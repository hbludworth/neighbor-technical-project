import { Listing } from 'src/types/types';
import path from 'path';
import fs from 'fs';

let listingData: Listing[] = [];

const loadListingData = async (): Promise<void> => {
  if (listingData.length > 0) {
    return;
  }

  try {
    const filePath = path.join(__dirname, 'listings.json');

    const data = await fs.promises.readFile(filePath, 'utf8');
    listingData = JSON.parse(data);
  } catch {
    throw new Error();
  }
};

export { listingData, loadListingData };
