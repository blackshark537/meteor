import { TestBed } from '@angular/core/testing';

import { AudioplayerService } from './audioplayer.service';

describe('AudioplayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioplayerService = TestBed.get(AudioplayerService);
    expect(service).toBeTruthy();
  });
});
