import express from 'express';
import { listingData } from './data/store';
import { VehicleResponseItem } from './types/types';

const router = express.Router();

router.route('/').post(async (req, res, next) => {
  try {
    // FIXME this is just a test. Sending all data back
    const locations = [
      ...new Set(listingData.map((listing) => listing.location_id)),
    ];
    const vehicleResponse: VehicleResponseItem[] = locations.map((location) => {
      const listings = listingData.filter(
        (listing) => listing.location_id === location
      );
      const response: VehicleResponseItem = {
        location_id: location,
        listing_ids: listings.map((listing) => listing.id),
        total_price_in_cents: listings.reduce(
          (acc, num) => acc + num.price_in_cents,
          0
        ),
      };
      return response;
    });
    res.status(200).json(vehicleResponse);
  } catch {
    res.status(500).end();
  }
});

export default router;
