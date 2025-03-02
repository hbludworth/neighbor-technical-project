import app from './app';
import { loadListingData } from './data/store';

loadListingData()
  .then(() => {
    app.listen(8081, () => {
      console.log('Listening on port 8081');
    });
  })
  .catch(() => {
    console.error('Error loading data');
  });
