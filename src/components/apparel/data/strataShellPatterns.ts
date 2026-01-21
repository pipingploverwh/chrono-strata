import { StrataShellSpec, PatternPiece, MaterialSpec, Colorway, SizeSpec } from '../types';

// Pattern pieces for STRATA Shell jacket
export const STRATA_PATTERN_PIECES: PatternPiece[] = [
  // Front panels
  {
    id: 'front-left',
    name: 'Front Left Panel',
    svgPath: 'M 0,0 L 180,0 L 200,60 L 210,280 L 190,380 L 0,380 Z',
    position: [-0.6, 0, 0.2],
    rotation: [0, 0.3, 0],
    scale: [1, 1, 1],
    fabricType: 'shell',
    area: 450,
    seamAllowance: 0.5,
  },
  {
    id: 'front-right',
    name: 'Front Right Panel',
    svgPath: 'M 0,0 L 180,0 L 200,60 L 210,280 L 190,380 L 0,380 Z',
    position: [0.6, 0, 0.2],
    rotation: [0, -0.3, 0],
    scale: [1, 1, 1],
    fabricType: 'shell',
    area: 450,
    seamAllowance: 0.5,
  },
  // Back panel
  {
    id: 'back',
    name: 'Back Panel',
    svgPath: 'M 0,0 L 360,0 L 380,60 L 390,340 L 350,400 L 10,400 L -30,340 L -20,60 Z',
    position: [0, 0, -0.3],
    rotation: [0, Math.PI, 0],
    scale: [1, 1, 1],
    fabricType: 'shell',
    area: 720,
    seamAllowance: 0.5,
  },
  // Sleeves
  {
    id: 'sleeve-left',
    name: 'Left Sleeve',
    svgPath: 'M 0,0 L 160,20 L 180,300 L 120,320 L 0,320 L -40,300 L -20,20 Z',
    position: [-1.1, 0.3, 0],
    rotation: [0, 0, 0.5],
    scale: [1, 1, 1],
    fabricType: 'shell',
    area: 380,
    seamAllowance: 0.5,
  },
  {
    id: 'sleeve-right',
    name: 'Right Sleeve',
    svgPath: 'M 0,0 L 160,20 L 180,300 L 120,320 L 0,320 L -40,300 L -20,20 Z',
    position: [1.1, 0.3, 0],
    rotation: [0, 0, -0.5],
    scale: [1, 1, 1],
    fabricType: 'shell',
    area: 380,
    seamAllowance: 0.5,
  },
  // Hood
  {
    id: 'hood',
    name: 'Hood',
    svgPath: 'M 0,0 C 80,-40 160,-40 240,0 L 260,120 C 260,180 200,220 120,220 C 40,220 -20,180 -20,120 Z',
    position: [0, 0.9, -0.1],
    rotation: [-0.3, 0, 0],
    scale: [1, 1, 1],
    fabricType: 'shell',
    area: 280,
    seamAllowance: 0.5,
  },
  // Pockets
  {
    id: 'pocket-left',
    name: 'Left Cargo Pocket',
    svgPath: 'M 0,0 L 100,0 L 100,80 L 0,80 Z',
    position: [-0.5, -0.3, 0.35],
    rotation: [0, 0.3, 0],
    scale: [0.6, 0.6, 0.6],
    fabricType: 'shell',
    area: 48,
    seamAllowance: 0.25,
  },
  {
    id: 'pocket-right',
    name: 'Right Cargo Pocket',
    svgPath: 'M 0,0 L 100,0 L 100,80 L 0,80 Z',
    position: [0.5, -0.3, 0.35],
    rotation: [0, -0.3, 0],
    scale: [0.6, 0.6, 0.6],
    fabricType: 'shell',
    area: 48,
    seamAllowance: 0.25,
  },
  // Lining pieces
  {
    id: 'lining-body',
    name: 'Body Lining',
    svgPath: 'M 0,0 L 700,0 L 720,60 L 730,700 L 680,760 L 20,760 L -30,700 L -20,60 Z',
    position: [0, 0, 0.05],
    rotation: [0, 0, 0],
    scale: [0.95, 0.95, 0.95],
    fabricType: 'lining',
    area: 1400,
    seamAllowance: 0.375,
  },
  // HUD Display bezel
  {
    id: 'hud-bezel',
    name: 'HUD Display Bezel',
    svgPath: 'M 0,0 L 60,0 L 60,40 L 0,40 Z',
    position: [-0.35, 0.2, 0.38],
    rotation: [0, 0.3, 0],
    scale: [0.4, 0.4, 0.4],
    fabricType: 'hardware',
    area: 12,
    seamAllowance: 0,
  },
];

// Materials available for STRATA Shell
export const STRATA_MATERIALS: MaterialSpec[] = [
  {
    id: 'vulcanized-membrane',
    name: 'Vulcanized Hydrophobic Membrane',
    type: 'outer',
    weight: 180,
    waterproof: 20000,
    breathability: 15000,
    color: '#1a1a1a',
  },
  {
    id: 'thermal-lining',
    name: 'Thermal Retention Lining',
    type: 'lining',
    weight: 120,
    waterproof: 0,
    breathability: 25000,
    color: '#2d2d2d',
  },
  {
    id: 'primaloft-insulation',
    name: 'PrimaLoft® Gold Insulation',
    type: 'insulation',
    weight: 133,
    waterproof: 0,
    breathability: 0,
    color: '#f5f5f5',
  },
  {
    id: 'gore-tex-membrane',
    name: 'GORE-TEX® Pro Membrane',
    type: 'membrane',
    weight: 90,
    waterproof: 28000,
    breathability: 18000,
    color: '#ffffff',
  },
];

// Colorway definitions by terrain
export const STRATA_COLORWAYS: Record<string, Colorway> = {
  standard: {
    id: 'chrono-topo',
    name: 'CHRONO-TOPO',
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#f97316', // strata-orange
    trim: '#71717a',
  },
  marine: {
    id: 'bathymetric',
    name: 'BATHYMETRIC',
    primary: '#0c4a6e',
    secondary: '#164e63',
    accent: '#22d3ee', // cyan-400
    trim: '#94a3b8',
  },
  polar: {
    id: 'glacial',
    name: 'GLACIAL',
    primary: '#f8fafc',
    secondary: '#e2e8f0',
    accent: '#93c5fd', // blue-300
    trim: '#64748b',
  },
  desert: {
    id: 'geological',
    name: 'GEOLOGICAL',
    primary: '#78350f',
    secondary: '#92400e',
    accent: '#f97316', // orange-500
    trim: '#a8a29e',
  },
  urban: {
    id: 'metropolitan',
    name: 'METROPOLITAN',
    primary: '#18181b',
    secondary: '#27272a',
    accent: '#a78bfa', // violet-400
    trim: '#52525b',
  },
};

// Size chart
export const STRATA_SIZES: SizeSpec[] = [
  { code: 'XS', label: 'X-Small', chest: 34, waist: 28, length: 26, sleeve: 32 },
  { code: 'S', label: 'Small', chest: 36, waist: 30, length: 27, sleeve: 33 },
  { code: 'M', label: 'Medium', chest: 40, waist: 34, length: 28, sleeve: 34 },
  { code: 'L', label: 'Large', chest: 44, waist: 38, length: 29, sleeve: 35 },
  { code: 'XL', label: 'X-Large', chest: 48, waist: 42, length: 30, sleeve: 36 },
  { code: 'XXL', label: '2X-Large', chest: 52, waist: 46, length: 31, sleeve: 37 },
];

// Complete STRATA Shell specification factory
export function createStrataShellSpec(terrain: StrataShellSpec['terrain']): StrataShellSpec {
  const colorway = STRATA_COLORWAYS[terrain];
  
  return {
    id: `strata-shell-${terrain}`,
    name: `STRATA Shell - ${colorway.name}`,
    type: 'shell',
    terrain,
    pieces: STRATA_PATTERN_PIECES,
    materials: STRATA_MATERIALS,
    colorways: [colorway],
    sizes: STRATA_SIZES,
    hudDisplay: true,
    hydrophonicMembrane: true,
    thermalRating: terrain === 'polar' ? 95 : terrain === 'desert' ? 40 : 75,
    strataZone: getStrataZone(terrain),
  };
}

function getStrataZone(terrain: string): string {
  const zones: Record<string, string> = {
    standard: 'Default Protocol',
    marine: 'Pacific Marine',
    polar: 'Tromsø Arctic',
    desert: 'Sahara Interior',
    urban: 'Tokyo Metropolis',
  };
  return zones[terrain] || 'Default Protocol';
}
