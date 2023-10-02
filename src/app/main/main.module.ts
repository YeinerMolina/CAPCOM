import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { MainRoutingModule } from './main-routing.module';
import { RiesgoComponent } from './riesgo/riesgo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [RiesgoComponent, HomeComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
})
export class MainModule {}
