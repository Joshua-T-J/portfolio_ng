import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core';
import { ISkillItem } from '../../models/portfolio.models';
import { Contentful } from '../../services/contentful';
import { NgOptimizedImage, TitleCasePipe } from '@angular/common';

type TabTypes = 'experience' | 'education' | 'skills' | 'more';
export interface IToolItem {
  name: string;
  color: string; // accent hex for the icon
  category: string;
  imageSrc: string; // Optional image source for the icon
}

export interface ISkillCategory {
  label: string;
  icon: string;
  skills: { title: string; pct: number; color: string }[];
}

@Component({
  selector: 'app-resume',
  imports: [TitleCasePipe, NgOptimizedImage],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume implements OnInit {
  activeTab = signal<TabTypes>('experience');
  resumeTabs = ['experience', 'education', 'skills', 'more'] as TabTypes[];

  resume = signal<any[]>([]);
  skills = computed(() =>
    this.activeTab() === 'skills'
      ? this.resume().find((i) => i.fields.type === 'Skills')?.fields?.resumeDetails
      : [],
  );
  education = computed(() =>
    this.activeTab() === 'education'
      ? this.resume().find((i) => i.fields.type === 'Education')?.fields?.resumeDetails
      : [],
  );
  certifications = computed(() =>
    this.activeTab() === 'more'
      ? this.resume().find((i) => i.fields.type === 'Certifications')?.fields?.resumeDetails
      : [],
  );
  experience = computed(() =>
    this.activeTab() === 'experience'
      ? this.resume().find((i) => i.fields.type === 'Experience')?.fields?.resumeDetails
      : [],
  );
  pdfDetails = computed(() => {
    const pdfEl = this.resume().find((el) => el.fields?.resumePdf);
    return pdfEl ? pdfEl.fields.resumePdf : null;
  });
  pdfUrl = computed(() => this.pdfDetails()?.fields?.file?.url ?? '#');

  languages = computed(() => {
    if (this.activeTab() === 'skills') {
      return this.skills()?.filter((i: ISkillItem) => i.SkillType === 'Languages') ?? [];
    }
    return [];
  });
  otherSkills = computed(() => {
    if (this.activeTab() === 'skills') {
      return this.skills()?.filter((i: ISkillItem) => i.SkillType === 'Other Skill') ?? [];
    }
    return [];
  });

  skillAndSoftwares = computed(() =>
    this.activeTab() === 'skills'
      ? this.resume().find((i) => i.fields.type === 'Skills')?.fields?.skills
      : [],
  );

  // ── Software tools ────────────────────────────────────────
  tools = computed<IToolItem[]>(() => this.skillAndSoftwares()?.tools ?? []);

  // ── Skill categories  ──
  skillCategories = computed<ISkillCategory[]>(
    () => this.skillAndSoftwares()?.skillCategories ?? [],
  );

  activeSkillCat = 0;
  barsAnimated = signal(false);
  isExpanded: Record<string, boolean> = {};
  readonly contentLimit = 25;

  constructor(private contentfulService: Contentful) {}

  ngOnInit(): void {
    this.contentfulService.getResume().subscribe({
      next: (res) => {
        this.resume.set(res);
      },
    });
  }

  switchTab(tab: TabTypes): void {
    this.activeTab.set(tab);
  }

  getTruncatedInfo(info: string, company: string): string {
    const words = info.split(' ');
    if (words.length <= this.contentLimit || this.isExpanded[company]) return info;
    return words.slice(0, this.contentLimit).join(' ') + '…';
  }

  needsReadMore(info: string): boolean {
    return info.split(' ').length > this.contentLimit;
  }

  toggleExpand(company: string): void {
    this.isExpanded[company] = !this.isExpanded[company];
  }

  selectSkillCat(idx: number): void {
    this.activeSkillCat = idx;
    this.barsAnimated.set(false);
    setTimeout(() => this.barsAnimated.set(true), 60);
  }
  get activeCatSkills() {
    return this.skillCategories()[this.activeSkillCat]?.skills ?? [];
  }
}
