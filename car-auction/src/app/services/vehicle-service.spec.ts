import { TestBed } from '@angular/core/testing';
import { VehicleService } from './vehicle-service';
import { HttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { IVehicle } from '../models/IVehicle';
import { of } from 'rxjs';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const mockVehicles: IVehicle[] = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Corolla',
      engineSize: '1.8L',
      fuel: 'Petrol',
      year: 2020,
      mileage: 15000,
      auctionDateTime: new Date('2025-07-26T12:00:00Z'),
      startingBid: 10000,
      favourite: false,
      details: {
        specification: {
          vehicleType: 'Sedan',
          colour: 'Red',
          fuel: 'Petrol',
          transmission: 'Automatic',
          numberOfDoors: 4,
          co2Emissions: '120g/km',
          noxEmissions: 0.03,
          numberOfKeys: 2,
        },
        ownership: {
          logBook: 'Available',
          numberOfOwners: 1,
          dateOfRegistration: new Date('2020-01-15T00:00:00Z'),
        },
        equipment: ['Air Conditioning', 'Bluetooth', 'Cruise Control'],
      },
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      engineSize: '2.0L',
      fuel: 'Diesel',
      year: 2019,
      mileage: 20000,
      auctionDateTime: new Date('2025-08-01T10:00:00Z'),
      startingBid: 12000,
      favourite: true,
      details: {
        specification: {
          vehicleType: 'Sedan',
          colour: 'Blue',
          fuel: 'Diesel',
          transmission: 'Manual',
          numberOfDoors: 4,
          co2Emissions: '130g/km',
          noxEmissions: 0.04,
          numberOfKeys: 2,
        },
        ownership: {
          logBook: 'Available',
          numberOfOwners: 2,
          dateOfRegistration: new Date('2019-05-20T00:00:00Z'),
        },
        equipment: ['Sunroof', 'Navigation System'],
      },
    },
  ];

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(of(mockVehicles));

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });

    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load vehicles from JSON and set signals', (done) => {
    // signals are async, so we wait a tick
    setTimeout(() => {
      expect(service.vehicles()).toEqual(mockVehicles);
      expect(service.getVehicleById(1)?.make).toBe('Toyota');
      expect(service.getUniqueMakes()).toEqual(['Toyota', 'Honda']);
      done();
    }, 0);
  });

  it('should toggle favourite correctly', (done) => {
    setTimeout(() => {
      expect(service.getVehicleById(1)?.favourite).toBe(false);

      service.toggleFavourite(1);
      expect(service.getVehicleById(1)?.favourite).toBe(true);

      service.toggleFavourite(1);
      expect(service.getVehicleById(1)?.favourite).toBe(false);
      done();
    }, 0);
  });

  it('should get unique models for selected makes', (done) => {
    setTimeout(() => {
      const modelsToyota = service.getUniqueModels(['Toyota']);
      expect(modelsToyota).toEqual(['Corolla']);

      const modelsBoth = service.getUniqueModels(['Toyota', 'Honda']);
      expect(modelsBoth.sort()).toEqual(['Corolla', 'Civic'].sort());
      done();
    }, 0);
  });

  it('should reset filters', (done) => {
    setTimeout(() => {
      // Alter vehicles signal to empty
      service.vehicles.set([]);
      expect(service.vehicles()).toEqual([]);

      service.resetFilters();
      expect(service.vehicles()).toEqual(mockVehicles);
      done();
    }, 0);
  });

  it('should filter and sort vehicles', (done) => {
    setTimeout(() => {
      const sortOptionDesc: SortOption = {
        label: 'Make Desc',
        value: { field: 'make', direction: 'desc' },
      };

      service.getFilteredAndSortedVehicles(
        ['Toyota'], // selectedMakes
        [], // selectedModels
        null, // isFavourite (any)
        [0, 20000], // rangeValues for startingBid
        sortOptionDesc
      );

      const vehicles = service.vehicles();
      expect(vehicles.length).toBe(1);
      expect(vehicles[0].make).toBe('Toyota');

      const sortOptionAsc: SortOption = {
        label: 'StartingBid Asc',
        value: { field: 'startingBid', direction: 'asc' },
      };

      service.getFilteredAndSortedVehicles(
        [],
        [],
        null,
        [0, 20000],
        sortOptionAsc
      );

      const sortedVehicles = service.vehicles();
      expect(sortedVehicles[0].startingBid).toBeLessThanOrEqual(
        sortedVehicles[1].startingBid
      );
      done();
    }, 0);
  });
  it('should filter vehicles by favourite status correctly', (done) => {
    setTimeout(() => {
      // Only favourites
      service.getFilteredAndSortedVehicles([], [], true, [0, 20000], null);
      expect(service.vehicles().every((v) => v.favourite)).toBeTrue();

      // Only non-favourites
      service.getFilteredAndSortedVehicles([], [], false, [0, 20000], null);
      expect(service.vehicles().every((v) => !v.favourite)).toBeTrue();

      done();
    }, 0);
  });

  it('should filter vehicles by startingBid range boundaries', (done) => {
    setTimeout(() => {
      // Range excluding all vehicles
      service.getFilteredAndSortedVehicles([], [], null, [20001, 30000], null);
      expect(service.vehicles().length).toBe(0);

      // Range including some vehicles
      service.getFilteredAndSortedVehicles([], [], null, [11000, 13000], null);
      expect(
        service
          .vehicles()
          .some((v) => v.startingBid >= 11000 && v.startingBid <= 13000)
      ).toBeTrue();

      done();
    }, 0);
  });

  it('should return original vehicles if sortOption is null', (done) => {
    setTimeout(() => {
      service.getFilteredAndSortedVehicles([], [], null, [0, 20000], null);
      const vehiclesBeforeSort = service.vehicles();

      service.getFilteredAndSortedVehicles([], [], null, [0, 20000], null);
      expect(service.vehicles()).toEqual(vehiclesBeforeSort);

      done();
    }, 0);
  });

  it('should sort vehicles correctly by mileage ascending and descending', (done) => {
    setTimeout(() => {
      service.getFilteredAndSortedVehicles([], [], null, [0, 20000], {
        label: 'Mileage Asc',
        value: { field: 'mileage', direction: 'asc' },
      });
      let sortedAsc = service.vehicles();
      expect(sortedAsc[0].mileage).toBeLessThanOrEqual(sortedAsc[1].mileage);

      service.getFilteredAndSortedVehicles([], [], null, [0, 20000], {
        label: 'Mileage Desc',
        value: { field: 'mileage', direction: 'desc' },
      });
      let sortedDesc = service.vehicles();
      expect(sortedDesc[0].mileage).toBeGreaterThanOrEqual(
        sortedDesc[1].mileage
      );

      done();
    }, 0);
  });
});
