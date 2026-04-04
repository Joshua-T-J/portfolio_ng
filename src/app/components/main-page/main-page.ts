import { Component, OnInit, DestroyRef } from '@angular/core';
import { Contact } from '../contact/contact';
import { Projects } from '../projects/projects';
import { Features } from '../features/features';
import { Home } from '../home/home';
import { LoadingCard } from '../../shared/components/loading-card/loading-card';
import { Resume } from '../resume/resume';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-page',
  imports: [Contact, Projects, Features, Home, LoadingCard, Resume],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.route.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}
