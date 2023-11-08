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
  proteccionEstructura: FormControl<number | null>;

  anchoCuadricula: FormControl<number | null>;
  tensionNominal: FormControl<number | null>;
  cableadoMalla: FormControl<number | null>;

  proteccionInterna: FormControl<string | null>;
  proteccionAEstructura: FormControl<number | null>;
  normativaDPS: FormControl<boolean | null>;
  tipoCableAcometida: FormControl<number | null>;

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

export type ILineasForm = FormGroup<LineaFormGroup>;

export interface LineaFormGroup {
  nSobretenciones: FormControl<number | null>;
  fInstalacion: FormControl<number | null>;
  tipoLinea: FormControl<number | null>;
  fMedio: FormControl<number | null>;
  longitud: FormControl<number | null>;
  caracteristicasLinea: FormControl<number | null>;
  proteccionDps: FormControl<number | null>;
  tensionMinima: FormControl<number | null>;
  resistenciaBlindaje: FormControl<number | null>;

  medidasDeProteccion: FormControl<boolean | null>;
  avisos: FormControl<boolean | null>;
  aislamientoElectrico: FormControl<boolean | null>;
  restriccionFisica: FormControl<boolean | null>;
}

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
  restricciones: boolean;
  proteccionInterna: string;
  proteccionAEstructura: number;
  proteccionEstructura: number;

  anchoCuadricula: number;
  tensionNominal: number;
  cableadoMalla: number;

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
  caracteristicasLinea: number;
  proteccionDps: number;
  tensionMinina: number;
  resistenciaBlindaje: number;

  medidasDeProteccion: boolean;
  avisos: boolean;
  aislamientoElectrico: boolean;
  restriccionFisica: boolean;
}
