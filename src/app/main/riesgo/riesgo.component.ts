import { MenuItem } from 'primeng/api';

import { Component, OnInit } from '@angular/core';
import { ConfigRiskService } from './services/config-riesk.service';
import { RiesgoFormService } from './services/riesgo-form.service';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ILineasForm,
  ILineasValue,
  LineaFormGroup,
  RiesgoForm,
  RiesgoFormValue,
} from './interfaces/interfaces';
import { DropdownChangeEvent } from 'primeng/dropdown';

@Component({
  selector: 'app-riesgo',
  templateUrl: './riesgo.component.html',
  styleUrls: ['./riesgo.component.scss'],
})
export class RiesgoComponent implements OnInit {
  activeIndex: number = 0;
  form!: FormGroup<RiesgoForm>;
  visible: boolean = true;
  actualNumber: number = -1;
  temporalFormGroup: ILineasForm = this.formService.buildLineForm();

  get lineasForm(): FormArray<ILineasForm> {
    return this.form.controls.lineas;
  }

  constructor(
    public readonly configService: ConfigRiskService,
    private readonly formService: RiesgoFormService
  ) {}

  ngOnInit(): void {
    this.form = this.formService.build();
  }

  calcular(): void {
    console.log(this.form);
    if (this.form.invalid) return this.form.markAllAsTouched();
    const value = this.form.value as RiesgoFormValue;
    let ad = value.areaRecoleccion;
    const h = value.altura;
    const w = value.ancho;
    const l = value.longitud;
    if (!value.areaRecoleccion) {
      ad = l * w + 2 * (3 * h) * (l + w) + Math.PI * Math.pow(3 * h, 2);
    }

    const nd =
      +value.densidadDescargasAtmosféricas *
      +ad *
      +value.situacionRelativa *
      Math.pow(10, -6);

    const am = 2 * Math.pow(500, 3) * value.longitud * value.ancho;

    const nm = +value.densidadDescargasAtmosféricas * am;

    const lineas = this.calcularValueLineas(value);
    const pc = this.calcularValueBlindaje(value);

    const pm = this.calcularPm(value);

    const pta = this.calcularMedidasDeProteccionAdicionales(value);
    const pb = this.calcularProteccionEstructura(value);
    const pa = pta * pb;
    const pu = this.calcularPu(value);

    console.log({ nd, ad, nm, value, lineas, pta, pb, pa, pc, pm });
  }

  private calcularPu(value: RiesgoFormValue) {
    return value.lineas.map((item) => {
      const avisos = item.avisos ? 0.1 : 1;
      const aislamientoElectrico = item.avisos ? 0.01 : 1;
      const restriccion = item.restriccionFisica ? 0 : 1;

      return avisos * aislamientoElectrico * restriccion;
    });
  }

  private calcularPm(value: RiesgoFormValue): number[] {
    if (!value.cableadoMalla)
      return value.lineas.map((item) => item.proteccionDps);
    const k1 =
      value.anchoCuadricula < 1 / 10000
        ? Math.pow(10, -4)
        : 0.12 * value.anchoCuadricula;
    const k2 =
      value.anchoCuadricula < 1 / 10000
        ? Math.pow(10, -4)
        : 0.12 * value.anchoCuadricula;
    const k3 = value.cableadoMalla;
    const k4 = 1 / value.tensionNominal;
    const pms = k1 * k2 * k3 * k4;
    return value.lineas.map((item) => item.proteccionDps * pms);
  }

  private calcularValueBlindaje(value: RiesgoFormValue): number[] {
    if (!value.lineas.length) [0];
    return value.lineas.map((item) => {
      let _clil: number = 0;
      let cldl: number = 0;
      switch (item.caracteristicasLinea) {
        case 0:
          _clil = 1;
          cldl = 1;
          break;
        case 1:
          if (item.fInstalacion === 1) {
            _clil = 0.1;
            cldl = 1;
          } else {
            _clil = 0.3;
            cldl = 1;
          }
          break;
        case 2:
          _clil = 0;
          cldl = 1;
          break;
        case 4:
          _clil = 0.2;
          cldl = 1;
          break;
      }
      return item.proteccionDps * cldl;
    });
  }

  private calcularProteccionEstructura(value: RiesgoFormValue): number {
    if (value.proteccionEstructura === -1) return value.proteccionAEstructura;
    else return value.proteccionEstructura;
  }

  private calcularMedidasDeProteccionAdicionales(
    value: RiesgoFormValue
  ): number {
    let pta = 1;
    if (value.sinMedidaProteccion) pta *= 1;
    if (value.avisosDeAdvertencia) pta *= Math.pow(10, -1);
    if (value.aislamientoElectrico) pta *= Math.pow(10, -2);
    if (value.equipotencializacion) pta *= Math.pow(10, -3);
    if (value.restricciones) pta *= 0;
    return pta;
  }

  private calcularValueLineas(value: RiesgoFormValue): number[] {
    return value.lineas.map(
      (item: ILineasValue) =>
        value.densidadDescargasAtmosféricas *
        (4000 * item.longitud) *
        item.nSobretenciones *
        item.fInstalacion *
        item.fMedio
    );
  }

  checkToggle(id: keyof RiesgoForm) {
    const ids: (keyof RiesgoForm)[] = [
      'aislamientoElectrico',
      'equipotencializacion',
      'avisosDeAdvertencia',
      'restricciones',
    ];
    if (ids.includes(id)) this.form.controls.sinMedidaProteccion.reset();
    else ids.forEach((id) => this.form.controls[id].reset());
  }

  checkToggleProteccionLInea(id: keyof LineaFormGroup) {
    const ids: (keyof LineaFormGroup)[] = [
      'avisos',
      'aislamientoElectrico',
      'restriccionFisica',
    ];
    if (ids.includes(id))
      this.temporalFormGroup.controls.medidasDeProteccion.reset();
    else ids.forEach((id) => this.temporalFormGroup.controls[id].reset());
  }

  validateProteccion(id: string) {
    return this.form.get(id)?.value;
  }

  getTemporalArrayValue(id: string) {
    return this.temporalFormGroup.get(id)?.value;
  }

  addLine() {
    this.lineasForm.push(this.formService.buildLineForm());
    this.visible = true;
    this.temporalFormGroup.reset();
    this.actualNumber = this.lineasForm.length - 1;
  }

  editLine(index: number) {
    const value = this.lineasForm.controls[index].value;
    this.visible = true;
    this.temporalFormGroup.patchValue(value);
    this.actualNumber = index;
  }

  guardarLinea() {
    if (this.temporalFormGroup.invalid)
      return this.temporalFormGroup.markAllAsTouched();
    this.visible = false;
    const value = this.temporalFormGroup.value;
    this.lineasForm.controls[this.actualNumber].patchValue(value);
    this.temporalFormGroup.reset();
    this.actualNumber = -1;
  }

  cerrar() {
    if (this.temporalFormGroup.invalid) {
      this.lineasForm.removeAt(this.actualNumber);
    } else {
      const value = this.temporalFormGroup.value;
      this.lineasForm.controls[this.actualNumber].patchValue(value);
    }

    this.temporalFormGroup.reset();
    this.actualNumber = -1;
  }

  deleteLine(index: number) {
    this.lineasForm.removeAt(index);
  }

  getFormLinea(index: number) {
    return this.lineasForm.controls[index];
  }

  validateField(id: string, form: ILineasForm): Boolean;
  validateField(id: string, index?: number): Boolean;
  validateField(id: string, index?: number | ILineasForm): Boolean {
    let form: AbstractControl | null;
    if (index) {
      if (index instanceof FormGroup) form = index.get(id);
      else form = this.lineasForm.controls[index - 1]?.get(id);
    } else form = this.form.get(id);
    if (!form) return false;
    return form.touched && form.invalid;
  }

  checkValidation(event: DropdownChangeEvent) {
    if (event.value === -1)
      this.form.controls.proteccionAEstructura.addValidators(
        Validators.required
      );
    else this.form.controls.proteccionAEstructura.clearValidators();
    this.form.controls.proteccionAEstructura.updateValueAndValidity();
  }

  checkValidationTemporalArray(event: DropdownChangeEvent) {
    if (event.value === 2)
      this.temporalFormGroup.controls.resistenciaBlindaje.addValidators(
        Validators.required
      );
    else this.temporalFormGroup.controls.resistenciaBlindaje.clearValidators();
    this.temporalFormGroup.controls.resistenciaBlindaje.updateValueAndValidity();
  }

  checkValidationMalla(event: DropdownChangeEvent) {
    if (event.value) {
      this.form.controls.anchoCuadricula.addValidators(Validators.required);
      this.form.controls.tensionNominal.addValidators(Validators.required);
    } else {
      this.form.controls.anchoCuadricula.clearValidators();
      this.form.controls.tensionNominal.clearValidators();
    }
    this.form.controls.proteccionAEstructura.updateValueAndValidity();
  }
}
