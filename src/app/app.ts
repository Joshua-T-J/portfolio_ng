import {
  AfterViewInit,
  Component,
  DOCUMENT,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CanvasAnimation } from './services/canvas-animation';
import { NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, MatTooltipModule, ReactiveFormsModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('Joshua T J | Software Engineer | Portfolio - Home');
  sideBarOpen = false;
  themeSwitch = new FormControl(true);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private canvasService: CanvasAnimation,
    private titleService: Title,
  ) {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const theme = saved ?? 'dark';
    this.document.documentElement.setAttribute('data-theme', theme);
    this.themeSwitch.setValue(theme === 'dark');
    this.titleService.setTitle(this.title());
  }

  ngAfterViewInit(): void {
    const theme = (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark';
    this.canvasService.initialize('bg-canvas', theme);
  }

  ngOnDestroy(): void {
    this.canvasService.destroy();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const winScroll = this.document.body.scrollTop || this.document.documentElement.scrollTop;
    const height =
      this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

    const btn = this.document.getElementById('goto-top');
    if (btn) {
      btn.style.setProperty('--scroll', `${scrolled}%`);
      btn.style.display = winScroll > 400 ? 'grid' : 'none';
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleTheme(): void {
    const isDark = this.themeSwitch.value;
    const theme = isDark ? 'dark' : 'light';
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.canvasService.setMode(theme);
  }

  toggleSideBar(): void {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
