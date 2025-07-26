import { Routes } from '@angular/router';
import { VehicleList } from './components/vehicle-list/vehicle-list';

export const routes: Routes = [
  {
    path: '',
    component: VehicleList,
  },
  {
    path: 'vehicle/:id',
    loadComponent: () =>
      import('./components/vehicle-detail/vehicle-detail').then(
        (m) => m.VehicleDetail
      ),
  },
];
