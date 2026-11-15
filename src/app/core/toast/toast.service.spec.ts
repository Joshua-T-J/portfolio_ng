import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MAX_TOASTS, ToastService } from './toast.service';

describe('ToastService', () => {
  let toasts: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    toasts = TestBed.inject(ToastService);
  });

  it('shows and dismisses a toast', () => {
    const id = toasts.success('Sent');
    expect(toasts.toasts().map((t) => t.title)).toEqual(['Sent']);
    toasts.dismiss(id);
    expect(toasts.toasts()).toEqual([]);
  });

  it('keeps at most MAX_TOASTS, dropping the oldest', () => {
    for (let i = 0; i < MAX_TOASTS + 2; i++) toasts.info(`t${i}`);
    expect(toasts.toasts().length).toBe(MAX_TOASTS);
    expect(toasts.toasts()[0].title).toBe('t2');
  });

  it('auto-dismisses after its duration', () => {
    jasmine.clock().install();
    try {
      toasts.success('Sent', { duration: 1000 });
      jasmine.clock().tick(999);
      expect(toasts.toasts().length).toBe(1);
      jasmine.clock().tick(1);
      expect(toasts.toasts().length).toBe(0);
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
