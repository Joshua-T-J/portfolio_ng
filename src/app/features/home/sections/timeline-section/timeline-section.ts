import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentStore } from '../../../../core/content/content.store';
import { SectionHeader } from '../../../../shared/ui/section-header/section-header';
import { balanceTracks } from './balance-tracks';
import { TimelineTrack } from './timeline-track/timeline-track';

/**
 * 03 · Experience as separate timelines in two balanced columns (see balanceTracks).
 * Stacks into one column on narrow screens, with jump links to each timeline.
 */
@Component({
  selector: 'app-timeline-section',
  imports: [SectionHeader, TimelineTrack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-section.html',
  styleUrl: './timeline-section.scss',
})
export class TimelineSection {
  protected readonly all = inject(ContentStore).timelineTracks;
  protected readonly columns = balanceTracks(this.all);
}
