import { Route } from '@angular/router';

import { MainModule } from './main/main.module';

export const routes: Route[] = [
  {
    path: '',
    loadChildren: () => MainModule,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
