import { MenuItem } from 'primeng/api';

import { Component, OnInit } from '@angular/core';
import { ConfigRiskService } from './services/config-riesk.service';

@Component({
  selector: 'app-riesgo',
  templateUrl: './riesgo.component.html',
  styleUrls: ['./riesgo.component.scss'],
})
export class RiesgoComponent {
  activeIndex: number = 0;
  nd: number = 0;

  constructor(public readonly configService: ConfigRiskService) {}

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }
}
