import { Routes } from '@angular/router';
import { VehicleList } from './components/vehicle-list/vehicle-list';
import { App } from './app';
import { Home } from './components/home/home';
import { VehicleDetail } from './components/vehicle-detail/vehicle-detail';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'car-list',
    component: VehicleList,
  },
  { path: 'vehicle/:id', component: VehicleDetail },
];
