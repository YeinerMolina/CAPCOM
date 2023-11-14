import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PrimeNgModule } from '../shared/prime-ng/prime-ng.module';
import { MainRoutingModule } from './main-routing.module';
import { RiesgoComponent } from './riesgo/riesgo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ButtonModule } from 'primeng/button';
import { ProteccionContraRayosComponent } from './proteccion-contra-rayos/proteccion-contra-rayos.component';

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
