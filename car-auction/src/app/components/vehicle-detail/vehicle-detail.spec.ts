import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDetail } from './vehicle-detail';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { VehicleService } from '../../services/vehicle-service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

const vehicleServiceSpy = jasmine.createSpyObj('VehicleService', [
  'getVehicleById',
]);

const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
  params: of({ id: 1 }),
  snapshot: {
    paramMap: {
      get: (key: string) => {
        if (key === 'id') return '1';
        return null;
      },
    },
  },
});

describe('VehicleDetail', () => {
  let component: VehicleDetail;
  let fixture: ComponentFixture<VehicleDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetail],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: VehicleService, useValue: vehicleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
