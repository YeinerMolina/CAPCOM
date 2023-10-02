import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { ListboxModule } from 'primeng/listbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';

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
    ListboxModule,
    ToggleButtonModule,
    FieldsetModule,
    PanelModule,
  ],
})
export class PrimeNgModule {}
