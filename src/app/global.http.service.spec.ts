import { TestBed } from '@angular/core/testing';

import { Global.HttpService } from './global.http.service';

describe('Global.HttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Global.HttpService = TestBed.get(Global.HttpService);
    expect(service).toBeTruthy();
  });
});
