export interface ContactInfo {
  github: string;
  linkedin: string;
  email: string;
  blog: string;
}

export interface LiveInfo {
  title: string;
  camperId: string;
  viewers: number;
  field: Field;
  profileImage: string;
  contacts: ContactInfo;
}

export type Field = 'WEB' | 'AND' | 'IOS' | '';
