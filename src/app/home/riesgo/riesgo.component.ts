import { MenuItem } from 'primeng/api';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-riesgo',
  templateUrl: './riesgo.component.html',
  styleUrls: ['./riesgo.component.scss'],
})
export class RiesgoComponent implements OnInit {
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

  activeIndex: number = 1;
  constructor() {}

  ngOnInit() {}

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }
}
