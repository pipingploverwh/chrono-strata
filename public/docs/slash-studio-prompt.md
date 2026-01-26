# Slash Studio Design Sprint System

## Implementation Prompt

Use this prompt to implement the Slash Studio Design Sprint methodology in any Lovable project:

---

### PROMPT START

```
Create a comprehensive Design Sprint system following Slash Studio principles:

## Core Philosophy
- "Design 4 weeks ahead of build"
- Ship/Defer/Descope triage methodology
- Empathize → Define → Ideate → Prototype → Test cycle

## Required Components

### 1. Sprint Dashboard Page (`/sprint`)
Create a central sprint management hub with:
- Tabbed interface: Board | Design | Burndown | Stories
- Sprint header showing progress metrics
- Story detail sheet/modal

### 2. Sprint Board (Kanban)
Columns: Backlog → Design → Ready → In Progress → QA → Done
- Drag-and-drop story cards
- Priority badges (SHIP/DEFER/DESCOPE)
- Point estimates display
- Epic grouping

### 3. Story Card Component
Each card displays:
- Title and description
- Priority badge (color-coded)
- Story points
- Epic label
- Status indicator
- Acceptance criteria (expandable)
- API contract (if applicable)

### 4. Design Thinking Wizard
Interactive 5-stage workflow:

**Stage 1: Empathize**
- User interviews
- Customer journey mapping
- Pain point identification
- Deliverables: Personas, Empathy maps

**Stage 2: Define**
- Synthesize research
- Identify patterns
- Create problem statements
- Deliverables: Problem statement, Feature scope

**Stage 3: Ideate**
- SCAMPER brainstorming
- Story breakdown
- Feature prioritization
- Deliverables: User stories, Acceptance criteria

**Stage 4: Prototype**
- UX wireframes
- API contract definition
- Technical investigation
- Deliverables: Clickable prototypes, API contracts

**Stage 5: Test**
- User acceptance testing
- QA testing
- Iteration based on feedback
- Deliverables: Test results, Bug fixes

### 5. Burndown Chart
- Planned vs actual progress lines
- Sprint date range on X-axis
- Story points on Y-axis
- Variance indicator

### 6. Data Types

\`\`\`typescript
type StoryStatus = 'backlog' | 'design' | 'ready' | 'in-progress' | 'qa' | 'done';
type Priority = 'ship' | 'defer' | 'descope';
type DesignThinkingStage = 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';

interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: StoryStatus;
  priority: Priority;
  points: number;
  assignee?: string;
  epic?: string;
  apiContract?: {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    request?: Record<string, unknown>;
    response?: Record<string, unknown>;
  };
  tags: string[];
}

interface Sprint {
  id: string;
  name: string;
  phase: 'design' | 'build' | 'review';
  startDate: string;
  endDate: string;
  goals: string[];
  stories: UserStory[];
  burndownData: { date: string; planned: number; actual: number | null }[];
}
\`\`\`

## UI Requirements
- Use shadcn/ui components (Tabs, Sheet, Badge, Card, Progress)
- Framer Motion for animations
- Recharts for burndown visualization
- Responsive design (mobile-friendly tabs)
- Dark mode support via design tokens

## Integration Points
- Link from existing roadmap pages
- Add to footer navigation under "Development"
- Optional: Connect to database for persistence
```

### PROMPT END

---

## Customization Options

### For B2B Products
Add enterprise features:
- Team assignment
- Stakeholder approvals
- Compliance checkpoints
- SLA tracking

### For B2C Products
Add consumer-focused elements:
- A/B test tracking
- User feedback integration
- Launch checklist
- Marketing milestone sync

### For Agency/Client Work
Add client collaboration:
- Client review stages
- Approval workflows
- Change request tracking
- Budget/hours tracking

---

## Quick Start Stories

Populate your first sprint with these starter stories:

```typescript
const STARTER_STORIES: UserStory[] = [
  {
    id: 'story-auth',
    title: 'User Authentication',
    description: 'Implement secure login and signup flow',
    acceptanceCriteria: [
      'Email/password authentication works',
      'Session persistence across browser refresh',
      'Protected routes redirect to login',
      'Error states display clearly',
    ],
    status: 'backlog',
    priority: 'ship',
    points: 5,
    tags: ['auth', 'core'],
  },
  {
    id: 'story-dashboard',
    title: 'Main Dashboard',
    description: 'Create the primary user dashboard view',
    acceptanceCriteria: [
      'Key metrics display on load',
      'Responsive layout works on mobile',
      'Loading states prevent layout shift',
    ],
    status: 'backlog',
    priority: 'ship',
    points: 8,
    tags: ['ui', 'core'],
  },
  {
    id: 'story-settings',
    title: 'User Settings Page',
    description: 'Allow users to manage their preferences',
    acceptanceCriteria: [
      'Profile editing works',
      'Notification preferences save',
      'Theme toggle functional',
    ],
    status: 'backlog',
    priority: 'defer',
    points: 3,
    tags: ['ui', 'settings'],
  },
];
```

---

## File Structure

```
src/
├── pages/
│   └── SprintDashboard.tsx
├── components/
│   └── sprint/
│       ├── index.ts
│       ├── types.ts
│       ├── SprintBoard.tsx
│       ├── SprintHeader.tsx
│       ├── StoryCard.tsx
│       ├── DesignThinkingWizard.tsx
│       └── BurndownChart.tsx
```

---

*Slash Studio Methodology • Design 4 Weeks Ahead*
