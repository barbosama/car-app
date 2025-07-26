import { Routes } from '@angular/router';
import { VehicleList } from './components/vehicle-list/vehicle-list';
import { VehicleDetail } from './components/vehicle-detail/vehicle-detail';

export const routes: Routes = [
  {
    path: '',
    component: VehicleList,
  },
  { path: 'vehicle/:id', component: VehicleDetail },
];
