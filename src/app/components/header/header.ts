import { NgClass } from '@angular/common';
import { Component, DOCUMENT, HostListener, inject, Inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CanvasAnimation } from '../../services/canvas-animation';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  imports: [RouterModule, NgClass, ReactiveFormsModule, MatTooltipModule],
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
  themeSwitch = new FormControl(true);

  private readonly canvasService = inject(CanvasAnimation);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const theme = saved ?? 'dark';
    this.document.documentElement.setAttribute('data-theme', theme);
    this.themeSwitch.setValue(theme === 'dark');
  }

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

  toggleTheme(): void {
    const isDark = this.themeSwitch.value;
    const theme = isDark ? 'dark' : 'light';
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.canvasService.setMode(theme);
  }
}
