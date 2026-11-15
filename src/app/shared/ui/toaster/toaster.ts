import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastKind, ToastService } from '../../../core/toast/toast.service';
import { Icon, IconName } from '../icon/icon';

const ICON: Record<ToastKind, IconName> = { success: 'check', error: 'alert', info: 'info' };

/**
 * Renders toasts from ToastService. Lives once in the app shell.
 * The region is always in the DOM (polite live region) so screen readers announce new toasts;
 * error toasts use role="alert" to be announced immediately.
 */
@Component({
  selector: 'app-toaster',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="toaster" aria-live="polite" aria-relevant="additions" aria-label="Notifications">
      @for (t of toastService.toasts(); track t.id) {
        <div
          class="toast toast--{{ t.kind }}"
          [attr.role]="t.kind === 'error' ? 'alert' : 'status'"
          [style.--toast-duration.ms]="t.duration"
        >
          <span class="toast__icon" aria-hidden="true"><app-icon [name]="icon(t.kind)" [size]="16" [stroke]="2.2" /></span>
          <div class="toast__body">
            <p class="toast__title">{{ t.title }}</p>
            @if (t.message) {
              <p class="toast__message">{{ t.message }}</p>
            }
            @if (t.action; as a) {
              <a class="toast__action" [href]="a.href">{{ a.label }}</a>
            }
          </div>
          <button type="button" class="toast__close" aria-label="Dismiss notification" (click)="toastService.dismiss(t.id)">
            <app-icon name="close" [size]="16" />
          </button>
          @if (t.duration > 0) {
            <span class="toast__timer" aria-hidden="true"></span>
          }
        </div>
      }
    </section>
  `,
  styleUrl: './toaster.scss',
})
export class Toaster {
  protected readonly toastService = inject(ToastService);

  protected icon(kind: ToastKind): IconName {
    return ICON[kind];
  }
}
