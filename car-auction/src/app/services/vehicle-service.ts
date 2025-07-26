import { Injectable, signal } from '@angular/core';
import { IVehicle } from '../models/IVehicle';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  // Original data, only altered when favourite vehicles
  private originalVehicles = signal<IVehicle[]>([]);
  // Filter and sort
  public vehicles = signal<IVehicle[]>([]);

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
        this.vehicles.set(withIds);
        this.originalVehicles.set(withIds);
      });
  }

  toggleFavourite(id: number) {
    const updated = this.vehicles().map((vehicle) =>
      vehicle.id === id
        ? { ...vehicle, favourite: !vehicle.favourite }
        : vehicle
    );
    this.vehicles.set(updated);
    const updatedOriginal = this.originalVehicles().map((vehicle) =>
      vehicle.id === id
        ? { ...vehicle, favourite: !vehicle.favourite }
        : vehicle
    );
    this.originalVehicles.set(updatedOriginal);
  }

  getVehicleById(id: number): IVehicle | undefined {
    return this.originalVehicles().find((v) => v.id === id);
  }

  getUniqueMakes(): string[] {
    return Array.from(new Set(this.originalVehicles().map((v) => v.make)));
  }

  getUniqueModels(selectedMakes: string[]): string[] {
    return Array.from(
      new Set(
        this.originalVehicles()
          .filter((v) => selectedMakes.includes(v.make))
          .map((v) => v.model)
      )
    );
  }

  resetFilters() {
    this.vehicles.set(this.originalVehicles());
  }

  getFilteredAndSortedVehicles(
    selectedMakes: string[],
    selectedModels: string[],
    isFavourite: boolean | null,
    rangeValues: number[],
    sortOption: SortOption | null
  ) {
    const filtered = this.filterVehicles(
      selectedMakes,
      selectedModels,
      isFavourite,
      rangeValues
    );
    this.vehicles.set(this.sortVehicles(filtered, sortOption));
  }

  private filterVehicles(
    selectedMakes: string[],
    selectedModels: string[],
    isFavourite: boolean | null,
    rangeValues: number[]
  ): IVehicle[] {
    return this.originalVehicles().filter((vehicle) => {
      const matchesMake =
        selectedMakes.length === 0 || selectedMakes.includes(vehicle.make);

      const matchesModel =
        selectedModels.length === 0 || selectedModels.includes(vehicle.model);

      const matchesFavourite =
        isFavourite === null || vehicle.favourite === isFavourite;

      const matchesBid =
        vehicle.startingBid >= rangeValues[0] &&
        vehicle.startingBid <= rangeValues[1];

      return matchesMake && matchesModel && matchesFavourite && matchesBid;
    });
  }

  private sortVehicles(
    vehicles: IVehicle[],
    sortOption: SortOption | null
  ): IVehicle[] {
    if (!sortOption) return vehicles;

    const field = sortOption.value.field;
    const direction = sortOption.value.direction;

    return [...vehicles].sort((a, b) => {
      const fieldA = a[field];
      const fieldB = b[field];
      // no value the order stays the same
      if (fieldA == null || fieldB == null) return 0;
      // -1 indicates that A comes before B
      if (fieldA < fieldB) return direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
