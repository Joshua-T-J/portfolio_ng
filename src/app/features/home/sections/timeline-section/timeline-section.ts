import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../../core/content/content.store';
import { TimelineItem } from '../../../../core/content/portfolio.models';
import { SectionHeader } from '../../../../shared/ui/section-header/section-header';

/** Entries shown before the rest fold into "Show earlier". */
export const VISIBLE_TIMELINE = 4;

@Component({
  selector: 'app-timeline-section',
  imports: [SectionHeader, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-section.html',
  styleUrl: './timeline-section.scss',
})
export class TimelineSection {
  private readonly items = inject(ContentStore).timeline;
  protected readonly visible: readonly TimelineItem[] = this.items.slice(0, VISIBLE_TIMELINE);
  protected readonly earlier: readonly TimelineItem[] = this.items.slice(VISIBLE_TIMELINE);
}
