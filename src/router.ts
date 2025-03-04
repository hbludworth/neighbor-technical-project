import express from 'express';
import { listingData } from './data/store';
import { VehicleRequestItem } from './types/types';
import { findVehicleStorageOptions } from './search';

const router = express.Router();

router.route('/').post(async (req, res, next) => {
  try {
    const request: VehicleRequestItem[] = req.body;

    if (!request || request.length === 0 || Object.keys(request).length === 0) {
      res.status(400).end();
      return;
    }

    const storageOptions = findVehicleStorageOptions(request, listingData);

    res.status(200).json(storageOptions);
  } catch {
    res.status(500).end();
  }
});

export default router;
