import { Component, OnInit } from '@angular/core';
import { IVehicle } from '../../models/IVehicle';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle-service';
import { GalleriaModule } from 'primeng/galleria';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vehicle-detail',
  imports: [
    GalleriaModule,
    CardModule,
    DividerModule,
    AccordionModule,
    ButtonModule,
    RouterModule,
  ],
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.css',
})
export class VehicleDetail implements OnInit {
  vehicle: IVehicle | undefined;
  images: any[] = [
    {
      previewImageSrc: 'assets/blue_car.webp',
      thumbnailImageSrc: 'assets/blue_car.webp',
      alt: 'Car 1',
      title: 'Car 1',
    },
    {
      previewImageSrc: 'assets/bmw1.jpg',
      thumbnailImageSrc: 'assets/bmw1.jpg',
      alt: 'Car 2',
      title: 'Car 2',
    },
    {
      previewImageSrc: 'assets/bmw2.jpg',
      thumbnailImageSrc: 'assets/bmw2.jpg',
      alt: 'Car 2',
      title: 'Car 2',
    },
  ];
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicle = this.vehicleService.getVehicleById(Number(id));
    }
  }
}
