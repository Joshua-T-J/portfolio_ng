import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TimelineKind, TimelineTrack as Track } from '../../../../../core/content/portfolio.models';
import { Icon, IconName } from '../../../../../shared/ui/icon/icon';
import { TechChips } from '../../../../../shared/ui/tech-chips/tech-chips';

/** Entries shown before the rest fold behind a "Show …" button. */
export const VISIBLE_PER_TRACK = 4;

const LOOK: Record<TimelineKind, { icon: IconName; more: (n: number) => string }> = {
  work: { icon: 'briefcase', more: (n) => `Show ${n} earlier ${n === 1 ? 'role' : 'roles'}` },
  education: { icon: 'graduation', more: (n) => `Show ${n} more` },
  certification: { icon: 'award', more: (n) => `Show ${n} more` },
};

/** One timeline (Work, Education or Certifications) with its own colour, icon and rail. */
@Component({
  selector: 'app-timeline-track',
  imports: [Icon, TechChips],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-track.html',
  styleUrl: './timeline-track.scss',
  host: {
    class: 'track',
    '[class.track--work]': 'track().kind === "work"',
    '[class.track--education]': 'track().kind === "education"',
    '[class.track--certification]': 'track().kind === "certification"',
  },
})
export class TimelineTrack {
  readonly track = input.required<Track>();

  protected readonly expanded = signal(false);
  protected readonly look = computed(() => LOOK[this.track().kind]);
  protected readonly headingId = computed(() => `track-${this.track().kind}`);
  protected readonly listId = computed(() => `track-${this.track().kind}-list`);
  protected readonly hiddenCount = computed(() => Math.max(0, this.track().items.length - VISIBLE_PER_TRACK));
  protected readonly visible = computed(() =>
    this.expanded() ? this.track().items : this.track().items.slice(0, VISIBLE_PER_TRACK),
  );
}
