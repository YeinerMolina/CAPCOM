import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { HomeRoutingModule } from './home-routing.module';
import { RiesgoComponent } from './riesgo/riesgo.component';

@NgModule({
  declarations: [RiesgoComponent],
  imports: [CommonModule, HomeRoutingModule, PrimeNgModule],
})
export class HomeModule {}
