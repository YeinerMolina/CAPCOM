import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { HomeComponent } from './home/home.component';
import { MainRoutingModule } from './main-routing.module';
import { ProteccionContraRayosComponent } from './proteccion-contra-rayos/proteccion-contra-rayos.component';
import { RiesgoComponent } from './riesgo/riesgo.component';

@NgModule({
  declarations: [
    RiesgoComponent,
    HomeComponent,
    ProteccionContraRayosComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
  ],
})
export class MainModule {}
