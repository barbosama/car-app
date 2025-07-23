import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IVehicle } from '../../models/IVehicle';
import { VehicleService } from '../../services/vehicle-service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-list',
  imports: [TableModule, CommonModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList implements OnInit {
  vehicles$!: Observable<IVehicle[]>;

  constructor(public vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicles$ = this.vehicleService.vehicles$;
    console.log(this.vehicles$);
  }

  toggleFavourite(id: number) {
    this.vehicleService.toggleFavourite(id);
  }

  getTimeUntilAuction(date: string): string {
    const diff = new Date(date).getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
}
