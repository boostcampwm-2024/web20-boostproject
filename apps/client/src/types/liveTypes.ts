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
  field: 'WEB' | 'AND' | 'IOS';
  profileImage: string;
  contacts: ContactInfo;
}
