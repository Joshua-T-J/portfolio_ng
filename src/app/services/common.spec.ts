import { TestBed } from '@angular/core/testing';

import { Common } from './common';

describe('Common', () => {
  let service: Common;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Common);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
