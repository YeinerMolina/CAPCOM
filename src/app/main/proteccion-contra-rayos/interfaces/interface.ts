import { FormControl } from '@angular/forms';

export interface IRadioEsfera {
  [key: string]: number;
}

export interface IProteccionForm {
  ancho: FormControl<number | null>;
  largo: FormControl<number | null>;
  alto: FormControl<number | null>;
  longitudPunta: FormControl<number | null>;
  nivelRiesgo: FormControl<number | null>;
}

export interface IProteccionFormValue {
  ancho: number;
  largo: number;
  alto: number;
  longitudPunta: number;
  nivelRiesgo: number;
}
