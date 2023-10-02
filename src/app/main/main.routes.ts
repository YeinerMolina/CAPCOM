import { Route } from '@angular/router';

import { RiesgoComponent } from './riesgo/riesgo.component';
import { HomeComponent } from './home/home.component';

export const mainRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'riesgo',
    component: RiesgoComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
