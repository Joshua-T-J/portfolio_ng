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
