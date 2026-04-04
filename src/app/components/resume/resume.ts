import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core';
import { ISkillItem } from '../../models/portfolio.models';
import { Contentful } from '../../services/contentful';
import { TitleCasePipe } from '@angular/common';

type TabTypes = 'experience' | 'education' | 'skills' | 'more';

@Component({
  selector: 'app-resume',
  imports: [TitleCasePipe],
  templateUrl: './resume.html',
  styleUrl: './resume.scss',
})
export class Resume implements OnInit, AfterViewInit {
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

  isExpanded: Record<string, boolean> = {};
  readonly contentLimit = 25;

  constructor(private contentfulService: Contentful) {}

  ngOnInit(): void {
    this.contentfulService.getResume().subscribe({
      next: (res) => {
        this.resume.set(res);
        // this.filterByType();
      },
    });
  }

  ngAfterViewInit(): void {}

  // filterByType(): void {
  //   this.skills = this.resume.find((i) => i.fields.type === 'Skills');
  //   this.education = this.resume.find((i) => i.fields.type === 'Education');
  //   this.certifications = this.resume.find((i) => i.fields.type === 'Certifications');
  //   this.experience = this.resume.find((i) => i.fields.type === 'Experience');
  // // }

  switchTab(tab: TabTypes): void {
    this.activeTab.set(tab);
  }

  // filterSkills(): void {
  //   this.languages =
  //     this.skills?.fields?.resumeDetails?.filter((i: ISkillItem) => i.SkillType === 'Languages') ??
  //     [];
  //   this.otherSkills =
  //     this.skills?.fields?.resumeDetails?.filter(
  //       (i: ISkillItem) => i.SkillType === 'Other Skill',
  //     ) ?? [];
  // }

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
}
