import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-up'
  | 'arrow-left'
  | 'download'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'check'
  | 'menu'
  | 'close'
  | 'chevron-down'
  | 'terminal'
  | 'scan-face'
  | 'code'
  | 'braces'
  | 'cloud'
  | 'pen'
  | 'alert'
  | 'info';

/** Inline stroke icons (24×24). Decorative by default; pass `label` to expose to assistive tech. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon' },
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="stroke()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.role]="label() ? 'img' : null"
      [attr.aria-label]="label() || null"
      focusable="false"
    >
      @switch (name()) {
        @case ('arrow-right') { <path d="M5 12h14" /><path d="m13 6 6 6-6 6" /> }
        @case ('arrow-left') { <path d="M19 12H5" /><path d="m11 18-6-6 6-6" /> }
        @case ('arrow-up-right') { <path d="M7 17 17 7" /><path d="M8 7h9v9" /> }
        @case ('arrow-up') { <path d="M12 19V5" /><path d="m6 11 6-6 6 6" /> }
        @case ('download') { <path d="M12 4v12" /><path d="m6 10 6 6 6-6" /><path d="M4 20h16" /> }
        @case ('sun') {
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        }
        @case ('moon') { <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" /> }
        @case ('monitor') { <rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /> }
        @case ('check') { <path d="m5 12 5 5 9-10" /> }
        @case ('menu') { <path d="M4 7h16M4 12h16M4 17h16" /> }
        @case ('close') { <path d="M6 6l12 12M18 6 6 18" /> }
        @case ('chevron-down') { <path d="m6 9 6 6 6-6" /> }
        @case ('terminal') { <path d="m4 17 6-6-6-6" /><path d="M12 19h8" /> }
        @case ('scan-face') {
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
          <circle cx="12" cy="10" r="3" /><path d="M7.5 17a5 5 0 0 1 9 0" />
        }
        @case ('code') { <path d="m8 7-5 5 5 5M16 7l5 5-5 5" /> }
        @case ('braces') { <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" /> }
        @case ('cloud') { <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.5 12 3.5 3.5 0 0 0 6 19z" /> }
        @case ('pen') { <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /> }
        @case ('alert') { <path d="M12 8v5" /><path d="M12 16.5h.01" /><circle cx="12" cy="12" r="9" /> }
        @case ('info') { <circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.5h.01" /> }
      }
    </svg>
  `,
  styles: `
    :host { display: inline-flex; flex: none; line-height: 0; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(18);
  readonly stroke = input(1.8);
  readonly label = input<string>('');
}
