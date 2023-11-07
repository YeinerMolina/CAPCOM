import { MenuItem } from 'primeng/api';

import { Component, OnInit } from '@angular/core';
import { ConfigRiskService } from './services/config-riesk.service';
import { RiesgoFormService } from './services/riesgo-form.service';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  ILineasForm,
  ILineasValue,
  RiesgoForm,
  RiesgoFormValue,
} from './interfaces/interfaces';

@Component({
  selector: 'app-riesgo',
  templateUrl: './riesgo.component.html',
  styleUrls: ['./riesgo.component.scss'],
})
export class RiesgoComponent implements OnInit {
  activeIndex: number = 0;
  form!: FormGroup<RiesgoForm>;

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

    console.log({ nd, ad, nm, value, lineas });
  }

  private calcularValueLineas(value: RiesgoFormValue) {
    return value.lineas.map(
      (item: ILineasValue) =>
        value.densidadDescargasAtmosféricas *
        (4000 * item.longitud) *
        item.nSobretenciones *
        item.fInstalacion *
        item.fMedio
    );
  }

  checkToggle() {
    if (this.form.controls.sinMedidaProteccion.value) {
      const ids: (keyof RiesgoForm)[] = [
        'aislamientoElectrico',
        'equipotencializacion',
        'avisosDeAdvertencia',
      ];
      ids.forEach((id) => this.form.controls[id].reset());
    }
  }

  validateProteccion(id: string) {
    return this.form.get(id)?.value;
  }

  addLine() {
    this.lineasForm.push(this.formService.buildLineForm());
  }

  deleteLine(index: number) {
    this.lineasForm.removeAt(index);
  }

  getFormLinea(index: number) {
    return this.lineasForm.controls[index];
  }

  validateField(id: string, index?: number): Boolean {
    let form: AbstractControl | null;
    if (index) {
      form = this.lineasForm.controls[index - 1]?.get(id);
    } else {
      form = this.form.get(id);
    }
    if (!form) return false;
    return form.touched && form.invalid;
  }
}
