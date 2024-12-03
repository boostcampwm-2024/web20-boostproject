import { Field } from './liveTypes';

export interface LivePreviewInfo {
  broadcastId: string;
  broadcastTitle: string;
  camperId: string;
  profileImage: string;
  thumbnail: string;
  field: Field;
}

export interface LivePreviewListInfo {
  broadcasts: LivePreviewInfo[];
  nextCursor: string | null;
}
