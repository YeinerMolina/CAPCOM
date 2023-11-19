import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILineasForm, RiesgoForm } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RiesgoFormService {
  constructor(private readonly formBuilder: FormBuilder) {}

  build(): FormGroup<RiesgoForm> {
    return this.formBuilder.group({
      // Estructura
      altura: [null, Validators.required],
      longitud: [null, Validators.required],
      ancho: [null, Validators.required],
      areaRecoleccion: [null],
      situacionRelativa: [null, Validators.required],
      densidadDescargasAtmosféricas: [null, Validators.required],
      proteccionRayo: [false, Validators.required],
      tipoSuperficie: [null, Validators.required],
      resistenciaContacto: [null],
      nPersonas: [null, Validators.required],
      nPersonasEstructura: [null, Validators.required],
      nHoraPersonas: [null, Validators.required],

      medidasIncendioP: [false],
      medidasIncendioS: [false],

      proteccionEstructura: [null, Validators.required],
      proteccionAEstructura: [null],
      normativaDPS: [false, Validators.required],
      dpsEntrada: [false, Validators.required],

      // Probailidad seres vivos
      aislamientoElectrico: [false],
      equipotencializacion: [false],
      avisosDeAdvertencia: [false],
      restricciones: [false],

      riesgoFuego: [null, Validators.required],
      riesgoExplosion: [null, Validators.required],

      //Lineas de potencia
      lineas: this.formBuilder.array<ILineasForm>([]),
    }) as FormGroup<RiesgoForm>;
  }

  buildLineForm(): ILineasForm {
    return this.formBuilder.group({
      tipoLinea: [null, Validators.required],
      fInstalacion: [null, Validators.required],
      fMedio: [null, Validators.required],
      longitud: [null, [Validators.required, Validators.min(0)]],
      caracteristicasLinea: [null, Validators.required],
      proteccionDps: [null, Validators.required],
      tensionMinima: [null, Validators.required],
      resistenciaBlindaje: [null],

      //medidasProteccion
      avisos: [false],
      aislamientoElectrico: [false],
      restriccionFisica: [false],

      anchoCuadricula: [null],
      tensionNominal: [null],
      cableadoMalla: [null, Validators.required],
    }) as ILineasForm;
  }
}
