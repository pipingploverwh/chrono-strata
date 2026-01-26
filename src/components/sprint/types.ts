// Slash Studio Design Sprint Types

export type SprintPhase = 'design' | 'build' | 'review';
export type StoryStatus = 'backlog' | 'design' | 'ready' | 'in-progress' | 'qa' | 'done';
export type DesignThinkingStage = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
export type Priority = 'ship' | 'defer' | 'descope';

export interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: StoryStatus;
  priority: Priority;
  points: number;
  assignee?: string;
  epic?: string;
  apiContract?: APIContract;
  designThinkingStage?: DesignThinkingStage;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface APIContract {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  request?: Record<string, unknown>;
  response?: Record<string, unknown>;
  notes?: string;
}

export interface Sprint {
  id: string;
  name: string;
  phase: SprintPhase;
  startDate: string;
  endDate: string;
  goals: string[];
  stories: UserStory[];
  burndownData: BurndownPoint[];
}

export interface BurndownPoint {
  date: string;
  planned: number;
  actual: number;
}

export interface DesignThinkingStep {
  stage: DesignThinkingStage;
  title: string;
  description: string;
  activities: string[];
  deliverables: string[];
  isComplete: boolean;
}

// Current sprint data based on Jan 31 roadmap
export const CURRENT_SPRINT: Sprint = {
  id: 'sprint-jan31',
  name: 'Jan 31 Launch Sprint',
  phase: 'build',
  startDate: '2026-01-20',
  endDate: '2026-01-31',
  goals: [
    'Ship Aviation Command (100%)',
    'Ship STRATA Shell Desktop (100%)',
    'Ship Compliance OCR (100%)',
    'Ship Briefing TTS (100%)',
  ],
  stories: [
    {
      id: 'story-1',
      title: 'Aviation Command - Real-time Weather Briefing',
      description: 'Complete the real-time weather briefing system for pilots',
      acceptanceCriteria: [
        'METAR/TAF data displays correctly',
        'Route planning integrates with weather',
        'TTS playback works for briefings',
        'Mobile-responsive design',
      ],
      status: 'in-progress',
      priority: 'ship',
      points: 8,
      assignee: 'Enterprise Lead',
      epic: 'Aviation Command',
      tags: ['b2b', 'weather', 'priority'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
    {
      id: 'story-2',
      title: 'STRATA Shell 3D Configurator - Desktop',
      description: 'Complete the 3D configurator for desktop browsers',
      acceptanceCriteria: [
        'Texture loading optimized',
        'All color variants render correctly',
        'Size selector functional',
        'Add to cart integration',
        'HUD display with live data',
        'Screenshot utility',
        'Real-time pricing engine',
      ],
      status: 'done',
      priority: 'ship',
      points: 5,
      assignee: 'Design Lead',
      epic: 'STRATA Shell',
      tags: ['b2c', '3d', 'configurator', 'shipped'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
    {
      id: 'story-3',
      title: 'Compliance Hub - Document OCR',
      description: 'Implement AI-powered document scanning and extraction',
      acceptanceCriteria: [
        'PDF upload works',
        'OCR extracts key fields',
        'Validation errors display',
        'Results save to database',
      ],
      status: 'in-progress',
      priority: 'ship',
      points: 5,
      assignee: 'Legal/Ops Lead',
      epic: 'Compliance Hub',
      apiContract: {
        endpoint: '/ai-ocr',
        method: 'POST',
        request: { document: 'base64', type: 'permit|license|certificate' },
        response: { fields: 'Record<string, string>', confidence: 'number' },
      },
      tags: ['b2b', 'ai', 'ocr'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
    {
      id: 'story-4',
      title: 'Briefing Cards - TTS Voice Playback',
      description: 'Add text-to-speech for briefing card content',
      acceptanceCriteria: [
        'Play button on each card',
        'Audio controls (pause/resume)',
        'Multiple voice options',
        'Offline caching',
      ],
      status: 'in-progress',
      priority: 'ship',
      points: 3,
      assignee: 'Intelligence Lead',
      epic: 'Briefing Cards',
      tags: ['b2b', 'tts', 'audio'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
    {
      id: 'story-5',
      title: 'Kids Kit V2 - Size Expansion',
      description: 'Add new size options for Kids Explorer Kit',
      acceptanceCriteria: [
        'New size chart implemented',
        'Inventory sync with shop',
        'Product photos for new sizes',
      ],
      status: 'backlog',
      priority: 'defer',
      points: 5,
      epic: 'Kids Kit',
      tags: ['b2c', 'sizing', 'inventory'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
    {
      id: 'story-6',
      title: 'STRATA Shell AR Preview',
      description: 'Implement AR try-on for STRATA Shell jacket',
      acceptanceCriteria: [
        'Camera access works',
        'AR overlay renders correctly',
        'Size recommendation from AR',
      ],
      status: 'backlog',
      priority: 'descope',
      points: 13,
      epic: 'STRATA Shell',
      tags: ['b2c', 'ar', 'experimental'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
    {
      id: 'story-7',
      title: 'Marine Command - Weather Integration',
      description: 'Add NOAA marine weather to Marine Command',
      acceptanceCriteria: [
        'Marine forecast displays',
        'Tide data integrated',
        'Route hazard alerts',
      ],
      status: 'design',
      priority: 'defer',
      points: 8,
      epic: 'Marine Command',
      tags: ['b2b', 'marine', 'weather'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
    {
      id: 'story-8',
      title: 'MeetingFlow - AI Action Items',
      description: 'Extract action items from meeting transcripts',
      acceptanceCriteria: [
        'AI identifies action items',
        'Assigns to participants',
        'Due date extraction',
      ],
      status: 'backlog',
      priority: 'defer',
      points: 5,
      epic: 'MeetingFlow',
      tags: ['b2b', 'ai', 'internal'],
      createdAt: '2026-01-20',
      updatedAt: '2026-01-26',
    },
  ],
  burndownData: [
    { date: '2026-01-20', planned: 52, actual: 52 },
    { date: '2026-01-21', planned: 47, actual: 49 },
    { date: '2026-01-22', planned: 42, actual: 45 },
    { date: '2026-01-23', planned: 37, actual: 40 },
    { date: '2026-01-24', planned: 32, actual: 35 },
    { date: '2026-01-25', planned: 27, actual: 29 },
    { date: '2026-01-26', planned: 22, actual: 24 },
    { date: '2026-01-27', planned: 17, actual: null },
    { date: '2026-01-28', planned: 12, actual: null },
    { date: '2026-01-29', planned: 7, actual: null },
    { date: '2026-01-30', planned: 3, actual: null },
    { date: '2026-01-31', planned: 0, actual: null },
  ],
};

export const DESIGN_THINKING_STEPS: DesignThinkingStep[] = [
  {
    stage: 'empathize',
    title: 'Empathize',
    description: 'Understand customer requirements, attitudes, hurdles, and dreams',
    activities: [
      'User interviews',
      'Customer journey mapping',
      'Competitive analysis',
      'Pain point identification',
    ],
    deliverables: [
      'User personas',
      'Empathy maps',
      'Customer needs list',
    ],
    isComplete: true,
  },
  {
    stage: 'define',
    title: 'Define',
    description: 'Gather information, identify patterns, and create focused problem statements',
    activities: [
      'Synthesize research',
      'Identify patterns',
      'Question assumptions',
      'Create problem statements',
    ],
    deliverables: [
      'Problem statement',
      'Feature scope document',
      'Value propositions',
    ],
    isComplete: true,
  },
  {
    stage: 'ideate',
    title: 'Ideate',
    description: 'Brainstorm creative solutions using structured techniques',
    activities: [
      'SCAMPER brainstorming',
      'Brainwrite sessions',
      'Worst Possible Idea exercise',
      'Story breakdown',
    ],
    deliverables: [
      'User stories',
      'Acceptance criteria',
      'Feature prioritization',
    ],
    isComplete: true,
  },
  {
    stage: 'prototype',
    title: 'Prototype',
    description: 'Turn ideas into reality by creating MVPs to test what works',
    activities: [
      'UX wireframes',
      'UI design mockups',
      'API contract definition',
      'Technical investigation',
    ],
    deliverables: [
      'Clickable prototypes',
      'API contracts',
      'Tech feasibility report',
    ],
    isComplete: false,
  },
  {
    stage: 'test',
    title: 'Test',
    description: 'Thoroughly test the product and gather insights on user interaction',
    activities: [
      'User acceptance testing',
      'QA testing',
      'Performance testing',
      'Iterate based on feedback',
    ],
    deliverables: [
      'Test results',
      'Bug fixes',
      'Iteration plan',
    ],
    isComplete: false,
  },
];
