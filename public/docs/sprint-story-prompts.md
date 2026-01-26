# Sprint Story Prompts - Jan 31 Launch

Implementation-ready prompts for each user story in the current sprint. Copy-paste into Lovable to execute.

---

## 🗄️ DATABASE PERSISTENCE (New!)

### Sprint Dashboard Database Integration
**Priority:** SHIP | **Database tables created**

```
Connect the Sprint Dashboard to Supabase for persistent data storage:

1. Database Schema (Already Created)
Tables: sprints, user_stories, burndown_data
- sprints: id, name, phase, start_date, end_date, goals[]
- user_stories: id, sprint_id, title, description, acceptance_criteria[], status, priority, points, assignee, epic, tags[], design_thinking_stage, api_contract (JSONB)
- burndown_data: id, sprint_id, date, planned, actual

2. Create Sprint Hook (src/hooks/useSprints.ts)
- Fetch active sprint with stories and burndown
- CRUD operations for stories (admin only)
- Real-time subscription for story updates
- Optimistic updates for drag-and-drop

3. Update SprintBoard Component
- Replace static CURRENT_SPRINT data with useSprints hook
- Add drag-and-drop to update story status
- Show loading/error states
- Sync changes to database on drop

4. Update SprintHeader Component
- Calculate metrics from live data
- Show sprint progress from burndown_data

5. Seed Initial Data
- Create "Jan 31 Launch Sprint" record
- Import existing stories from types.ts
- Generate burndown data points

RLS: Public read, admin-only write. Use has_role() function for admin checks.

Integration points:
- Import { supabase } from "@/integrations/supabase/client"
- Use useQuery/useMutation from @tanstack/react-query
- Add toast notifications for save success/failure
```

---

## ✅ SHIPPED Stories (Reference Only)

### Story 1: Aviation Command - Real-time Weather Briefing
**Status:** DONE | **Points:** 8 | **Priority:** SHIP

```
Implement a real-time aviation weather briefing system with:

1. METAR/TAF Data Display
- Fetch weather data for selected airports (KJFK, KLAX, KORD, etc.)
- Parse and display: wind, visibility, ceiling, temperature, altimeter
- Color-code flight rules: VFR (green), MVFR (blue), IFR (red), LIFR (magenta)

2. Multi-Airport Selection
- Allow pilots to select multiple departure/destination airports
- Show comparative weather conditions in a grid layout
- Highlight hazardous conditions with alerts

3. Text-to-Speech Briefing
- Integrate ElevenLabs API for professional voice readout
- Fallback to Web Speech API if ElevenLabs unavailable
- Play/pause/stop controls for audio playback
- Generate natural language briefing from raw METAR data

4. Route Integration
- Input departure and arrival airports
- Show en-route weather considerations
- Calculate flight rule classification for entire route

Use shadcn/ui components, Tailwind CSS, and store TTS audio URLs for caching.
```

---

### Story 2: STRATA Shell 3D Configurator - Desktop
**Status:** DONE | **Points:** 5 | **Priority:** SHIP

```
Build a 3D product configurator for the STRATA Shell jacket:

1. 3D Viewer (React Three Fiber)
- Load jacket 3D model with environment lighting
- Orbit controls for 360° viewing
- Smooth texture transitions between variants

2. Variant Selection
- 5 terrain variants: Desert, Marine, Polar, Urban, HUD
- Real-time material/texture swapping on selection
- Thumbnail previews for each variant

3. HUD Overlay Display
- Show live weather data on HUD variant
- Temperature, wind, conditions display
- Animated data refresh indicator

4. Size Selector
- Standard sizes: XS, S, M, L, XL, XXL
- Size guide modal with measurements
- Stock availability indicator per size

5. Pricing Engine
- Base price display
- Dynamic pricing based on variant selection
- Add to cart integration with price summary

6. Screenshot Utility
- Capture current 3D view as image
- Download button for configuration snapshot
- Share configuration via URL params

Use @react-three/fiber, @react-three/drei, and framer-motion for animations.
```

---

## 🔄 IN-PROGRESS Stories

### Story 3: Compliance Hub - Document OCR
**Status:** IN-PROGRESS | **Points:** 5 | **Priority:** SHIP

```
Implement AI-powered document scanning and extraction for compliance documents:

1. Document Upload Interface
- Drag-and-drop PDF upload zone
- File type validation (PDF only)
- Upload progress indicator
- Preview thumbnail after upload

2. OCR Processing
- Create Supabase Edge Function: /ai-ocr
- Accept base64 encoded PDF
- Use AI to extract key fields:
  * Document type (permit, license, certificate)
  * Issuing authority
  * Issue date / Expiration date
  * Reference/permit number
  * Holder name/company
- Return structured JSON with field values and confidence scores

3. Extraction Results Display
- Show extracted fields in editable form
- Confidence indicator per field (high/medium/low)
- Allow manual corrections
- Highlight low-confidence fields for review

4. Validation & Save
- Validate required fields are present
- Display validation errors clearly
- Save to compliance_documents table in Supabase
- Link to parent shipment record

API Contract:
POST /ai-ocr
Request: { document: "base64...", type: "permit|license|certificate" }
Response: { fields: { issuer: string, ... }, confidence: 0.95 }

Use shadcn/ui Form, Alert components. Handle loading and error states.
```

---

### Story 4: Briefing Cards - TTS Voice Playback
**Status:** IN-PROGRESS | **Points:** 3 | **Priority:** SHIP

```
Add text-to-speech voice playback to briefing card content:

1. Play Button on Each Card
- Add speaker icon button to card header
- Visual state: idle, loading, playing, paused
- Accessible aria-labels for screen readers

2. Audio Generation
- Create/update Edge Function: /briefing-tts
- Accept card content text
- Use ElevenLabs API for voice synthesis
- Return audio URL or base64 audio data
- Implement caching to avoid regenerating same content

3. Audio Controls
- Play/pause toggle button
- Stop button to reset playback
- Progress indicator (optional)
- Volume control (optional)

4. Voice Options
- Dropdown to select voice style
- Options: Professional, Casual, Urgent
- Persist user preference in localStorage

5. Offline Support
- Cache generated audio in IndexedDB
- Check cache before API call
- Show cached indicator on cards with saved audio

6. Error Handling
- Fallback to Web Speech API if ElevenLabs fails
- Show toast notification on errors
- Retry button for failed generations

Use Web Audio API for playback control. Store voice preference in localStorage.
```

---

## 📋 DEFERRED Stories (Q2)

### Story 5: Kids Kit V2 - Size Expansion
**Status:** BACKLOG | **Points:** 5 | **Priority:** DEFER

```
Expand the Kids Explorer Kit with new size options:

1. New Size Chart
- Add sizes: 2T, 3T, 4T (toddler range)
- Add sizes: 12, 14, 16 (youth range)
- Create visual size chart component
- Age-to-size recommendation guide

2. Size Selector Update
- Update product page size dropdown
- Show size availability badges
- "Notify when available" for out-of-stock sizes

3. Inventory Integration
- Connect to shop inventory system
- Real-time stock level display
- Low stock warnings

4. Product Photos
- Placeholder slots for new size photography
- Size comparison visualization
- Model size reference info

Database: Add kids_sizes table with columns:
- size_code, size_label, age_range, chest_cm, waist_cm, height_cm, stock_quantity
```

---

### Story 6: STRATA Shell AR Preview (DESCOPED)
**Status:** BACKLOG | **Points:** 13 | **Priority:** DESCOPE

```
[DESCOPED FROM CURRENT SPRINT - Technical complexity too high for deadline]

AR try-on feature for STRATA Shell jacket:

1. Camera Access
- Request camera permissions
- Show live video feed
- Handle permission denied gracefully

2. Body Detection
- Use ML model for upper body detection
- Track shoulder/torso position
- Handle multiple people in frame

3. AR Overlay
- Render jacket overlay on detected body
- Match jacket size to detected proportions
- Support all 5 color variants

4. Size Recommendation
- Estimate user measurements from AR
- Suggest best-fit size
- Confidence indicator for recommendation

Note: Requires WebXR or AR.js integration. Consider using 8th Wall or similar.
Defer to Q2 when AR SDK evaluation complete.
```

---

### Story 7: Marine Command - Weather Integration
**Status:** DESIGN | **Points:** 8 | **Priority:** DEFER

```
Add NOAA marine weather to Marine Command dashboard:

1. Marine Forecast Display
- Fetch NOAA marine zone forecasts
- Show wind, wave height, visibility
- 7-day marine forecast timeline

2. Tide Data Integration
- Connect to NOAA CO-OPS tide API
- Show high/low tide times
- Tide chart visualization
- Current water level indicator

3. Route Hazard Alerts
- Define marine route waypoints
- Check weather along route
- Alert for: gale warnings, small craft advisories, fog
- Color-coded route segments by risk

4. Map Visualization
- Marine zone overlay on map
- Buoy data markers
- Real-time vessel AIS data (optional)

API Endpoints:
- NOAA Marine Forecast: https://api.weather.gov/zones/marine
- NOAA Tides: https://api.tidesandcurrents.noaa.gov

Defer: Requires marine zone mapping and API integration research.
```

---

### Story 8: MeetingFlow - AI Action Items
**Status:** BACKLOG | **Points:** 5 | **Priority:** DEFER

```
Extract action items from meeting transcripts using AI:

1. Transcript Analysis
- Accept meeting transcript text
- Use AI to identify action items
- Extract: task description, assignee, due date

2. Action Item Detection
- Pattern recognition for action language:
  * "John will...", "Need to...", "Action: ..."
  * Due date indicators: "by Friday", "next week"
- Confidence score per extracted item

3. Assignee Matching
- Parse names from transcript
- Match to known team members
- Handle ambiguous assignments

4. Due Date Extraction
- Parse relative dates ("next Tuesday")
- Convert to absolute dates
- Flag items without dates

5. Results Display
- List extracted action items
- Editable fields for corrections
- Bulk approve/reject controls
- Export to task management format

Edge Function: /extract-action-items
Request: { transcript: string, participants: string[] }
Response: { actions: [{ task, assignee, dueDate, confidence }] }

Integrations to consider: Notion, Linear, Asana export
```

---

## Quick Reference

| Story | Status | Priority | Points | Epic |
|-------|--------|----------|--------|------|
| Aviation Command | ✅ Done | SHIP | 8 | Aviation |
| STRATA Desktop | ✅ Done | SHIP | 5 | STRATA Shell |
| Compliance OCR | 🔄 In Progress | SHIP | 5 | Compliance |
| Briefing TTS | 🔄 In Progress | SHIP | 3 | Briefing Cards |
| Kids Kit V2 | 📋 Backlog | DEFER | 5 | Kids Kit |
| AR Preview | ❌ Descoped | DESCOPE | 13 | STRATA Shell |
| Marine Weather | 📐 Design | DEFER | 8 | Marine Command |
| MeetingFlow AI | 📋 Backlog | DEFER | 5 | MeetingFlow |

**Total Points:** 52 | **Shipped:** 13 | **Remaining:** 8 (SHIP priority)

---

*Slash Studio • Jan 31 Sprint • Ship/Defer/Descope*
