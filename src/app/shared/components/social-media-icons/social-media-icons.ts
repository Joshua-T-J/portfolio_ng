import { Component } from '@angular/core';
import { ISocialIcon } from '../../../models/portfolio.models';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-social-media-icons',
  imports: [MatTooltip, NgClass],
  templateUrl: './social-media-icons.html',
  styleUrl: './social-media-icons.scss',
})
export class SocialMediaIcons {
  socialIcons: ISocialIcon[] = [
    {
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/in/joshua-t-j-68121b22a/',
      icon: 'bi-linkedin',
    },
    { name: 'GitHub', link: 'https://github.com/Joshua-T-J', icon: 'bi-github' },
    { name: 'Instagram', link: 'https://www.instagram.com/joshua.t_j/', icon: 'bi-instagram' },
  ];
}
