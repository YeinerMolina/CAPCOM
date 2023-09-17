import { Route } from '@angular/router';

import { HomeModule } from './home/home.module';

export const routes: Route[] = [
  {
    path: 'home',
    loadChildren: () => HomeModule,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
