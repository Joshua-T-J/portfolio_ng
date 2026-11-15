import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../../core/contact/contact.service';
import { ContentStore } from '../../../../core/content/content.store';
import { ToastService } from '../../../../core/toast/toast.service';
import { Icon } from '../../../../shared/ui/icon/icon';

type FormStatus = 'idle' | 'sending';

@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
})
export class ContactSection {
  private readonly contact = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  protected readonly s = inject(ContentStore).settings;
  protected readonly canSubmit = this.contact.isConfigured;
  protected readonly status = signal<FormStatus>('idle');

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    subject: ['', [Validators.maxLength(120)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    /** Honeypot: hidden from people, bots fill it in. */
    website: [''],
  });

  protected invalid(name: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  protected get mailtoHref(): string {
    return `mailto:${this.s.email}?subject=${encodeURIComponent('Hello Joshua')}`;
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.status() === 'sending') return;

    const { website, ...msg } = this.form.getRawValue();
    if (website) {
      // Honeypot filled: almost certainly a bot. Pretend success and send nothing.
      this.form.reset();
      return;
    }

    this.status.set('sending');
    this.contact
      .send(msg)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.status.set('idle');
          this.form.reset();
          const firstName = msg.name.trim().split(/\s+/)[0];
          this.toast.success('Message sent', {
            message: `Thanks${firstName ? `, ${firstName}` : ''}! I'll get back to you within a day.`,
          });
        },
        // One generic message for every failure (network, timeout, endpoint error): the cause
        // doesn't help the visitor, a way to still reach me does. The form keeps their text.
        error: () => {
          this.status.set('idle');
          this.toast.error("Couldn't send your message", {
            message: 'Something went wrong on our side. Please try again in a minute, or e-mail me directly.',
            action: { label: `E-mail ${this.s.email}`, href: this.mailtoHref },
          });
        },
      });
  }
}
