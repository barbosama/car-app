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
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

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
    InputTextModule,
  ],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList implements OnInit {
  rowsOptions: number[] = [5, 10, 15, 20];
  vehicles$!: Observable<IVehicle[]>;
  isFavouriteFilter: boolean = false;
  showFilters: boolean = false;
  value: boolean | null = null;
  stateOptions: any[] = [
    { label: 'Favourite', value: true },
    { label: 'Not Favourite', value: false },
  ];
  selectedMake: string[] = [];
  makeList: string[] = [];
  selectedModel: string[] = [];
  modelList: string[] = [];
  rangeValues: number[] = [5000, 50000];
  sortOptions: SortOption[] = [
    { label: 'Make (A-Z)', value: { field: 'make', direction: 'asc' } },
    { label: 'Make (Z-A)', value: { field: 'make', direction: 'desc' } },
    {
      label: 'Starting Bid (Low to High)',
      value: { field: 'startingBid', direction: 'asc' },
    },
    {
      label: 'Starting Bid (High to Low)',
      value: { field: 'startingBid', direction: 'desc' },
    },
    {
      label: 'Mileage (Low to High)',
      value: { field: 'mileage', direction: 'asc' },
    },
    {
      label: 'Mileage (High to Low)',
      value: { field: 'mileage', direction: 'desc' },
    },
    {
      label: 'Auction Date (Earliest First)',
      value: { field: 'auctionDateTime', direction: 'asc' },
    },
    {
      label: 'Auction Date (Latest First)',
      value: { field: 'auctionDateTime', direction: 'desc' },
    },
  ];

  selectedSort: SortOption | null = null;

  constructor(public vehicleService: VehicleService, private router: Router) {}

  ngOnInit(): void {
    this.vehicles$ = this.vehicleService.vehicles$;
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

    if (diff <= 0) return 'Auction started';

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days} days ${hours} hours ${minutes} minutes`;
  }

  formatNumberToSpecificLocale(value: number): string {
    return value.toLocaleString('pt-PT');
  }

  updateVehicles() {
    this.vehicles$ = this.vehicleService.getFilteredAndSortedVehicles(
      this.selectedMake,
      this.selectedModel,
      this.value,
      this.rangeValues,
      this.selectedSort
    );
    this.showFilters = false;
  }

  clearFilters() {
    this.selectedMake = [];
    this.selectedModel = [];
    this.value = null;
    this.rangeValues = [5000, 50000];
    this.selectedSort = null;
    this.vehicles$ = this.vehicleService.vehicles$;
    this.showFilters = false;
  }

  goToDetails(vehicleId: string): void {
    this.router.navigate(['/vehicle', vehicleId]);
  }
}
