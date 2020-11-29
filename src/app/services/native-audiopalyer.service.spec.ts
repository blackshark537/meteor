import { TestBed } from '@angular/core/testing';

import { NativeAudiopalyerService } from './native-audiopalyer.service';

describe('NativeAudiopalyerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NativeAudiopalyerService = TestBed.get(NativeAudiopalyerService);
    expect(service).toBeTruthy();
  });
});
