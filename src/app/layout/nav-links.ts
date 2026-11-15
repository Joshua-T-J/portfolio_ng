export interface NavLink {
  readonly label: string;
  /** Fragment on the home page. */
  readonly fragment: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Work', fragment: 'work' },
  { label: 'Projects', fragment: 'projects' },
  { label: 'Experience', fragment: 'experience' },
  { label: 'Stack', fragment: 'stack' },
  { label: 'Contact', fragment: 'contact' },
];
