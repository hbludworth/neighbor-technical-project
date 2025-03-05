import {
  Listing,
  VehicleRequestItem,
  VehicleResponseItem,
} from './types/types';

export function findVehicleStorageOptions(
  vehicleRequestItems: VehicleRequestItem[],
  listings: Listing[]
): VehicleResponseItem[] {
  // Individualize vehicles sorted from longest to shortest
  const individualizedVehicleLengths: number[] = vehicleRequestItems
    .sort((a, b) => b.length - a.length)
    .flatMap((req) => Array(req.quantity).fill(req.length));

  // Organize listings by location
  const listingsByLocation: Record<string, Listing[]> = {};
  for (const listing of listings) {
    if (!listingsByLocation[listing.location_id]) {
      listingsByLocation[listing.location_id] = [];
    }
    listingsByLocation[listing.location_id].push(listing);
  }

  // Initiate empty results array
  const results: VehicleResponseItem[] = [];

  // Iterate through each location
  for (const [location_id, locationListings] of Object.entries(
    listingsByLocation
  )) {
    // Get all possible listing combinations sorted by total price
    const possibleCombinations = getAllCombinations(locationListings).sort(
      (a, b) =>
        a.reduce((sum, c) => sum + c.price_in_cents, 0) -
        b.reduce((sum, c) => sum + c.price_in_cents, 0)
    );

    let cheapestCombo: Listing[] = [];

    // Loop through possible combinations. Loop is broken as soon as one that fits all the cars is found as it will be the cheapest
    comboLoop: for (const combo of possibleCombinations) {
      const sortedListings = combo.sort(
        (a, b) => a.price_in_cents - b.price_in_cents
      );

      // Individualizes vehicles from longest to shortest
      const remainingVehiclesByLength = [...individualizedVehicleLengths];

      for (const listing of sortedListings) {
        let availableLengthInColumn = listing.length;
        const carsWide = listing.width / 10;

        // Iterates over vehicle columns and fills in optimally
        for (
          let i = 0;
          i < carsWide && remainingVehiclesByLength.length > 0;

        ) {
          // Finds next largest vehicle that can fit in the current column
          const vehicleToParkIndex = remainingVehiclesByLength.findIndex(
            (length) => length <= availableLengthInColumn
          );
          if (vehicleToParkIndex === -1) {
            // If no vehicle can fit in the column, resets and moves to next column
            availableLengthInColumn = listing.length;
            i++;
          } else {
            // If vehicle can fit in column, length is adjusted and the car is removed from remaining
            availableLengthInColumn -=
              remainingVehiclesByLength[vehicleToParkIndex];
            remainingVehiclesByLength.splice(vehicleToParkIndex, 1);
          }
        }

        // Once all vehicles are accounted for, cheapest combo for the location is set and there is no need to continue
        if (remainingVehiclesByLength.length === 0) {
          cheapestCombo = combo;
          break comboLoop;
        }
      }
    }

    // If there is a cheapest combo, add to results
    if (cheapestCombo.length > 0) {
      results.push({
        location_id,
        listing_ids: cheapestCombo.map((listing) => listing.id),
        total_price_in_cents: cheapestCombo.reduce(
          (sum, listing) => sum + listing.price_in_cents,
          0
        ),
      });
    }
  }

  // Return results sorted by price ascending
  return results.sort(
    (a, b) => a.total_price_in_cents - b.total_price_in_cents
  );
}

// Gets all possible combinations of provided listings, with each combo having a maximum size of 5 listings (5 is the maximum number of cars that can be in a request, so we'll never need more than 5 listings)
function getAllCombinations(arr: Listing[]): Listing[][] {
  const result: Listing[][] = [];

  const generateCombinations = (current: Listing[], index: number) => {
    if (current.length > 0 && current.length <= 5) {
      result.push([...current]);
    }
    if (current.length >= 5 || index >= arr.length) return;

    for (let i = index; i < arr.length; i++) {
      current.push(arr[i]);
      generateCombinations(current, i + 1);
      current.pop();
    }
  };

  generateCombinations([], 0);
  return result;
}
