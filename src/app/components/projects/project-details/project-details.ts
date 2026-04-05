import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { catchError, switchMap } from 'rxjs';
import { Contentful } from '../../../services/contentful';
import { Common } from '../../../services/common';
import { NgOptimizedImage } from '@angular/common';
import { ProjectLoading } from '../../../shared/components/project-loading/project-loading';

@Component({
  selector: 'app-project-details',
  imports: [NgOptimizedImage, ProjectLoading, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails implements OnInit, AfterViewInit {
  readonly placeholderImage = 'assets/Images/Placeholder Image.png';
  // projectDetails: any[] | undefined;
  projectDetails = signal<any[] | undefined>(undefined);

  constructor(
    private contentfulService: Contentful,
    private route: ActivatedRoute,
    private router: Router,
    public commonService: Common,
  ) {}

  ngOnInit(): void {
    this.commonService.setLoading(true);
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) =>
          this.contentfulService.getProjectDetails(params.get('id') as string),
        ),
        catchError(() => {
          this.commonService.setLoading(false);
          this.router.navigate(['not-found']);
          return [];
        }),
      )
      .subscribe({
        next: (entries) => {
          this.projectDetails.set(entries);
          this.commonService.setLoading(false);
        },
        error: () => this.commonService.setLoading(false),
      });
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
