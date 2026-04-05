import { Component, computed, OnInit, signal } from '@angular/core';
import { ISkillItem } from '../../models/portfolio.models';
import { Contentful } from '../../services/contentful';
import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { AssetFile } from 'contentful';

type TabTypes = 'experience' | 'education' | 'skills' | 'more';
export interface IToolItem {
  name: string;
  color: string; // accent hex for the icon
  category: string;
  iconUrl?: string;
  imageSrc?: string; // Optional image source for the icon
  iconId?: string; // Optional Contentful asset ID for the icon
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
  tools = signal<IToolItem[]>([]);

  // ── Skill categories  ──
  skillCategories = computed<ISkillCategory[]>(
    () => this.skillAndSoftwares()?.skillCategories ?? [],
  );

  activeSkillCat = 0;
  barsAnimated = signal(false);
  isExpanded: Record<string, boolean> = {};
  readonly contentLimit = 25;
  private toolIconsLoaded = false;

  constructor(private contentfulService: Contentful) {}

  ngOnInit(): void {
    this.loadResumeDetails();
  }

  loadResumeDetails(): void {
    this.contentfulService.getResume().subscribe({
      next: (res) => {
        this.resume.set(res);
      },
    });
  }

  private loadToolIcons(): void {
    if (this.toolIconsLoaded) return; // Already loaded, don't repeat

    const skillsEntry = this.resume().find((i) => i.fields.type === 'Skills');
    const toolsData = skillsEntry?.fields?.skills?.tools ?? [];

    // Update the tools signal
    this.tools.set([...toolsData]);

    toolsData.forEach((tool: IToolItem) => {
      if (tool.iconId) {
        this.contentfulService.getSkillsIcon(tool.iconId).subscribe({
          next: (asset) => {
            if (asset?.fields?.file?.url) {
              tool.iconUrl = asset.fields.file.url as AssetFile['url'];
              // Trigger signal update
              this.tools.set([...this.tools()]);
            }
          },
        });
      } else if (tool.imageSrc) {
        tool.iconUrl = tool.imageSrc;
      }
    });

    this.toolIconsLoaded = true;
  }

  getToolIconSrc(tool: IToolItem): string {
    return tool.iconUrl ?? '';
  }

  switchTab(tab: TabTypes): void {
    this.activeTab.set(tab);
    if (tab === 'skills') {
      this.loadToolIcons();
    }
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
