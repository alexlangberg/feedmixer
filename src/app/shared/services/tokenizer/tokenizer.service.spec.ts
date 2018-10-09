import { TestBed } from '@angular/core/testing';

import { TokenizerService } from './tokenizer.service';

describe('TokenizerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenizerService = TestBed.get(TokenizerService);
    expect(service).toBeTruthy();
  });
});
