export interface VisualConfig {
  grainFps: number;
  grainIntensity: number;
  desktopDprCap: number;
  mobileDprCap: number;
  targetFrameMs: number;
  heroGlbUrl: string | null;
  heroCutoutImageUrl: string | null;
}

export const VISUAL_CONFIG: VisualConfig = {
  grainFps: 24,
  grainIntensity: 0.2,
  desktopDprCap: 1.5,
  mobileDprCap: 1,
  targetFrameMs: 20,
  heroGlbUrl: null,
  heroCutoutImageUrl: null,
};
