import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { IDropDownConfig } from 'src/app/shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigRiskService {
  constructor() {}

  items: MenuItem[] = [
    {
      label: 'Caracteristicas de la estructura',
    },
    {
      label: 'Evaluación de probabilidad de daños',
    },
    {
      label: 'Evalucación de pérdidas',
    },
  ];

  tipoAcometida: IDropDownConfig<number>[] = [
    {
      name: 'Aerea',
      value: 1,
    },
    {
      name: 'Subterranea',
      value: 0.5,
    },
    {
      name: 'Cables subterráneos bajo una malla de puesta a tierra',
      value: 0.01,
    },
  ];

  situacionEstructura: IDropDownConfig<number>[] = [
    {
      name: 'Estructura rodeada por objetos más altos',
      value: 0.25,
    },
    {
      name: 'Estructura rodeada por objetos de la misma altura o inferior',
      value: 0.5,
    },
    {
      name: 'Estructura aislada: sin otros objetos en las proximidades',
      value: 1,
    },
    {
      name: 'Estructura aislada en la parte superior de una colina o de un montículo',
      value: 2,
    },
  ];

  tipoAmbiente: IDropDownConfig<number>[] = [
    {
      name: 'Urbano con edificaciones de altas (Más de 20m de altura)',
      value: 0,
    },
    {
      name: 'Urbano (Entre 10m y 20m de altura)',
      value: 0.1,
    },
    {
      name: 'Suburbano (Menores a 10m de altura)',
      value: 0.5,
    },
    {
      name: 'Rural',
      value: 1,
    },
  ];

  proteccionEstructura: IDropDownConfig<number>[] = [
    {
      name: 'No protegida',
      value: 0,
    },
  ];

  tipoTransformador: IDropDownConfig<number>[] = [
    {
      name: 'Transformador con devanado primario y secundario desacoplados eléctricamente',
      value: 1,
    },
    {
      name: 'Auto transformador',
      value: 1,
    },
    {
      name: 'Sin transformador',
      value: 1,
    },
  ];

  nivelProteccion: IDropDownConfig<number>[] = [
    {
      name: 'IV',
      value: 1,
    },
    {
      name: 'III',
      value: 1,
    },
    {
      name: 'II',
      value: 1,
    },
    {
      name: 'I',
      value: 1,
    },
  ];

  nivelProteccionRayo: IDropDownConfig<number>[] = [
    {
      name: 'III - IV',
      value: 1,
    },
    {
      name: 'I',
      value: 1,
    },
    {
      name: 'Mayor capacidad de corriente soportable que el nivel I',
      value: 1,
    },
  ];

  tipoCableAcometida: IDropDownConfig<number>[] = [
    {
      name: 'Cable sin pantalla',
      value: 1,
    },
    {
      name: 'Cable con pantalla sin equipotencializar',
      value: 1,
    },
    {
      name: 'Cable apantallado (5 < Rs <= 20)',
      value: 1,
    },
    {
      name: 'Cable apantallado (1 < Rs <= 5)',
      value: 1,
    },
    {
      name: 'Cable apantallado (Rs < 1)',
      value: 1,
    },
  ];

  tensionMinima: IDropDownConfig<number>[] = [
    {
      name: '1.5',
      value: 1,
    },
    {
      name: '2.5',
      value: 1,
    },
    {
      name: '4',
      value: 1,
    },
    {
      name: '6',
      value: 1,
    },
  ];

  catecteristicaLinea: IDropDownConfig<number>[] = [
    {
      name: 'Pantalla en contacto con el suelo',
      value: 1,
    },
    {
      name: 'Pantalla sin contacto con el suelo',
      value: 1,
    },
    {
      name: 'Sin pantalla',
      value: 1,
    },
  ];

  factorTipoLinea: IDropDownConfig<number>[] = [
    {
      name: 'Linea de potencia de BT, linea de datos o de telecomunicaciones',
      value: 1,
    },
    {
      name: 'Linea de potencia de AT (con transformacion AT/BT)',
      value: 0.2,
    },
  ];
}
