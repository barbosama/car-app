import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleList } from './vehicle-list';
import { provideZonelessChangeDetection } from '@angular/core';
import { VehicleService } from '../../services/vehicle-service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', [
  'getUniqueModels',
  'getUniqueMakes',
  'toggleFavourite',
  'getFilteredAndSortedVehicles',
  'resetFilters',
]);

vehicleServiceSpy.vehicles = signal([]);
vehicleServiceSpy.getUniqueModels.and.returnValue(['Model1', 'Model2']);

describe('VehicleList', () => {
  let fixture: ComponentFixture<VehicleList>;
  let component: VehicleList;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleList, CommonModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: VehicleService, useValue: vehicleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleList);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset selectedModel and update modelList on onChangeMake()', () => {
    component.selectedMake = ['BrandA'];
    component.selectedModel = ['OldModel'];

    component.onChangeMake();

    expect(component.selectedModel).toEqual([]);
    expect(vehicleServiceSpy.getUniqueModels).toHaveBeenCalledWith(['BrandA']);
    expect(component.modelList).toEqual(['Model1', 'Model2']);
  });

  it('should clear modelList if no selectedMake is provided', () => {
    component.selectedMake = [];
    component.modelList = ['Model1', 'Model2'];

    component.onChangeMake();

    expect(component.modelList).toEqual([]);
  });

  it('should call toggleFavourite with correct id', () => {
    component.toggleFavourite(42);
    expect(vehicleServiceSpy.toggleFavourite).toHaveBeenCalledWith(42);
  });

  it('should return "Auction started" if date is in the past', () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const result = component.getTimeUntilAuction(pastDate);
    expect(result).toBe('Auction started');
  });

  it('should format time until auction correctly for future dates', () => {
    const fixedNow = new Date('2025-07-26T12:00:00Z');
    // Set a future auction date: +1 day and 2 hours
    const futureDate = new Date('2025-07-27T14:00:00Z');

    const result = component.getTimeUntilAuction(
      futureDate.toISOString(),
      fixedNow
    );

    expect(result).toBe('1 days 2 hours 0 minutes');
  });

  it('should format number to pt-PT locale', () => {
    const result = component.formatNumberToSpecificLocale(1234567.89);
    expect(result).toBe('1 234 567,89');
  });

  it('should call getFilteredAndSortedVehicles with correct filters and close filters', () => {
    component.selectedMake = ['Make1'];
    component.selectedModel = ['Model1'];
    component.value = true;
    component.rangeValues = [10000, 30000];
    component.selectedSort = {
      label: 'Starting Bid (Low to High)',
      value: { field: 'startingBid', direction: 'asc' },
    };

    component.showFilters = true;
    component.updateVehicles();

    expect(vehicleServiceSpy.getFilteredAndSortedVehicles).toHaveBeenCalledWith(
      ['Make1'],
      ['Model1'],
      true,
      [10000, 30000],
      component.selectedSort
    );
    expect(component.showFilters).toBeFalse();
  });

  it('should clear all filters and call resetFilters', () => {
    component.selectedMake = ['Make1'];
    component.selectedModel = ['Model1'];
    component.value = true;
    component.rangeValues = [10000, 30000];
    component.selectedSort = {
      label: 'Starting Bid (Low to High)',
      value: { field: 'startingBid', direction: 'asc' },
    };
    component.showFilters = true;

    component.clearFilters();

    expect(component.selectedMake).toEqual([]);
    expect(component.selectedModel).toEqual([]);
    expect(component.value).toBeNull();
    expect(component.rangeValues).toEqual([5000, 50000]);
    expect(component.selectedSort).toBeNull();
    expect(component.showFilters).toBeFalse();
    expect(vehicleServiceSpy.resetFilters).toHaveBeenCalled();
  });
});
