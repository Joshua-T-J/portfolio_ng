import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Alert, AlertTypes } from '../../shared/components/alert/alert';
import { Common } from '../../services/common';
import { SocialMediaIcons } from '../../shared/components/social-media-icons/social-media-icons';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, SocialMediaIcons],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  submitted = signal(false);

  private readonly phoneRegex = /^\d{6,12}$/;
  private readonly emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}$/;

  constructor(
    private fb: FormBuilder,
    private commonService: Common,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      Name: ['', [Validators.required]],
      Phone: ['', [Validators.pattern(this.phoneRegex)]],
      Email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      Subject: ['', [Validators.required]],
      Message: [''],
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.contactForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid || this.submitted()) return;

    this.submitted.set(true);
    this.contactForm.disable();

    const fd = new FormData();
    Object.entries(this.contactForm.getRawValue()).forEach(([k, v]) => fd.append(k, v as string));

    this.commonService.submitForm(fd).subscribe({
      next: (res: any) => {
        this.submitted.set(false);
        this.contactForm.enable();
        if (res.result === 'success') {
          this.contactForm.reset();
          this.openSnack("Thanks for the message! I'll get back to you soon.", AlertTypes.SUCCESS);
        } else {
          this.openSnack('Oops! Something went wrong. Try again later.', AlertTypes.ERROR);
        }
      },
      error: () => {
        this.submitted.set(false);
        this.contactForm.enable();
        this.openSnack('Oops! An error occurred. Try again later.', AlertTypes.ERROR);
      },
    });
  }

  private openSnack(message: string, type: AlertTypes): void {
    this.snackBar.openFromComponent(Alert, {
      data: { Type: type, Message: message },
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
