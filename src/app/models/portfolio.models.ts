export interface ISkillIcon {
  iconSrc: string;
  title: string;
}

export interface IAbout {
  About?: string;
  Quotes?: string[];
  Projects?: number | string;
  Experience?: number | string;
}

export interface ISkillItem {
  Title: string;
  Percentage: string;
  SkillType: 'Languages' | 'Other Skill';
}

export interface IEducationItem {
  Title: string;
  Board: string;
  School?: string;
  Quote?: string;
}

export interface IExperienceItem {
  Company: string;
  Designation: string;
  Year: string;
  Info: string;
  Link?: string;
}

export interface ICertification {
  Title: string;
  ConductedBy: string;
  Date: string;
}

export interface ISocialIcon {
  name: string;
  link: string;
  icon: string;
}

export interface IProject {
  fields: {
    projectId: string;
    projectType: string;
    description: string;
    image?: { fields: { file: { url: string } } };
  };
}

// ── Contentful Skills JSON field structure ────────────────
// Stored in the `skills` field (type: Object) on the Resume Details content type.
//
// Contentful JSON structure expected:
// {
//   "skillCategories": [ { label, icon, skills: [{ title, pct, color }] } ],
//   "tools": [
//     { name, color, category, imageSrc, icon? }
//   ]
// }
// The `imageSrc` is a Contentful asset URL string (e.g. "//images.ctfassets.net/...")
// uploaded as an Asset and its URL copied into the JSON.

export interface ISkillCategory {
  label: string;
  icon: string; // bootstrap icon class e.g. "bi-layout-text-window"
  skills: ISkillBarItem[];
}

export interface ISkillBarItem {
  title: string;
  pct: number;
  color: string;
}

export interface IToolItem {
  name: string;
  color: string;
  category: string;
  imageSrc: string; // Contentful asset URL (relative or absolute)
  icon?: string; // optional fallback Contentful CDN URL
}

export interface ISkillsData {
  skillCategories: ISkillCategory[];
  tools: IToolItem[];
}
