import { Component, OnInit } from '@angular/core';
import { ConfigRiskService } from './services/config-riesk.service';
import { RiesgoFormService } from './services/riesgo-form.service';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ICalcularPerdidasResponse,
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
  visible: boolean = false;
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
    if (this.form.invalid) return this.form.markAllAsTouched();
    const value = this.form.value as RiesgoFormValue;

    const nd = this.caldularNd(value);
    const nm = value.situacionRelativa < 1 ? this.calcularNm(value) : 0;
    const nl = this.calcularNl(value, 'nl');
    const ni = this.calcularNl(value, 'ni');

    const pta = this.calcularMedidasDeProteccionAdicionales(value);
    const pb = this.calcularProteccionEstructura(value);
    const pa = pta * pb;
    const pc = this.calcularValueBlindaje(value.lineas, 'pm');

    const pm = this.calcularPm(value);
    const pv = this.calcularPv(value.lineas);
    const pw = pv;

    const pu = this.calcularPu(value);
    const pz = this.calcularPz(value.lineas);

    const { la, lb, lc, lm, lu, lv, lw, lz } = this.calcularPerdidas(value);

    const ra = nd * pa * la;
    const rb = nd * pb * lb;
    const rc = pc
      .map((item) => item ** nd * lc)
      .reduce((prev, ant) => prev + ant);

    const rm = pm
      .map((item) => item * nm * lm)
      .reduce((prev, ant) => prev + ant);
    const ru = nl
      .map((item, index) => item * pu[index] * lu)
      .reduce((prev, ant) => prev + ant);
    const rv = nl
      .map((item, index) => item * pu[index] * lv)
      .reduce((prev, ant) => prev + ant);
    const rw = nl
      .map((item, index) => item * pw[index] * lw)
      .reduce((prev, ant) => prev + ant);

    const rz = ni
      .map((item, index) => item * pz[index] * lz)
      .reduce((prev, ant) => prev + ant);

    const r1 = ra + rb + ru + rv;
    console.log({
      value,
      nd,
      nm,
      nl,
      ni,
      pta,
      pb,
      pa,
      pc,
      pm,
      pv,
      pw,
      pu,
      pz,
      la,
      lb,
      lc,
      lm,
      lu,
      lv,
      lw,
      lz,
      ra: ra / Math.pow(10, -5),
      rb: rb / Math.pow(10, -5),
      rc: rc / Math.pow(10, -5),
      rm: rm / Math.pow(10, -5),
      ru: ru / Math.pow(10, -5),
      rv: rv / Math.pow(10, -5),
      rw: rw / Math.pow(10, -5),
      rz: rz / Math.pow(10, -5),
      rt: r1 / Math.pow(10, -5),
    });
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

  checkToggleIncendio(id: keyof RiesgoForm) {
    const ids: (keyof RiesgoForm)[] = ['medidasIncendioP', 'medidasIncendioS'];
    if (ids.includes(id)) this.form.controls.sinMedidasIncendio.reset();
    else ids.forEach((id) => this.form.controls[id].reset());
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
  }

  cerrar() {
    if (this.temporalFormGroup.invalid) {
      this.lineasForm.removeAt(this.actualNumber);
      this.temporalFormGroup.reset();
      this.actualNumber = -1;
    }
  }

  deleteLine(index: number) {
    this.lineasForm.removeAt(index);
  }

  getFormLinea(index: number) {
    return this.lineasForm.controls[index];
  }

  validateField(id: string, form: ILineasForm): boolean;
  validateField(id: string, index?: number): boolean;
  validateField(id: string, index?: number | ILineasForm): boolean {
    let form: AbstractControl | null;
    if (index) {
      if (index instanceof FormGroup) form = index.get(id);
      else form = this.lineasForm.controls[index - 1]?.get(id);
    } else form = this.form.get(id);
    if (!form) return false;
    return form.touched && form.invalid;
  }

  checkValidation(event: DropdownChangeEvent) {
    if (event.value === -1) {
      this.form.controls.proteccionAEstructura.addValidators(
        Validators.required
      );
      this.form.controls.proteccionAEstructura;
    } else this.form.controls.proteccionAEstructura.clearValidators();
    this.form.controls.proteccionAEstructura.updateValueAndValidity();
  }

  checkValidationCableado(event: DropdownChangeEvent) {
    if (event.value < 0.2) {
      this.temporalFormGroup.controls.anchoCuadricula.addValidators(
        Validators.required
      );
      this.temporalFormGroup.controls.tensionNominal.addValidators(
        Validators.required
      );
    } else {
      this.temporalFormGroup.controls.anchoCuadricula.clearValidators();
      this.temporalFormGroup.controls.tensionNominal.clearValidators();
    }
    this.temporalFormGroup.controls.anchoCuadricula.updateValueAndValidity();
    this.temporalFormGroup.controls.tensionNominal.updateValueAndValidity();
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
      this.temporalFormGroup.controls.anchoCuadricula.addValidators(
        Validators.required
      );
      this.temporalFormGroup.controls.tensionNominal.addValidators(
        Validators.required
      );
    } else {
      this.temporalFormGroup.controls.anchoCuadricula.clearValidators();
      this.temporalFormGroup.controls.tensionNominal.clearValidators();
    }
    this.temporalFormGroup.controls.anchoCuadricula.updateValueAndValidity();
    this.temporalFormGroup.controls.tensionNominal.updateValueAndValidity();
  }

  checkSuperficie(event: DropdownChangeEvent) {
    if (event.value < 0) {
      this.form.controls.resistenciaContacto.addValidators(Validators.required);
    } else {
      this.form.controls.resistenciaContacto.clearValidators();
    }
    this.form.controls.resistenciaContacto.updateValueAndValidity();
  }

  //Eventos peligrosos
  private caldularNd(value: RiesgoFormValue) {
    const h = value.altura;
    const w = value.ancho;
    const l = value.longitud;

    let ad = value.areaRecoleccion;
    if (!value.areaRecoleccion) {
      ad = l * w + 2 * (3 * h) * (l + w) + Math.PI * Math.pow(3 * h, 2);
    }
    return (
      +value.densidadDescargasAtmosféricas *
      +ad *
      +value.situacionRelativa *
      Math.pow(10, -6)
    );
  }

  private calcularNm(value: RiesgoFormValue) {
    const am = 2 * Math.pow(500, 3) * value.longitud * value.ancho;
    return +value.densidadDescargasAtmosféricas * am;
  }

  private calcularNl(value: RiesgoFormValue, tipo: 'nl' | 'ni') {
    const ng = value.densidadDescargasAtmosféricas;
    return value.lineas.map(
      (item) =>
        ng *
        (tipo === 'nl' ? 40 : 4000) *
        item.longitud *
        item.fInstalacion *
        item.fMedio *
        (item.tipoLinea > 0.9 ? 1 : item.tipoLinea) *
        Math.pow(10, -6)
    );
  }

  //Calculo perdidas vidas humanas
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

  private calcularProteccionEstructura(value: RiesgoFormValue): number {
    if (value.proteccionEstructura === -1) return value.proteccionAEstructura;
    else return value.proteccionEstructura;
  }

  private calcularValueBlindaje(
    lineas: ILineasValue[],
    variable: 'cli' | 'pm' | 'cld'
  ): number[] {
    if (!lineas.length) return [0];
    return lineas.map((item) => {
      let cli: number = 0;
      let cldl: number = 0;
      switch (item.caracteristicasLinea) {
        case 0:
          cli = 1;
          cldl = 1;
          break;
        case 1:
          if (item.fInstalacion === 1) {
            cli = 0.1;
            cldl = 1;
          } else {
            cli = 0.3;
            cldl = 1;
          }
          break;
        case 2:
          cli = 0;
          cldl = 1;
          break;
        case 4:
          cli = 0.2;
          cldl = 1;
          break;
      }

      return {
        pm: item.proteccionDps * cldl,
        cli,
        cld: cldl,
      }[variable]!;
    });
  }

  private calcularPm(value: RiesgoFormValue): number[] {
    return value.lineas.map((item) => {
      if (![0.01, 0.0001].includes(item.cableadoMalla))
        return item.proteccionDps;
      const k1 =
        item.anchoCuadricula < 1 / 10000
          ? Math.pow(10, -4)
          : 0.12 * item.anchoCuadricula;
      const k2 =
        item.anchoCuadricula < 1 / 10000
          ? Math.pow(10, -4)
          : 0.12 * item.anchoCuadricula;
      const k3 = item.cableadoMalla;
      const k4 = 1 / item.tensionNominal;
      const pms = k1 * k2 * k3 * k4;
      return item.proteccionDps * pms;
    });
  }

  private calcularPv(lineas: ILineasValue[]) {
    const pld = this.calcularPli(lineas);
    const cld = this.calcularValueBlindaje(lineas, 'cld');
    return lineas.map(
      (item, index) => item.proteccionDps * pld[index] * cld[index]
    );
  }

  private calcularpld(item: ILineasValue): number {
    if (item.caracteristicasLinea !== 2) return 1;
    if (item.resistenciaBlindaje === 1) {
      switch (item.tensionMinina) {
        case 1:
        case 2:
          return 1;
        case 3:
          return 0.95;
        case 4:
          return 0.9;
        case 5:
          return 0.8;
      }
    }
    if (item.resistenciaBlindaje === 2) {
      switch (item.tensionMinina) {
        case 1:
          return 0.9;
        case 2:
          return 8;
        case 3:
          return 0.6;
        case 4:
          return 0.3;
        case 5:
          return 0.1;
      }
    }
    if (item.resistenciaBlindaje === 3) {
      switch (item.tensionMinina) {
        case 1:
          return 0.6;
        case 2:
          return 0.4;
        case 3:
          return 0.2;
        case 4:
          return 0.04;
        case 5:
          return 0.02;
      }
    }
    return 0;
  }

  private calcularPu(value: RiesgoFormValue) {
    const cld = this.calcularValueBlindaje(value.lineas, 'cld');
    return value.lineas.map((item, index) => {
      const avisos = item.avisos ? 0.1 : 1;
      const aislamientoElectrico = item.avisos ? 0.01 : 1;
      const restriccion = item.restriccionFisica ? 0 : 1;

      const ptu = avisos * aislamientoElectrico * restriccion;
      const peb = item.proteccionDps;
      const pld = this.calcularpld(item);
      const pu = ptu * peb * pld * cld[index];

      return pu;
    });
  }

  private calcularPli(lineas: ILineasValue[]) {
    return lineas.map((item) => {
      if (item.tensionMinina === 1) return 1;
      if (item.tipoLinea === 1) {
        if (item.tensionMinina === 2) return 0.5;
        if (item.tensionMinina === 3) return 0.2;
        if (item.tensionMinina === 4) return 0.08;
        if (item.tensionMinina === 5) return 0.04;
        return 0;
      } else {
        if (item.tensionMinina === 2) return 0.6;
        if (item.tensionMinina === 3) return 0.3;
        if (item.tensionMinina === 4) return 0.16;
        if (item.tensionMinina === 5) return 0.1;
        return 0;
      }
    });
  }

  private calcularPz(lineas: ILineasValue[]) {
    const pli = this.calcularPli(lineas);
    const cli = this.calcularValueBlindaje(lineas, 'cli');
    return lineas.map(
      (item, index) => item.proteccionDps * pli[index] * cli[index]
    );
  }

  // Perdidas
  private calcularPerdidas(value: RiesgoFormValue): ICalcularPerdidasResponse {
    const rt = this.calcularResistenciaContacto(value);
    const la =
      rt *
      0.01 *
      (value.nPersonas / value.nPersonasEstructura) *
      (value.nHoraPersonas / 8760);
    const rp = this.calcularRp(value);
    const rf = this.obtenerRf(value);
    const lb =
      rp *
      rf *
      1 * //Sin daño especial
      0.1 * //Lf - otros
      (value.nPersonas / value.nPersonasEstructura) *
      (value.nHoraPersonas / 8760);
    const lz =
      0.03 *
      (value.nPersonas / value.nPersonasEstructura) *
      (value.nHoraPersonas / 8760);
    return {
      la,
      lu: la,
      lb,
      lv: lb,
      lc: lz,
      lm: lz,
      lw: lz,
      lz,
    };
  }
  private obtenerRf(value: RiesgoFormValue) {
    if (!value.riesgoFuego) return value.riesgoExplosion;
    return value.riesgoFuego;
  }

  private calcularResistenciaContacto(value: RiesgoFormValue) {
    if (value.tipoSuperficie === -1) {
      if (value.resistenciaContacto > 1 && value.resistenciaContacto <= 10)
        return Math.pow(10, -3);
      if (value.resistenciaContacto > 10 && value.resistenciaContacto < 100)
        return Math.pow(10, -4);
      if (value.resistenciaContacto > 100) return Math.pow(10, -5);
      else return Math.pow(10, -2);
    } else return value.tipoSuperficie;
  }

  private calcularRp(value: RiesgoFormValue) {
    if (value.medidasIncendioS) return 0.2;
    if (value.medidasIncendioP) return 0.5;
    else return 1;
  }
}
