import { ITextStyle } from 'pixi.js';
import { Store2D } from '../2d/2dStore';

export const BACK_GROUND_COLOR = '#FFFDF9 ';
export const DEFAULT_WALL_HEIGHT = 330; //cm
export const ZindezViewPort = {
  drawInstructor: 3,
  corner: 2,
  wall: 1,
  grid2d: 0,
};
export const NUMSINFER_RANGE = [20, 50];
export const CREATIVITY_RANGE = [1, 24];
export const CREATIVITY_CONTROLNET_RANGE = [1, 10];
export const cornerDisEpsilon = 3;
export type MeasurementUnits = 'inch' | 'feet' | 'm' | 'cm' | 'mm' | 'dm';

export const EVENT_KEY_PRESSED = 'eventKeyPressed';
export const EVENT_KEY_RELEASED = 'eventKeyReleased';
export const TextSetting: Partial<ITextStyle> = {
  fontFamily: 'Arial',
  fontSize: 12,
  fill: 'black',
  align: 'center',
};
export const BASE_GRID_SIZE = 10000; //in cm

export const BASE_WALL_THICKNESS = 20; //in cm
export const BASE_CORNER_RADIUS = 8; //in cm
export const WallMouseSnap = (BASE_WALL_THICKNESS + 10) / 2; //in cm
export const defaultStore: Store2D = {
  gridScale: 1,
  gridSpacing_snapTolerance: 100,
  gridSize: BASE_GRID_SIZE,
  snapToGrid: true,
  MeasurementUnit: 'cm',
  BaseSnapUnit: 'cm',
};

type ColorKey =
  | 'tempLine'
  | 'cornerNormalCenter'
  | 'cornerNormalInner'
  | 'cornerNormalOuter'
  | 'gridNormalLine'
  | 'gridHighLightLine'
  | 'originCord'
  | 'cornerHover'
  | 'wall'
  | 'outWall'
  | 'outWallHover'
  | 'infoLine'
  | 'cornerDeleteOuter'
  | 'outDeleteHover'
  | 'floorDefault'
  | 'floorHover';

export interface ThemeItem {
  color: number;
  alpha?: number;
}

type Theme = Record<ColorKey, ThemeItem>;

export const Color2D: Theme = {
  gridNormalLine: { color: 0xe0e0e0 },
  gridHighLightLine: { color: 0xd0d0d0 },
  originCord: { color: 0xff0000, alpha: 0.7 },
  cornerNormalOuter: { color: 0xe0e0e },
  cornerHover: { color: 0x4349e6, alpha: 0.7 },
  cornerNormalInner: { color: 0xffffff },
  cornerNormalCenter: { color: 0x000000 },
  cornerDeleteOuter: { color: 0xff0000, alpha: 0.7 },
  tempLine: { color: 0xb4b4b8, alpha: 0.3 },
  wall: { color: 0x000000 },
  infoLine: { color: 0x000000 },
  outWall: { color: 0xb4b4b8, alpha: 0.7 },
  outWallHover: { color: 0x4349e6, alpha: 0.7 },
  outDeleteHover: { color: 0xff0000, alpha: 0.7 },
  floorDefault: { color: 0xfaf9f6 },
  floorHover: { color: 0x4349e6, alpha: 0.7 },
};
export const scrollScale = 0.0002;
export const Color3D = {
  baseMaterial: 0xffffff,
  gridPlane: 0xe0e0e0,
};

export const BaseWallTextTure = '/wallTexture/wallmap_yellow.png';

export const emissiveColor = 0x444444;

export const errorColor = 0xff0000;

export const inWallMaterialIndex = 4;
export const outWallMaterialIndex = 5;
