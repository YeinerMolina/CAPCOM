import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { PaginatorState } from 'primeng/paginator';
import { WorkBook, read, utils } from 'xlsx';
import { UiService } from '../services/ui.service';
import {
  ICalcularPerdidasResponse,
  ILineasForm,
  ILineasValue,
  IResult,
  LineasExcelValues,
  ReadExcelData,
  ReadExcelResult,
  ResultMin,
  RiesgoForm,
  RiesgoFormValue,
} from './interfaces/interfaces';
import { ConfigRiskService } from './services/config-riesk.service';
import { RiesgoFormService } from './services/riesgo-form.service';

@Component({
  selector: 'app-riesgo',
  templateUrl: './riesgo.component.html',
  styleUrls: ['./riesgo.component.scss'],
})
export class RiesgoComponent implements OnInit {
  @ViewChild('files') files!: FileUpload;
  form!: FormGroup<RiesgoForm>;
  visible: boolean = false;
  visibleResult: boolean = false;
  actualNumber: number = -1;
  temporalFormGroup: ILineasForm = this.formService.buildLineForm();
  resultados: IResult[] = [];
  showFileModal: boolean = false;
  selectedResult!: IResult;
  first: number | undefined = 0;
  rows: number | undefined = 10;
  totalRecords: number= 0;

  get lineasForm(): FormArray<ILineasForm> {
    return this.form.controls.lineas;
  }

  constructor(
    public readonly configService: ConfigRiskService,
    private readonly formService: RiesgoFormService,
    private readonly uiService: UiService
  ) {}

  ngOnInit(): void {
    this.form = this.formService.build();
  }

  onFileChange(capturedEvent: FileSelectEvent) {
    let workBook: WorkBook | null = null;
    const reader = new FileReader();
    const file = capturedEvent.currentFiles[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = read(data, { type: 'binary' });
      const dataExcel = utils.sheet_to_json<ReadExcelData>(
        workBook.Sheets['Valores'],
        {
          header: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
          range: 4,
        }
      );

      const estructuraArray = dataExcel
        .filter((item) => item.B && !isNaN(item.C))
        .map((item) => ({ descripcion: item.B, valor: item.C }));
      const medidasAdicionalesArray = dataExcel
        .filter((item) => item.I && !isNaN(item.J))
        .map((item) => ({ descripcion: item.I, valor: item.J }));

      const lineasObject = dataExcel
        .filter((item) => item.E && item.F)
        .reduce((obj: LineasExcelValues, item: ReadExcelData) => {
          if (!obj[item.E]) {
            obj[item.E] = [
              {
                descripcion: item.F,
                valor: item.G,
              },
            ];
          } else {
            obj[item.E].push({
              descripcion: item.F,
              valor: item.G,
            });
          }
          return obj;
        }, {});

      const lineas = this.mapLineas(lineasObject);
      this.lineasForm.clear();
      const estructura = estructuraArray.reduce(this.reduceEstructura, {});
      const medidasAdicionales = medidasAdicionalesArray.reduce(
        this.reduceMedidasAdicionales,
        {}
      );

      this.llenarLineas(lineas);
      this.form.patchValue(estructura);
      this.form.patchValue(medidasAdicionales);
      this.showFileModal = false;
      this.uiService.showSuccess('Archivo cargado con éxito');
    };
    reader.readAsBinaryString(file);
  }

  private llenarLineas(lineas: Partial<ILineasValue>[]) {
    lineas.forEach((linea) => {
      const form = this.formService.buildLineForm();
      form.patchValue(linea);
      this.lineasForm.push(form);
    });
  }

  clearFile() {
    this.files.clear();
  }

  downloaExcel() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', '/assets/files/Instructivo_Riesgo.xlsx');
    link.setAttribute('download', 'Instructivo_Riesgo.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  cambiarResultado(event: PaginatorState) {
    this.selectedResult = this.resultados[event.page ?? 0];
    this.first = event.first;
    this.rows = event.rows;
  }

  cleanResults() {
    this.resultados = [];
    this.totalRecords = 0;
  }

  private mapLineas(lineasObject: LineasExcelValues) {
    const lineasArr = Object.values(lineasObject) as ReadExcelResult[][];
    return lineasArr.map((linea) =>
      linea.reduce((acc: Partial<ILineasValue>, actual) => {
        if (actual.descripcion.includes('Tipo de línea'))
          acc.tipoLinea = actual.valor;
        if (actual.descripcion.includes('Longitud'))
          acc.longitud = actual.valor;
        if (actual.descripcion.includes('Apantallamiento'))
          acc.caracteristicasLinea = actual.valor;
        if (actual.descripcion.includes('Resistencia del blindaje'))
          acc.resistenciaBlindaje = actual.valor;
        if (actual.descripcion.includes('Tipo de instalación'))
          acc.fInstalacion = actual.valor;
        if (actual.descripcion.includes('Nivel de protección DPS'))
          acc.proteccionDps = actual.valor;
        if (actual.descripcion.includes('Tensión soportada '))
          acc.tensionMinima = actual.valor;
        if (actual.descripcion.includes('Tipo de ambiente '))
          acc.fMedio = actual.valor;
        if (
          actual.descripcion.includes('Protección con apantallamiento externo')
        )
          acc.cableadoMalla = actual.valor;
        if (actual.descripcion.includes('Avisos'))
          acc.avisos = Boolean(actual.valor);
        if (
          actual.descripcion.includes(
            'Aislamiento eléctrico de partes expuestas'
          )
        )
          acc.aislamientoElectrico = Boolean(actual.valor);
        if (actual.descripcion.includes('Restricciones físicas'))
          acc.restriccionFisica = Boolean(actual.valor);

        return acc;
      }, {})
    );
  }

  private reduceMedidasAdicionales(
    previousValue: Partial<RiesgoFormValue>,
    currentValue: ReadExcelResult
  ) {
    if (currentValue.descripcion.includes('Número de personas en la zona '))
      previousValue.nPersonas = currentValue.valor;
    if (
      currentValue.descripcion.includes('Número de personas en la estructura')
    )
      previousValue.nPersonasEstructura = currentValue.valor;
    if (
      currentValue.descripcion.includes(
        'Número anual de horas que hay personas en la zona '
      )
    )
      previousValue.nHoraPersonas = currentValue.valor;
    if (currentValue.descripcion.includes('Riesgo de explosión'))
      previousValue.riesgoExplosion = currentValue.valor;
    if (currentValue.descripcion.includes('Riesgo de incendio'))
      previousValue.riesgoFuego = currentValue.valor;
    return previousValue;
  }

  private readonly reduceEstructura = (
    previousValue: Partial<RiesgoFormValue>,
    currentValue: ReadExcelResult
  ): Partial<RiesgoFormValue> => {
    if (currentValue.descripcion.includes('Altura [m]'))
      previousValue.altura = currentValue.valor;
    if (currentValue.descripcion.includes('Longitud [m]'))
      previousValue.longitud = currentValue.valor;
    if (currentValue.descripcion.includes('Ancho [m]'))
      previousValue.ancho = currentValue.valor;
    if (currentValue.descripcion.includes('Area de recolección [m]'))
      previousValue.areaRecoleccion = currentValue.valor;
    if (
      currentValue.descripcion.includes('Situación relativa de la estructura')
    )
      previousValue.situacionRelativa = currentValue.valor;
    if (
      currentValue.descripcion.includes(
        'Densidad de descargas atmosféricas [1/km2/año]'
      )
    )
      previousValue.densidadDescargasAtmosféricas = currentValue.valor;
    if (currentValue.descripcion.includes('Nivel de protección contra rayos'))
      previousValue.proteccionEstructura = currentValue.valor;
    if (currentValue.descripcion.includes('Nivel del SPCR'))
      previousValue.proteccionAEstructura = currentValue.valor;
    if (currentValue.descripcion.includes('Tipo de superficie'))
      previousValue.tipoSuperficie = currentValue.valor;
    if (currentValue.descripcion.includes('Avisos de peligro'))
      previousValue.avisosDeAdvertencia = Boolean(currentValue.valor);
    if (
      currentValue.descripcion.includes(
        'Aislamiento eléctrico de partes expuestas'
      )
    )
      previousValue.aislamientoElectrico = Boolean(currentValue.valor);
    if (
      currentValue.descripcion.includes(
        'Equipotencialización efectiva del terreno'
      )
    )
      previousValue.equipotencializacion = Boolean(currentValue.valor);
    if (
      currentValue.descripcion.includes(
        'Restricciones físicas o de uso de armadura metálica del edificio como conducto de bajada'
      )
    )
      previousValue.restricciones = Boolean(currentValue.valor);

    return previousValue;
  };

  calcular(prevValue?: RiesgoFormValue): ResultMin | void | IResult {
    let value: RiesgoFormValue;
    if (!prevValue) {
      if (this.form.invalid) {
        console.log(this.form);
        this.uiService.showError(
          'Por favor llenar todos los campos requeridos'
        );
        return this.form.markAllAsTouched();
      }
      value = this.form.value as RiesgoFormValue;
    } else {
      value = { ...prevValue };
    }

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
    const result = {
      r1: r1 * Math.pow(10, 5),
      ra: ra * Math.pow(10, 5),
      rb: rb * Math.pow(10, 5),
      ru: ru * Math.pow(10, 5),
      rv: rv * Math.pow(10, 5),
      tolerancia: 1,
    };
    const resultadoFinal = {
      ...result,
      raContribucion: (ra / r1) * 100,
      rbContribucion: (rb / r1) * 100,
      ruContribucion: (ru / r1) * 100,
      rvContribucion: (rv / r1) * 100,
      sugerencias: [],
      value: prevValue ?? value,
    };

    if (prevValue) return resultadoFinal;
    else {
      this.resultados = [];
      this.resultados = [resultadoFinal];
      this.totalRecords = 1;
      this.selectedResult = resultadoFinal;
      this.visibleResult = true;
    }
  }

  cargarSolucion() {
     let actualValue = this.form.value as RiesgoFormValue;

    const values: [string, number][] = Object.entries(this.resultados[0]);
    const maxContribution = values.reduce(
      (max, curr): [string, number] => {
        if (curr[0].includes('Contribucion') || curr[0] === 'r1') return max;
        return (max = curr[1] > max[1] ? curr : max);
      },
      ['', 0]
    );
    const property = maxContribution.shift() as string;
    let solved: boolean = false;
    let sugerencias: string[] = [];
    if (property === 'rv') {
      solved = this.reducirRiesgoLineas(actualValue);
      sugerencias.push('DPS_LINEA')
      if (solved) {
        const solucion = this.calcular(actualValue) as IResult;
        solucion.sugerencias = sugerencias;
        sugerencias = [];
        this.resultados.push(solucion);
        actualValue = this.form.value as RiesgoFormValue
      }
    }
    if(['rv', 'rb'].includes(property)){
      solved = this.aumentarProteccionRayos(actualValue);
      sugerencias.push('SPCR')
      if (solved) {
        const solucion = this.calcular(actualValue) as IResult;
        solucion.sugerencias = sugerencias;
        sugerencias = [];
        this.resultados.push(solucion);
        actualValue = this.form.value as RiesgoFormValue
      }
    }
    this.totalRecords = this.resultados.length
    if(this.resultados.length > 1) this.uiService.showSuccess('Sugerencias cargadas');
    else this.uiService.showSuccess('No se encontraron sugerencia');
  }

  //Soluciones
  private reducirRiesgoLineas(actualValue: RiesgoFormValue): boolean {
    let changed: boolean = false;
    actualValue.lineas.forEach((linea) => {
      const nextValue = this.configService.nivelProteccionRayo
        .find((item) => item.value < linea.proteccionDps);
      if (!nextValue) return;
      console.log(nextValue)
      changed = true;
      linea.proteccionDps = nextValue.value;
    });
    if (!changed) return false;
    const result = this.calcular(actualValue) as ResultMin;
    if (result.tolerancia < result.r1 && changed)
      this.reducirRiesgoLineas(actualValue);
    return result.tolerancia > result.r1;
  }

  private aumentarProteccionRayos(actualValue: RiesgoFormValue): boolean {
    const nextValue = this.configService.nivelProteccion.find(
      (item) => item.value > actualValue.proteccionAEstructura
    );
    if (!nextValue) return false;
    actualValue.proteccionAEstructura = nextValue.value;
    actualValue.proteccionEstructura = -1;
    const result = this.calcular(actualValue) as ResultMin
    if (result.tolerancia < result.r1)
      this.aumentarProteccionRayos(actualValue);
    console.log({ result, nexValue: nextValue })
    return result.tolerancia > result.r1;
  }

  //Validaciones
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
    } else this.form.controls.proteccionAEstructura.clearValidators();
    this.form.controls.proteccionAEstructura.updateValueAndValidity();
  }

  checkValidationCableado(event: DropdownChangeEvent) {
    if ([0.01, 0.0001].includes(event.value)) {
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

  validateProteccion(id: string) {
    return this.form.get(id)?.value;
  }

  verificarResultado(): boolean {
    return true;
  }

  getTemporalArrayValue(id: string) {
    return this.temporalFormGroup.get(id)?.value;
  }

  //Lineas
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
    if (this.temporalFormGroup.invalid) {
      this.uiService.showError(
        'Debe ingresar todos los campos para poder guardar la línea'
      );
      console.log(this.temporalFormGroup);
      return this.temporalFormGroup.markAllAsTouched();
    }
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
      switch (item.tensionMinima) {
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
      switch (item.tensionMinima) {
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
      switch (item.tensionMinima) {
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
      return ptu * peb * pld * cld[index];
    });
  }

  private calcularPli(lineas: ILineasValue[]) {
    return lineas.map((item) => {
      if (item.tensionMinima === 1) return 1;
      if (item.tipoLinea === 1) {
        if (item.tensionMinima === 2) return 0.5;
        if (item.tensionMinima === 3) return 0.2;
        if (item.tensionMinima === 4) return 0.08;
        if (item.tensionMinima === 5) return 0.04;
        return 0;
      } else {
        if (item.tensionMinima === 2) return 0.6;
        if (item.tensionMinima === 3) return 0.3;
        if (item.tensionMinima === 4) return 0.16;
        if (item.tensionMinima === 5) return 0.1;
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

  //Excel
  subirExcel() {
    this.showFileModal = true;
  }
}
