import { Component } from '@angular/core';
interface IFeature {
  icon: string;
  title: string;
  description: string;
}
@Component({
  selector: 'app-features',
  imports: [],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {
  features: IFeature[] = [
    {
      icon: 'bi-code-slash',
      title: 'Web Development',
      description:
        'There are three responses to a piece of design — yes, no, and WOW! Wow is the one to aim for. I build fast, accessible, scalable full-stack applications.',
    },
    {
      icon: 'bi-camera',
      title: 'Photography',
      description:
        'The photo that you took with your camera is the imagination you want to create with reality. I capture moments that tell compelling stories.',
    },
    {
      icon: 'bi-sliders2',
      title: 'Editing',
      description:
        "The world always seems brighter when you've just made something that wasn't there before. I craft visuals that leave a lasting impression.",
    },
  ];
}
