import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IVehicle } from '../../models/IVehicle';
import { VehicleService } from '../../services/vehicle-service';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SelectItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-vehicle-list',
  imports: [
    DataViewModule,
    CommonModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    DrawerModule,
    SelectButtonModule,
    MultiSelectModule,
    SliderModule,
  ],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList implements OnInit {
  rowsOptions: number[] = [5, 10, 15, 20];
  vehicles$!: Observable<IVehicle[]>;
  sortOptions!: SelectItem[];
  sortOptionsMileage!: SelectItem[];
  sortKey!: SelectItem;
  sortOrder: number | null = null;
  sortField: string | undefined = undefined;
  isFavouriteFilter: boolean = false;
  showFilters: boolean = false;
  value: string = 'off';
  stateOptions: any[] = [
    { label: 'Favourite', value: true },
    { label: 'Not Favourite', value: false },
  ];
  selectedMake: string[] = [];
  makeList: string[] = [];
  selectedModel: string[] = [];
  modelList: string[] = [];
  rangeValues: number[] = [5000, 50000];
  constructor(public vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicles$ = this.vehicleService.vehicles$;
    this.sortOptions = [
      { label: 'Starting Bid High to Low', value: '!startingBid' },
      { label: 'Starting Bid Low to High', value: 'startingBid' },
    ];
    this.sortOptionsMileage = [
      { label: 'Mileage High to Low', value: '!mileage' },
      { label: 'Mileage Bid Low to High', value: 'mileage' },
    ];
    this.vehicleService.getUniqueMakes().subscribe((result: string[]) => {
      this.makeList = result;
    });
  }

  onChangeMake() {
    if (this.selectedMake && this.selectedMake.length > 0) {
      this.vehicleService
        .getUniqueModels(this.selectedMake)
        .subscribe((result: string[]) => {
          this.modelList = result;
        });
    } else {
      this.modelList = [];
      this.selectedModel = [];
    }
  }

  toggleFavourite(id: number) {
    this.vehicleService.toggleFavourite(id);
  }

  getTimeUntilAuction(date: string): string {
    const diff = new Date(date).getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return `${days} days ${hours % 24} hours`;
  }

  formatNumberToSpecificLocale(value: number): string {
    return value.toLocaleString('pt-PT');
  }

  onSortChange(event: any) {
    let value = event.value;
    if (!value) {
      this.sortField = undefined;
      this.sortOrder = null;
      return;
    }
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
