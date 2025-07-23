import { IOwnership } from './IOwnership';
import { ISpecification } from './ISpecification';

export interface IDetail {
  specification: ISpecification;
  ownership: IOwnership;
  equipment: string[];
}
