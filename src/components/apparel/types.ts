// Charles River Apparel 3D Blueprint System Types

export interface ApparelPattern {
  id: string;
  name: string;
  type: 'jacket' | 'vest' | 'shell' | 'hoodie' | 'windbreaker';
  pieces: PatternPiece[];
  materials: MaterialSpec[];
  colorways: Colorway[];
  sizes: SizeSpec[];
}

export interface PatternPiece {
  id: string;
  name: string;
  // SVG path data for 2D pattern
  svgPath: string;
  // 3D mesh positioning
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  // Fabric properties
  fabricType: 'shell' | 'lining' | 'insulation' | 'trim' | 'hardware';
  area: number; // square inches
  seamAllowance: number; // inches
}

export interface MaterialSpec {
  id: string;
  name: string;
  type: 'outer' | 'lining' | 'insulation' | 'membrane';
  weight: number; // gsm
  waterproof: number; // mm hydrostatic head
  breathability: number; // g/m²/24h
  color: string;
  texture?: string; // texture map URL
}

export interface Colorway {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  trim: string;
}

export interface SizeSpec {
  code: string;
  label: string;
  chest: number;
  waist: number;
  length: number;
  sleeve: number;
}

export interface DiagramExport {
  type: 'technical' | 'pattern' | 'isometric' | 'exploded';
  format: 'pdf' | 'svg' | 'png';
  scale: number;
  includeSeamAllowance: boolean;
  includeMeasurements: boolean;
}

// STRATA Shell specific types extending base apparel
export interface StrataShellSpec extends ApparelPattern {
  terrain: 'standard' | 'marine' | 'polar' | 'desert' | 'urban';
  hudDisplay: boolean;
  hydrophonicMembrane: boolean;
  thermalRating: number;
  strataZone: string;
}

// 3D Viewer state
export interface Viewer3DState {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  rotation: [number, number, number];
  zoom: number;
  showWireframe: boolean;
  showSeams: boolean;
  showMeasurements: boolean;
  explodedView: boolean;
  explodeDistance: number;
  selectedPiece: string | null;
  highlightedPiece: string | null;
}

// AR Preview state
export interface ARPreviewState {
  enabled: boolean;
  bodyMeasurements?: {
    height: number;
    chest: number;
    waist: number;
    hips: number;
  };
  overlayOpacity: number;
  showFitGuide: boolean;
}
