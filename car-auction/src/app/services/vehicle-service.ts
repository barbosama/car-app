import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IVehicle } from '../models/IVehicle';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private vehiclesSubject = new BehaviorSubject<IVehicle[]>([]);
  vehicles$ = this.vehiclesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadVehiclesFromJson();
  }

  private loadVehiclesFromJson() {
    this.http
      .get<IVehicle[]>('assets/vehicles_dataset.json')
      .subscribe((data) => {
        const withIds = data.map((vehicle, index) => ({
          ...vehicle,
          id: index + 1,
        }));
        this.vehiclesSubject.next(withIds);
      });
  }

  toggleFavourite(id: number) {
    const current = this.vehiclesSubject.getValue();
    const updated = current.map((vehicle) =>
      vehicle.id === id
        ? { ...vehicle, favourite: !vehicle.favourite }
        : vehicle
    );
    this.vehiclesSubject.next(updated);
  }

  getVehicleById(id: number): IVehicle | undefined {
    return this.vehiclesSubject.getValue().find((v) => v.id === id);
  }

  getUniqueMakes(): Observable<string[]> {
    return this.vehicles$.pipe(
      map((vehicles: any) =>
        Array.from(new Set(vehicles.map((vehicle: IVehicle) => vehicle.make)))
      )
    );
  }

  getUniqueModels(selectedMakes: string[]): Observable<string[]> {
    return this.vehicles$.pipe(
      map((vehicles: IVehicle[]) =>
        vehicles
          .filter((vehicle) => selectedMakes.includes(vehicle.make))
          .map((vehicle) => vehicle.model)
      ),
      map((models) => Array.from(new Set(models)))
    );
  }

  applyFilters(
    selectedMakes: string[],
    selectedModels: string[],
    isFavourite: boolean | null,
    rangeValues: number[]
  ): Observable<IVehicle[]> {
    return this.vehicles$.pipe(
      map((vehicles) =>
        vehicles.filter((vehicle) => {
          const matchesMake =
            selectedMakes.length === 0 || selectedMakes.includes(vehicle.make);

          const matchesModel =
            selectedModels.length === 0 ||
            selectedModels.includes(vehicle.model);

          const matchesFavourite =
            isFavourite === null || vehicle.favourite === isFavourite;

          const matchesBid =
            vehicle.startingBid >= rangeValues[0] &&
            vehicle.startingBid <= rangeValues[1];

          return matchesMake && matchesModel && matchesFavourite && matchesBid;
        })
      )
    );
  }
}
