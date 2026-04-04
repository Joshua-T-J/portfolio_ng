import { TestBed } from '@angular/core/testing';

import { CanvasAnimation } from './canvas-animation';

describe('CanvasAnimation', () => {
  let service: CanvasAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
