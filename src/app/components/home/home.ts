import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ISkillIcon, IAbout } from '../../models/portfolio.models';
import { Contentful } from '../../services/contentful';
import { MatTooltip } from '@angular/material/tooltip';
import { SocialMediaIcons } from '../../shared/components/social-media-icons/social-media-icons';
import { NgClass, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatTooltip, SocialMediaIcons, SlicePipe, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  txt = signal('');
  fullTxt = signal('');
  isDeleting = false;
  loopNum = 0;
  period = 2000;
  private typerId: ReturnType<typeof setTimeout> | null = null;

  // Skills
  skillsIcons: ISkillIcon[] = [
    { iconSrc: 'SVGs/angular.svg', title: 'Angular' },
    { iconSrc: 'SVGs/javascript.svg', title: 'JavaScript' },
    { iconSrc: 'SVGs/html.svg', title: 'HTML5' },
    { iconSrc: 'SVGs/css.svg', title: 'CSS3' },
    { iconSrc: 'SVGs/csharp.svg', title: 'C#' },
    { iconSrc: 'SVGs/typescript.svg', title: 'TypeScript' },
    { iconSrc: 'SVGs/react.svg', title: 'React' },
  ];

  showMore = false;
  About = signal<IAbout | undefined>(undefined);
  AboutText = computed<string>(
    () =>
      this.About()?.About ??
      'Self-motivated, highly passionate and hardworking full-stack developer looking for opportunities to work in a challenging organization. Eager to learn new technologies and methodologies.',
  );
  // Typewriter
  toRotate = computed(
    () =>
      this.About()?.Quotes ?? [
        'A Full-Stack Developer.',
        'And a Photographer.',
        'I Adore Exploring New Things.',
      ],
  );
  Experience = computed<string | number>(() => this.About()?.Experience ?? 3);
  Projects = computed<string | number>(() => this.About()?.Projects ?? 10);

  constructor(private contentfulService: Contentful) {}

  ngOnInit(): void {
    this.contentfulService.getResume().subscribe({
      next: (res) => {
        this.About.set(
          res.find((item: any) => item.fields.type === 'About')?.fields?.[
            'resumeDetails'
          ] as IAbout,
        );
        this.tick();
      },
      error: () => this.tick(), // still start typewriter even if CMS fails
    });
  }

  ngOnDestroy(): void {
    if (this.typerId) clearTimeout(this.typerId);
  }

  tick(): void {
    const i = this.loopNum % this.toRotate().length;
    this.fullTxt.set(this.toRotate()[i]);

    if (this.isDeleting) {
      this.txt.set(this.fullTxt().substring(0, this.txt().length - 1));
    } else {
      this.txt.set(this.fullTxt().substring(0, this.txt().length + 1));
    }

    let delta = 160 - Math.random() * 80;
    if (this.isDeleting) delta /= 2;

    if (!this.isDeleting && this.txt() === this.fullTxt()) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt() === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    this.typerId = setTimeout(() => this.tick(), delta);
  }

  toggleMore(): void {
    this.showMore = !this.showMore;
  }

  scrollToContact(): void {
    document.getElementById('contact_form')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToResume(): void {
    document.getElementById('resume')?.scrollIntoView({ behavior: 'smooth' });
  }
}
