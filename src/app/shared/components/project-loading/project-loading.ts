import { Component, input } from '@angular/core';
import { Common } from '../../../services/common';

@Component({
  selector: 'app-project-loading',
  imports: [],
  templateUrl: './project-loading.html',
  styleUrl: './project-loading.scss',
})
export class ProjectLoading {
  show = input(false);

  constructor(public commonService: Common) {}
}
