import { NgClass } from '@angular/common';
import { Component, DOCUMENT, HostListener, Inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule, NgClass],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  scrolled = signal(false);
  mobileMenuOpen = signal(false);

  readonly navLinks = [
    { label: 'Home', fragment: 'home' },
    { label: 'Features', fragment: 'features' },
    { label: 'Projects', fragment: 'projects' },
    { label: 'Resume', fragment: 'resume' },
    { label: 'Contact', fragment: 'contact_form' },
    { label: 'Follow', fragment: 'footer' },
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  @HostListener('window:resize', [])
  onResize(): void {
    // Close mobile menu if window is resized back to desktop size
    if (window.innerWidth > 900 && this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
    }
  }

  toggleMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  scrollToFragment(fragment: string): void {
    this.closeMenu();
    const el = this.document.getElementById(fragment);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
