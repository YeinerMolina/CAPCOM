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
  densidadDescargasAtmosféricas: FormControl<number | null>;
  proteccionRayo: FormControl<boolean | null>;
  tipoSuperficie: FormControl<number | null>;
  resistenciaContacto: FormControl<number | null>;
  nPersonas: FormControl<number | null>;
  nPersonasEstructura: FormControl<number | null>;
  nHoraPersonas: FormControl<number | null>;

  medidasIncendioP: FormControl<boolean | null>;
  medidasIncendioS: FormControl<boolean | null>;

  proteccionEstructura: FormControl<number | null>;
  proteccionAEstructura: FormControl<number | null>;
  normativaDPS: FormControl<boolean | null>;
  dpsEntrada: FormControl<boolean | null>;

  aislamientoElectrico: FormControl<boolean>;
  equipotencializacion: FormControl<boolean>;
  avisosDeAdvertencia: FormControl<boolean>;
  restricciones: FormControl<boolean>;

  riesgoFuego: FormControl<number | null>;
  riesgoExplosion: FormControl<number | null>;

  //Lineas de potencia
  lineas: FormArray<ILineasForm>;
}

export type ILineasForm = FormGroup<LineaFormGroup>;

export interface LineaFormGroup {
  fInstalacion: FormControl<number | null>;
  tipoLinea: FormControl<number | null>;
  fMedio: FormControl<number | null>;
  longitud: FormControl<number | null>;
  caracteristicasLinea: FormControl<number | null>;
  proteccionDps: FormControl<number | null>;
  tensionMinima: FormControl<number | null>;
  resistenciaBlindaje: FormControl<number | null>;

  avisos: FormControl<boolean | null>;
  aislamientoElectrico: FormControl<boolean | null>;
  restriccionFisica: FormControl<boolean | null>;

  anchoCuadricula: FormControl<number | null>;
  tensionNominal: FormControl<number | null>;
  cableadoMalla: FormControl<number | null>;
}

export interface RiesgoFormValue {
  altura: number;
  longitud: number;
  ancho: number;
  areaRecoleccion: number;
  situacionRelativa: number;
  tipoAmbiente: number;
  densidadDescargasAtmosféricas: number;

  aislamientoElectrico: boolean;
  equipotencializacion: boolean;
  avisosDeAdvertencia: boolean;
  restricciones: boolean;
  proteccionAEstructura: number;
  proteccionEstructura: number;
  tipoSuperficie: number;
  resistenciaContacto: number;
  proteccionIncendio: number;

  nPersonas: number;
  nPersonasEstructura: number;
  nHoraPersonas: number;

  medidasIncendioP: boolean;
  medidasIncendioS: boolean;

  lineas: ILineasValue[];
  aislamientoNivelExterior: boolean;
  alturaIngresoAcometida: number;
  alturaAcometidaExterna: number;

  riesgoFuego: number;
  riesgoExplosion: number;
}

export interface ILineasValue {
  tipoLinea: number;
  fInstalacion: number;
  fMedio: number;
  longitud: number;
  caracteristicasLinea: number;
  proteccionDps: number;
  tensionMinima: number;
  resistenciaBlindaje: number;

  avisos: boolean;
  aislamientoElectrico: boolean;
  restriccionFisica: boolean;

  anchoCuadricula: number;
  tensionNominal: number;
  cableadoMalla: number;
}

export interface ICalcularPerdidasResponse {
  la: number;
  lu: number;
  lb: number;
  lv: number;
  lc: number;
  lm: number;
  lw: number;
  lz: number;
}

export interface ResultMin {
  r1: number;
  ra: number;
  rb: number;
  ru: number;
  rv: number;
  tolerancia: number;
}

export interface IResult extends ResultMin {
  raContribucion: number;
  rbContribucion: number;
  ruContribucion: number;
  rvContribucion: number;
  sugerencias: string[];
  value: RiesgoFormValue;
}

export interface ReadExcelData {
  B: string;
  C: number;
  E: number;
  F: string;
  G: number;
  I: string;
  J: number;
}

export interface ReadExcelResult {
  descripcion: string;
  valor: number;
}

export interface LineasExcelValues {
  [key: number]: ReadExcelResult[];
}
