export const ENCODING_OPTIONS = [
  { maxBitrate: 750000, scaleResolutionDownBy: 2, maxFramerate: 30 },
  { maxBitrate: 1500000, scaleResolutionDownBy: 1.5, maxFramerate: 30 },
  { maxBitrate: 4000000, scaleResolutionDownBy: 1, maxFramerate: 30 },
];

export const RESOLUTION_OPTIONS = {
  high: { width: 1920, height: 1080, label: '1080p' },
  medium: { width: 1280, height: 720, label: '720p' },
  low: { width: 854, height: 480, label: '480p' },
};
