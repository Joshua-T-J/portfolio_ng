import { TimelineKind, TimelineTrack } from '../../../../core/content/portfolio.models';
import { VISIBLE_PER_TRACK } from './timeline-track/timeline-track';

export interface TrackColumns {
  readonly left: readonly TimelineTrack[];
  readonly right: readonly TimelineTrack[];
}

/**
 * Rough rendered height of one entry, relative to a certificate (= 1).
 * Jobs carry a summary and tech chips; qualifications a detail line and a grade.
 */
const ENTRY_WEIGHT: Record<TimelineKind, number> = { work: 3, education: 1.6, certification: 1 };
/** The card header and padding, in the same units. */
const CARD_WEIGHT = 1;

/** Estimated height of a track as first shown (folded after VISIBLE_PER_TRACK entries). */
export function trackWeight(track: TimelineTrack): number {
  const shown = Math.min(track.items.length, VISIBLE_PER_TRACK);
  const foldButton = track.items.length > VISIBLE_PER_TRACK ? 0.5 : 0;
  return CARD_WEIGHT + shown * ENTRY_WEIGHT[track.kind] + foldButton;
}

/**
 * Splits the Experience tracks into two columns of similar height:
 * Work always leads the left column, Certifications sit on the right, and Education joins
 * whichever column is shorter. A column left empty means the section renders as one column.
 */
export function balanceTracks(tracks: readonly TimelineTrack[]): TrackColumns {
  const find = (kind: TimelineKind) => tracks.find((t) => t.kind === kind);
  const work = find('work');
  const education = find('education');
  const certs = find('certification');

  const left: TimelineTrack[] = work ? [work] : [];
  const right: TimelineTrack[] = certs ? [certs] : [];

  if (education) {
    const leftWeight = left.reduce((sum, t) => sum + trackWeight(t), 0);
    const rightWeight = right.reduce((sum, t) => sum + trackWeight(t), 0);
    if (leftWeight <= rightWeight) left.push(education);
    else right.unshift(education);
  }

  // Never leave the left column empty while the right has content.
  if (!left.length && right.length) return { left: right, right: [] };
  return { left, right };
}
