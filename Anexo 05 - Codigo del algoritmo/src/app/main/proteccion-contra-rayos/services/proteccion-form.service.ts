import { IDropDownConfigNumber } from 'src/app/shared/interfaces/interfaces';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IBloquesForm, IProteccionForm } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class ProteccionFormService {
  constructor(private readonly formBuilder: FormBuilder) {}

  build(): FormGroup<IProteccionForm> {
    return this.formBuilder.group({
      bloques: this.formBuilder.array<IBloquesForm>([]),
      nivelRiesgo: [null, Validators.required],
    }) as FormGroup<IProteccionForm>;
  }

  bluidBloques() {
    return this.formBuilder.group({
      ancho: [null, Validators.required],
      largo: [null, Validators.required],
      alto: [null, Validators.required],
      longitudPunta: [null, Validators.required],
    }) as IBloquesForm;
  }

  nivelRiesgo: IDropDownConfigNumber[] = [
    { name: 'I', value: 20 },
    { name: 'II', value: 30 },
    { name: 'III', value: 45 },
    { name: 'IV', value: 55 },
  ];
}
