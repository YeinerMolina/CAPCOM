import { TestBed } from '@angular/core/testing';

import { ProteccionFormService } from './proteccion-form.service';

describe('ProteccionFormService', () => {
  let service: ProteccionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProteccionFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
