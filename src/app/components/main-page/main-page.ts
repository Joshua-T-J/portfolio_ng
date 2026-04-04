import { Component } from '@angular/core';
import { Contact } from '../contact/contact';
import { Projects } from '../projects/projects';
import { Features } from '../features/features';
import { Home } from '../home/home';
import { LoadingCard } from '../../shared/components/loading-card/loading-card';
import { Resume } from '../resume/resume';

@Component({
  selector: 'app-main-page',
  imports: [Contact, Projects, Features, Home, LoadingCard, Resume],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
