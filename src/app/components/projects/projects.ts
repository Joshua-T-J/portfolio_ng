import { Component, OnInit, signal } from '@angular/core';
import { Contentful } from '../../services/contentful';
import { Common } from '../../services/common';
import { NgClass, NgOptimizedImage, SlicePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { LoadingCard } from '../../shared/components/loading-card/loading-card';

@Component({
  selector: 'app-projects',
  imports: [RouterLink, NgClass, SlicePipe, NgOptimizedImage, MatTooltipModule, LoadingCard],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects implements OnInit {
  projects: any[] = [];
  showMore = signal(false);

  constructor(
    private contentfulService: Contentful,
    public commonService: Common,
  ) {}

  ngOnInit(): void {
    this.commonService.setLoading(true);
    this.contentfulService.getProjectTypes().subscribe({
      next: (res) => (this.projects = res),
      error: () => this.commonService.setLoading(false),
      complete: () => this.commonService.setLoading(false),
    });
  }

  toggleMore(): void {
    this.showMore.set(!this.showMore());
  }
}
