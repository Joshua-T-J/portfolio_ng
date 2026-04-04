import { Injectable, NgZone } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class CanvasAnimation {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private mode: 'dark' | 'light' = 'dark';
  private particles: Particle[] = [];
  private animId: number | null = null;
  private resizeListener: (() => void) | null = null;

  private readonly COLORS = {
    dark: { bg: '#080b10', p1: '#ff014f', p2: '#ff6b35', p3: '#c084fc', dim: 0.15 },
    light: { bg: '#f4f5f7', p1: '#ff014f', p2: '#ff6b35', p3: '#8b5cf6', dim: 0.1 },
  };

  constructor(private ngZone: NgZone) {}

  initialize(canvasId: string, initialMode: 'dark' | 'light' = 'dark'): void {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = initialMode;
    this.resize();
    this.initParticles();
    this.ngZone.runOutsideAngular(() => this.loop());
    this.resizeListener = () => this.handleResize();
    window.addEventListener('resize', this.resizeListener);
  }

  private handleResize(): void {
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.resize();
    this.initParticles();
    this.ngZone.runOutsideAngular(() => this.loop());
  }

  private resize(): void {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  private makeParticle(w: number, h: number): Particle {
    const c = this.COLORS[this.mode];
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.55 + 0.2,
      color: [c.p1, c.p2, c.p3][Math.floor(Math.random() * 3)],
    };
  }

  private initParticles(): void {
    if (!this.canvas) return;
    this.particles = Array.from({ length: 90 }, () =>
      this.makeParticle(this.canvas!.width, this.canvas!.height),
    );
  }

  private drawConnections(): void {
    if (!this.ctx || !this.canvas) return;
    const c = this.COLORS[this.mode];
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const a = (1 - dist / 120) * c.dim;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(${this.hexToRgb(c.p1)},${a})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  private loop(): void {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);
    this.drawConnections();
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      this.ctx!.beginPath();
      this.ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx!.fillStyle = `rgba(${this.hexToRgb(p.color)},${p.alpha})`;
      this.ctx!.fill();
    });
    this.animId = requestAnimationFrame(() => this.loop());
  }

  setMode(mode: 'dark' | 'light'): void {
    this.mode = mode;
    const c = this.COLORS[mode];
    this.particles.forEach((p) => {
      p.color = [c.p1, c.p2, c.p3][Math.floor(Math.random() * 3)];
    });
  }

  destroy(): void {
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
  }
}
