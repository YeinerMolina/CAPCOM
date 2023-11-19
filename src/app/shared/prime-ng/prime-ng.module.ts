import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MessagesModule } from 'primeng/messages';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';

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
    TabViewModule,
    TableModule,
    ButtonModule,
    MessagesModule,
    DialogModule,
    ToastModule,
    PaginatorModule,
    FileUploadModule,
  ],
})
export class PrimeNgModule {}
