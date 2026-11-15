import { TimelineItem, TimelineKind, TimelineTrack } from '../../../../core/content/portfolio.models';
import { balanceTracks } from './balance-tracks';

const track = (kind: TimelineKind, n: number): TimelineTrack => ({
  kind,
  title: kind,
  shortTitle: kind,
  countLabel: '',
  items: Array.from({ length: n }, (_, i) => ({ kind, title: `${kind}${i}`, period: '', org: '', highlights: [], techStack: [], current: false }) as TimelineItem),
});
const kinds = (ts: readonly TimelineTrack[]) => ts.map((t) => t.kind);

describe('balanceTracks', () => {
  it('puts Education under Work when Work is the shorter side (1 job vs 4 certificates)', () => {
    const cols = balanceTracks([track('work', 1), track('education', 1), track('certification', 4)]);
    expect(kinds(cols.left)).toEqual(['work', 'education']);
    expect(kinds(cols.right)).toEqual(['certification']);
  });

  it('moves Education above Certifications when Work is long (5 jobs)', () => {
    const cols = balanceTracks([track('work', 5), track('education', 2), track('certification', 3)]);
    expect(kinds(cols.left)).toEqual(['work']);
    expect(kinds(cols.right)).toEqual(['education', 'certification']);
  });

  it('collapses to one column when there is only one side', () => {
    const onlyWork = balanceTracks([track('work', 2)]);
    expect(kinds(onlyWork.left)).toEqual(['work']);
    expect(onlyWork.right).toEqual([]);
    const noWork = balanceTracks([track('certification', 2)]);
    expect(kinds(noWork.left)).toEqual(['certification']);
    expect(noWork.right).toEqual([]);
  });

  it('keeps Education and Certifications side by side when there is no Work', () => {
    const cols = balanceTracks([track('education', 1), track('certification', 4)]);
    expect(kinds(cols.left)).toEqual(['education']);
    expect(kinds(cols.right)).toEqual(['certification']);
  });
});
