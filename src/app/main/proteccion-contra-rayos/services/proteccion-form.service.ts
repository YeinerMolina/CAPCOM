import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDropDownConfigNumber } from 'src/app/shared/interfaces/interfaces';
import { IProteccionForm } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class ProteccionFormService {
  constructor(private readonly formBuilder: FormBuilder) {}

  build(): FormGroup<IProteccionForm> {
    return this.formBuilder.group({
      ancho: [null, Validators.required],
      largo: [null, Validators.required],
      alto: [null, Validators.required],
      longitudPunta: [null, Validators.required],
      nivelRiesgo: [null, Validators.required],
    }) as FormGroup<IProteccionForm>;
  }

  nivelRiesgo: IDropDownConfigNumber[] = [
    { name: 'I', value: 20 },
    { name: 'II', value: 30 },
    { name: 'III', value: 45 },
    { name: 'IV', value: 55 },
  ];
}
