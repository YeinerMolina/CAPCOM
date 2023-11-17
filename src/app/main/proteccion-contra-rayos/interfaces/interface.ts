import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface IRadioEsfera {
  [key: string]: number;
}

export interface IProteccionForm {
  bloques: FormArray<IBloquesForm>;
  nivelRiesgo: FormControl<number | null>;
}

export interface IProteccionFormValue {
  bloques: IProteccionBloquesValue[];
  nivelRiesgo: number;
}

export interface IProteccionBloquesValue {
  ancho: number;
  largo: number;
  alto: number;
  longitudPunta: number;
}

export type IBloquesForm = FormGroup<IBloquesFormGroup>;
export interface IBloquesFormGroup {
  ancho: FormControl<number | null>;
  largo: FormControl<number | null>;
  alto: FormControl<number | null>;
  longitudPunta: FormControl<number | null>;
}
