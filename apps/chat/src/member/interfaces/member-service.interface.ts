import { IMember } from './member.interface';

export interface IMemberService {
  getMemberInfo(token: string): Promise<IMember>;
}
