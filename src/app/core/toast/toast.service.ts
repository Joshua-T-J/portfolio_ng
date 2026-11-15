import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastAction {
  readonly label: string;
  readonly href: string;
}

export interface Toast {
  readonly id: number;
  readonly kind: ToastKind;
  readonly title: string;
  readonly message?: string;
  readonly action?: ToastAction;
  /** Auto-dismiss after this many ms; 0 = stays until dismissed. */
  readonly duration: number;
}

export interface ToastOptions {
  readonly message?: string;
  readonly action?: ToastAction;
  readonly duration?: number;
}

const DEFAULT_DURATION: Record<ToastKind, number> = {
  success: 6000,
  info: 6000,
  error: 10000, // errors stay longer so people can read them and act
};

/** At most this many toasts are visible; the oldest is dropped first. */
export const MAX_TOASTS = 3;

/**
 * App-wide notifications. Components call `success()` / `error()`; the Toaster component
 * (rendered once in the app shell) displays them. Server-side rendering never schedules timers.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 1;

  private readonly _toasts = signal<readonly Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.timers.forEach(clearTimeout));
  }

  success(title: string, options?: ToastOptions): number {
    return this.show('success', title, options);
  }

  error(title: string, options?: ToastOptions): number {
    return this.show('error', title, options);
  }

  info(title: string, options?: ToastOptions): number {
    return this.show('info', title, options);
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(kind: ToastKind, title: string, options: ToastOptions = {}): number {
    const toast: Toast = {
      id: this.nextId++,
      kind,
      title,
      message: options.message,
      action: options.action,
      duration: options.duration ?? DEFAULT_DURATION[kind],
    };

    const list = [...this._toasts(), toast];
    while (list.length > MAX_TOASTS) this.dismissQuietly(list.shift()!.id);
    this._toasts.set(list);

    if (this.isBrowser && toast.duration > 0) {
      this.timers.set(toast.id, setTimeout(() => this.dismiss(toast.id), toast.duration));
    }
    return toast.id;
  }

  private dismissQuietly(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
  }
}
