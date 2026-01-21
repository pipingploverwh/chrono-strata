// Charles River Apparel 3D Blueprint System
// Comprehensive 3D visualization, pattern generation, and AR preview

export { Apparel3DViewer } from './Apparel3DViewer';
export { PatternLayout2D } from './PatternLayout2D';
export { TechnicalBlueprintExport } from './TechnicalBlueprintExport';
export { ARPreviewOverlay } from './ARPreviewOverlay';

// Types
export type {
  ApparelPattern,
  PatternPiece,
  MaterialSpec,
  Colorway,
  SizeSpec,
  DiagramExport,
  StrataShellSpec,
  Viewer3DState,
  ARPreviewState,
} from './types';

// Data
export { 
  STRATA_PATTERN_PIECES,
  STRATA_MATERIALS,
  STRATA_COLORWAYS,
  STRATA_SIZES,
  createStrataShellSpec,
} from './data/strataShellPatterns';
