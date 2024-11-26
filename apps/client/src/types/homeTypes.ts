export interface LivePreviewInfo {
  broadcastId: string;
  broadcastTitle: string;
  camperId: string;
  profileImage: string;
  thumbnail: string;
  field: 'WEB' | 'AND' | 'IOS';
}

export interface LivePreviewListInfo {
  broadcasts: LivePreviewInfo[];
  nextCursor: string | null;
}
