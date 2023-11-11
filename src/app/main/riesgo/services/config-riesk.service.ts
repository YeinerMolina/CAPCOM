import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { IDropDownConfigNumber } from 'src/app/shared/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigRiskService {
  constructor() {}

  getLabel(value: number, arrayName: keyof ConfigRiskService) {
    const array = this[arrayName] as IDropDownConfigNumber[];
    if (!array) return value;
    return array.find((item) => item.value === value)?.name ?? '';
  }

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

  tipoAcometida: IDropDownConfigNumber[] = [
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

  situacionEstructura: IDropDownConfigNumber[] = [
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

  tipoAmbiente: IDropDownConfigNumber[] = [
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

  proteccionEstructura: IDropDownConfigNumber[] = [
    {
      name: 'No protegida por un SPCR',
      value: 1,
    },
    {
      name: 'Protegida por un SPCR',
      value: -1,
    },
    {
      name: 'Estructura con dispositivo captador de nivel I, con armaduras metálicas continuas o armaduras de hormigón actuando como conductores naturales de bajada',
      value: 0.01,
    },
    {
      name: '',
      value: 0.001,
    },
  ];

  tipoTransformador: IDropDownConfigNumber[] = [
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

  nivelProteccion: IDropDownConfigNumber[] = [
    {
      name: 'IV',
      value: 0.2,
    },
    {
      name: 'III',
      value: 0.1,
    },
    {
      name: 'II',
      value: 0.05,
    },
    {
      name: 'I',
      value: 0.02,
    },
  ];

  nivelProteccionRayo: IDropDownConfigNumber[] = [
    {
      name: 'Sin un sistema coordinado de DPS',
      value: 1,
    },
    {
      name: 'III - IV',
      value: 0.05,
    },
    {
      name: 'II',
      value: 0.02,
    },
    {
      name: 'I',
      value: 0.01,
    },
  ];

  tensionMinima: IDropDownConfigNumber[] = [
    {
      name: '1',
      value: 1,
    },
    {
      name: '1.5',
      value: 2,
    },
    {
      name: '2.5',
      value: 3,
    },
    {
      name: '4',
      value: 4,
    },
    {
      name: '6',
      value: 5,
    },
  ];

  catecteristicaLinea: IDropDownConfigNumber[] = [
    {
      name: 'Linea de potencia con multi puesta a tierra del neutro',
      value: 4,
    },
    {
      name: 'Cable o cableado colocado en conductos protegidos contra el rayo, conductos o tubos metálicos',
      value: 3,
    },
    {
      name: 'Apantallada conectada a la misma barra equipotencial que el equipamiento',
      value: 2,
    },
    {
      name: 'Apantallada sin conectar a la misma barra equipotencial que el equipamiento',
      value: 1,
    },
    {
      name: 'Sin apantallamiento',
      value: 0,
    },
  ];

  factorTipoLinea: IDropDownConfigNumber[] = [
    {
      name: 'Linea de datos o de telecomunicaciones',
      value: 1,
    },
    {
      name: 'Linea de potencia de BT',
      value: 0.99,
    },
    {
      name: 'Linea de potencia de AT (con transformacion AT/BT)',
      value: 0.2,
    },
  ];

  cableadoMalla: IDropDownConfigNumber[] = [
    {
      name: 'Sin apantallamiento externo',
      value: 0,
    },
    {
      name: 'Cable sin blindar - sin precauciones de cableado para evitar bucles',
      value: 1,
    },
    {
      name: 'Cable sin blindar - con precauciones de cableado para evitar grandes bucles',
      value: 0.2,
    },
    {
      name: 'Cable con blindaje - con precauciones de cableado para evitar bucles',
      value: 0.01,
    },
    {
      name: 'Cable con blindaje y cables en conductos metálicos',
      value: 0.0001,
    },
  ];

  medidasProteccionLinea: IDropDownConfigNumber[] = [
    {
      name: 'Sin medidas de protección',
      value: 1,
    },
    {
      name: 'Avisos',
      value: 0.1,
    },
    {
      name: 'Aislamiento eléctrico',
      value: 0.01,
    },
    {
      name: 'Restricciones físicas',
      value: 0,
    },
  ];

  resistenciaBlindaje: IDropDownConfigNumber[] = [
    {
      name: 'Cable apantallado (5 < Rs <= 20)',
      value: 1,
    },
    {
      name: 'Cable apantallado (1 < Rs <= 5)',
      value: 2,
    },
    {
      name: 'Cable apantallado (Rs <= 1)',
      value: 3,
    },
  ];

  tipoSuperficie: IDropDownConfigNumber[] = [
    {
      name: 'Agrícola, hormigón',
      value: 0.01,
    },
    {
      name: 'Mármol, cerámica',
      value: 0.001,
    },
    {
      name: 'Grava, tapetes, alfombra',
      value: 0.0001,
    },
    {
      name: 'Asfalto, linóleo, madera',
      value: 0.00001,
    },
    {
      name: 'Otro',
      value: -1,
    },
  ];

  riesgoFuego: IDropDownConfigNumber[] = [
    {
      name: 'Alto',
      value: 0.1,
    },
    {
      name: 'Normal',
      value: 0.01,
    },
    {
      name: 'Bajo',
      value: 0.001,
    },
    {
      name: 'Ninguno',
      value: 0,
    },
  ];

  riesgoExplosion: IDropDownConfigNumber[] = [
    {
      name: 'Zonas 0, 20 y explosivos sólidos',
      value: 1,
    },
    {
      name: 'Zonas 1, 21',
      value: 0.1,
    },
    {
      name: 'Zonas 2, 22',
      value: 0.001,
    },
    {
      name: 'Ninguno',
      value: 0,
    },
  ];
}
