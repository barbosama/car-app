import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    this.http.get<IVehicle[]>('assets/vehicles.json').subscribe((data) => {
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
}
