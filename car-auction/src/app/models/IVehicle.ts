import { IDetail } from './IDetail';

export interface IVehicle {
  id: number;
  make: string;
  model: string;
  engineSize: string;
  fuel: string;
  year: number;
  mileage: number;
  auctionDateTime: Date;
  startingBid: number;
  favourite: boolean;
  details: IDetail;
}
