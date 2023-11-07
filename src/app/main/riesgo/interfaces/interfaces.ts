import { FormArray, FormControl, FormGroup } from '@angular/forms';

export enum RiesgoTabs {
  estructura = 0,
  probabilidad = 1,
  perdidas = 2,
}

export interface RiesgoForm {
  altura: FormControl<number | null>;
  longitud: FormControl<number | null>;
  ancho: FormControl<number | null>;
  areaRecoleccion: FormControl<number | null>;
  situacionRelativa: FormControl<number | null>;
  tipoAmbiente: FormControl<number | null>;
  densidadDescargasAtmosféricas: FormControl<number | null>;
  proteccionRayo: FormControl<boolean | null>;
  proteccionEstructura: FormControl<boolean>;

  proteccionInterna: FormControl<string | null>;
  proteccionAEstructura: FormControl<string | null>;
  normativaDPS: FormControl<boolean | null>;
  tipoCableAcometida: FormControl<number | null>;
  tensionMinima: FormControl<number | null>;

  dpsEntrada: FormControl<boolean | null>;

  sinMedidaProteccion: FormControl<boolean>;
  aislamientoElectrico: FormControl<boolean>;
  equipotencializacion: FormControl<boolean>;
  avisosDeAdvertencia: FormControl<boolean>;
  restricciones: FormControl<boolean>;

  //Lineas de potencia
  lineas: FormArray<ILineasForm>;

  //Acometida
  tipoAcometida: FormControl<number | null>;
  longitudAco: FormControl<number | null>;
  alturaAco: FormControl<number | null>;
  numeroAcometidasPotencia: FormControl<number | null>;
  numeroAcometidasTelecomunicaciones: FormControl<number | null>;
  aislamientoNivelExterior: FormControl<boolean | null>;
  alturaIngresoAcometida: FormControl<number | null>;
  alturaAcometidaExterna: FormControl<number | null>;

  //Resistividad
  resistividadTerreno: FormControl<number | null>;
  resistividadPantalla: FormControl<number | null>;
}

export type ILineasForm = FormGroup<{
  nSobretenciones: FormControl<number | null>;
  fInstalacion: FormControl<number | null>;
  tipoLinea: FormControl<number | null>;
  fMedio: FormControl<number | null>;
  longitud: FormControl<number | null>;
}>;

export interface RiesgoFormValue {
  altura: number;
  longitud: number;
  ancho: number;
  areaRecoleccion: number;
  situacionRelativa: number;
  tipoAmbiente: number;
  densidadDescargasAtmosféricas: number;
  sinMedidaProteccion: boolean;
  aislamientoElectrico: boolean;
  equipotencializacion: boolean;
  avisosDeAdvertencia: boolean;
  proteccionInterna: string;
  proteccionAEstructura: string;

  lineas: ILineasValue[];

  //Acometida
  tipoAcometida: number;
  longitudAco: number;
  alturaAco: number;
  numeroAcometidasPotencia: number;
  numeroAcometidasTelecomunicaciones: number;
  aislamientoNivelExterior: boolean;
  alturaIngresoAcometida: number;
  alturaAcometidaExterna: number;

  //Resistividad
  resistividadTerreno: number;
  resistividadPantalla: number;
}

export interface ILineasValue {
  nSobretenciones: number;
  tipoLinea: number;
  fInstalacion: number;
  fMedio: number;
  longitud: number;
}
