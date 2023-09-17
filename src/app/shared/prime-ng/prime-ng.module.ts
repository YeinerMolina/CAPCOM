import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    StepsModule,
    DropdownModule,
    InputTextModule,
    CardModule,
    InputNumberModule,
    CheckboxModule,
  ],
})
export class PrimeNgModule {}
