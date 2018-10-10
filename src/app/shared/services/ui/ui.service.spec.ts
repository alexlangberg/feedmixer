import { TestBed } from '@angular/core/testing';

import { UIService } from './ui.service';

describe('LayoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UIService = TestBed.get(UIService);
    expect(service).toBeTruthy();
  });
});
