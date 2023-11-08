import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      tipoAmbiente: [null, Validators.required],
      densidadDescargasAtmosféricas: [null, Validators.required],
      proteccionRayo: [false, Validators.required],

      anchoCuadricula: [null, Validators.required],
      tensionNominal: [null, Validators.required],
      cableadoMalla: [null, Validators.required],

      proteccionInterna: [null, Validators.required],

      proteccionEstructura: [null, Validators.required],
      proteccionAEstructura: [null, Validators.required],
      normativaDPS: [false, Validators.required],
      tipoCableAcometida: [null, Validators.required],
      dpsEntrada: [false, Validators.required],

      // Probailidad seres vivos
      sinMedidaProteccion: [false],
      aislamientoElectrico: [false],
      equipotencializacion: [false],
      avisosDeAdvertencia: [false],
      restricciones: [false],

      //Lineas de potencia
      lineas: this.formBuilder.array<ILineasForm>([]),

      //Acometida
      tipoAcometida: [null, Validators.required],
      longitudAco: [null, Validators.required],
      alturaAco: [null, Validators.required],

      numeroAcometidasPotencia: [null, Validators.required],
      numeroAcometidasTelecomunicaciones: [null, Validators.required],
      aislamientoNivelExterior: [false, Validators.required],
      alturaIngresoAcometida: [null, Validators.required],
      alturaAcometidaExterna: [null, Validators.required],

      //Resistividad
      resistividadTerreno: [null, Validators.required],
      resistividadPantalla: [null, Validators.required],
    }) as FormGroup<RiesgoForm>;
  }

  buildLineForm(): ILineasForm {
    return this.formBuilder.group({
      nSobretenciones: [null, [Validators.required, Validators.min(0)]],
      tipoLinea: [null, Validators.required],
      fInstalacion: [null, Validators.required],
      fMedio: [null, Validators.required],
      longitud: [null, [Validators.required, Validators.min(0)]],
      caracteristicasLinea: [null, Validators.required],
      proteccionDps: [null, Validators.required],
      tensionMinima: [null, Validators.required],
      resistenciaBlindaje: [null],

      //medidasProteccion
      medidasDeProteccion: [false],
      avisos: [false],
      aislamientoElectrico: [false],
      restriccionFisica: [false],
    }) as ILineasForm;
  }
}
