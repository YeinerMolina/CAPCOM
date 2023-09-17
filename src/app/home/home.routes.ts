import { Route } from '@angular/router';

import { RiesgoComponent } from './riesgo/riesgo.component';

export const homeRoutes: Route[] = [
  {
    path: 'riesgo',
    component: RiesgoComponent,
  },
  {
    path: '**',
    redirectTo: 'riesgo',
  },
];
