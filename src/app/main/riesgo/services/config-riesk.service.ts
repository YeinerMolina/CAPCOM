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
      value: 0,
    },
    {
      name: 'Subterranea',
      value: 1,
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
}
