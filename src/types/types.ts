export interface VehicleRequestItem {
  length: number;
  quantity: number;
}

export interface VehicleResponseItem {
  location_id: string;
  listing_ids: string[];
  total_price_in_cents: number;
}

export interface Listing {
  id: string;
  length: number;
  width: number;
  location_id: string;
  price_in_cents: number;
}
