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
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
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
    TabViewModule,
    TableModule,
    ButtonModule,
    MessagesModule,
  ],
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
    TabViewModule,
    TableModule,
    ButtonModule,
    MessagesModule,
  ],
})
export class PrimeNgModule {}
