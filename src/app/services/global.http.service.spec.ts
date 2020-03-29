import { TestBed } from '@angular/core/testing';

import { GlobalHttpService } from './global.http.service';

describe('Global.HttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalHttpService = TestBed.get(GlobalHttpService);
    expect(service).toBeTruthy();
  });
});
