import { Route } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProteccionContraRayosComponent } from './proteccion-contra-rayos/proteccion-contra-rayos.component';
import { RiesgoComponent } from './riesgo/riesgo.component';

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
    path: 'SPCR',
    component: ProteccionContraRayosComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
