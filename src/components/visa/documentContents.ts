// Pre-filled document content based on Shibuya Startup Visa requirements for LAVANDAR
// Updated with actual applicant information from submitted documents

export interface DocumentContent {
  type: string;
  name: string;
  content: string;
  formNumber?: string;
  status: 'draft' | 'ready' | 'template';
}

export const visaDocumentContents: Record<string, DocumentContent> = {
  application_confirmation: {
    type: 'application_confirmation',
    name: 'Application for Confirmation of Business Activities',
    formNumber: 'Form 1 (Article 4)',
    status: 'ready',
    content: `# Application for Confirmation of Business Activities

**Form 1 (Article 4)**

**Submission Date:** January 18, 2026

**To:** Mayor of Shibuya City

---

## Applicant Information

| Field | Value |
|-------|-------|
| Nationality | United States of America |
| Address | Falmouth, MA USA → [Japan Residence TBD] |
| Contact Information | +1 530 204 9045 / admin@lavandar.ai |
| Name | Ben Rubin |

---

## Declaration

I hereby apply for the confirmation of Notification No. 5-6 according to the Notification No. 5-4 specified under program to foster international entrepreneurship.

---

## Required Attachments Checklist

| # | Document | Check |
|---|----------|-------|
| 1 | Business Startup Activities Confirmation Application | ☑ |
| 2 | Schedule of business activity | ☑ |
| 3 | Resume of the applicants | ☐ |
| 4 | Pledge | ☑ |
| 5 | Proof of residence for 6 months (rental contract) | ☐ |
| 6 | Bank account balance statement | ☐ |
| 7 | Education/work verification documents | ☐ |
| 8 | Copy of passport | ☐ |
| 9 | Additional business plan documents | ☑ |
`,
  },

  startup_confirmation: {
    type: 'startup_confirmation',
    name: 'Business Startup Activities Confirmation Application',
    formNumber: 'Form 1-2 (Article 4)',
    status: 'ready',
    content: `# Business Startup Activities Confirmation Application

**Form 1-2 (Article 4)**

---

## Business Overview: LAVANDAR Intelligence Platform

**Business Name:** LAVANDAR Intelligence Platform  
**Trading Name:** The Kraft Group - LVNDR AI  
**Industry Field:** Information Technologies / Aerospace / Defense  
**Primary Contact:** Ben Rubin (admin@lavandar.ai)

---

## Platform Description

The LAVANDAR Intelligence Platform is a multi-vertical operational ecosystem that integrates real-time environmental data, predictive AI modeling, and agentic workflows into a unified user interface.

### Primary Innovation: Atmospheric Refraction Correction API

LAVANDAR provides high-precision atmospheric refraction correction for celestial navigation systems, improving accuracy for GPS-denied environments such as:
- Disaster response corridors
- Humanitarian air delivery
- Maritime relief routing
- Defense and autonomous navigation

---

## Core Technology (Patent Portfolio)

| Patent | Inventor | Description |
|--------|----------|-------------|
| US 2008/0195495 A1 | Victor Rubin | Hierarchical Threat Classification - Multi-source data aggregation for categorizing tracks in real-time |
| US 10,082,945 B2 | Benzion Rubin | Exit-Intent Detection - Predictive trajectory prediction for aircraft deviation analysis |
| Academic Research | Dr. Robert Rubin | Saemundsson-Meeus atmospheric refraction modeling for 99.9% intercept window calculations |

---

## STRATA Platform Verticals

The platform demonstrates a "write once, deploy everywhere" architecture across distinct industries:

| Vertical | Application |
|----------|-------------|
| Aviation | METAR/TAF parsing, ceiling/visibility analysis |
| Marine | Wave height, tide predictions, port intelligence |
| Construction | Crane wind limits and concrete pour windows |
| Events | Lightning detection radii and crowd safety protocols |
| Defense | GPS-denied navigation, celestial UAV guidance |

---

## Technical Architecture

| Component | Technology | Implementation |
|-----------|------------|----------------|
| Frontend | React / Lovable | High-performance UI with Framer Motion |
| Backend | Supabase / Edge Functions | 27 deployed Edge Functions |
| AI Layer | OpenAI / ML Models | Custom models with SHAP explainability |
| Commerce | ECOMFORGE | Shopify Storefront API + Stripe |
| Data | External APIs | OpenSky, ESPN, Weather APIs |

---

## Market Opportunity

| Segment | Market Size |
|---------|-------------|
| Initial TAM (Celestial UAVs) | $7.5-18M (750-1,200 units × $5-15K) |
| Defense Navigation (2034) | $271B (15.7% CAGR) |
| Total Expansion | $1 Trillion |

---

## Strategic Readiness

**Production URL:** chrono-strata.lovable.app  
**API Demo:** lavandar.ai/alpha-os

**Deployed Systems:**
- ✅ Authentication (secure login, role-based access)
- ✅ Monetization (Stripe subscriptions)
- ✅ Administration (system configuration, analytics)
- ✅ Working API with academic validation
`,
  },

  schedule: {
    type: 'schedule',
    name: 'Schedule of Business Activity',
    formNumber: 'Form 1-3 (Article 4)',
    status: 'ready',
    content: `# Schedule of Business Activity

**Form 1-3 (Article 4)**

**Applicant:** Ben Rubin  
**Company:** LAVANDAR Intelligence Platform

---

## 6-Month Business Activity Schedule (Shibuya Startup Visa Period)

| Month | Period | Business Activities | Capital/Funding |
|-------|--------|---------------------|-----------------|
| **1** | Month 1 | Platform deployment and Japan market research. Establish office presence in Shibuya. Begin customer discovery for defense and aviation sectors. | Initial capital: Self-funded + Angel investment |
| **2** | Month 2 | Develop Japan-specific STRATA vertical. Integrate Japan weather APIs (JMA). Build local partnerships with aerospace companies. | Operating expenses from reserves |
| **3** | Month 3 | Launch beta with 3-5 pilot customers. Target: Elbit Systems (Hermes UAV integration), IAI (Heron/Navigation Center). | Revenue: Pilot subscriptions ($100-250K projected) |
| **4** | Month 4 | Expand enterprise customers. Implement Yen-based Stripe payments. Submit DDR&D Innofense application. | Revenue growth + potential seed round |
| **5** | Month 5 | Full commercial launch. Edge SDK development. Conference presentations. Target: First signed LOI from defense prime. | Revenue: $500K-1M Year 2 target |
| **6** | Month 6 | Achieve break-even in Japan operations. Document business growth for visa extension. GNC Engineer contractor onboarding. | Sustainable operations |

---

## Extended Schedule (Months 7-12)

| Month | Period | Business Activities | Capital/Funding |
|-------|--------|---------------------|-----------------|
| **7** | Month 7 | Edge SDK deployment on UAV platform in IDF testing. Secure DDR&D validation. | Series A preparation |
| **8** | Month 8 | First revenue milestone: $50-100K pilot contract from Israeli defense. | Strategic partnerships |
| **9** | Month 9 | Expand office space. Hire Defense BD Advisor for DDR&D and prime contacts. | Growth capital |
| **10** | Month 10 | Part-time CTO onboarding for Edge SDK development lead. | Revenue milestone |
| **11** | Month 11 | Begin Status of Residence application. Document all achievements. Close $1-2M seed round. | Seed funding |
| **12** | Month 12 | Establish Japan subsidiary (KK). Complete corporate registration. International expansion prep (Germany, UAE, India). | Capital increase |

---

## Revenue Path

| Year 1 | Year 2 | Year 3 |
|--------|--------|--------|
| $100-250K | $500K-1M | $2-5M |
| Pilot contracts | Production SDK + DDR&D | Prime integrations |

---

## Business Model

| Tier | Pricing | Description |
|------|---------|-------------|
| Developer | Free | API testing & validation |
| Pilot License | $2.5-5K | R&D project integration |
| Edge SDK | $25K+/yr | Air-gapped deployment |

---

## Success Metrics for Seed Funding

| Metric | Target |
|--------|--------|
| DDR&D Validation | 1 program validation |
| Defense Prime LOI | 1 signed letter of intent |
| Revenue | $50K+ |
| Seed Round | $2-5M |

---

*Note: Business expenses are associated with self-financing initially, transitioning to revenue-based funding by Month 6.*
`,
  },

  executive_summary: {
    type: 'executive_summary',
    name: 'Executive Summary',
    status: 'ready',
    content: `# Executive Summary: LAVANDAR Intelligence Platform

## 1. Platform Overview

The LAVANDAR Intelligence Platform (deployed as The Kraft Group - LVNDR AI) is a multi-vertical operational ecosystem that integrates real-time environmental data, predictive AI modeling, and agentic workflows into a unified user interface.

The platform demonstrates a "write once, deploy everywhere" architecture, successfully adapting a core intelligence engine (STRATA) across distinct industries including Aviation, Marine, Construction, Events, and Professional Sports. It serves as both a functional operational tool and a high-fidelity technical showcase of modern, edge-first web architecture.

---

## 2. Core Value Propositions

### Vertical Adaptability (STRATA)
The system uses a singular codebase to generate industry-specific intelligence. For example, wind data is interpreted differently for a crane operator (Construction) versus a pilot (Aviation) or a stadium manager (Events), with specialized operational thresholds for each.

### Agentic AI Architecture
Moving beyond simple chatbots, the platform features an Agentic Matchup Engine. This system utilizes tool-calling architecture to autonomously fetch live weather, player stats, and historical data to generate proactive strategic insights based on real-time game states.

### Design as a Differentiator
The platform utilizes the LAVANDAR Design System (inspired by Kengo Kuma), featuring specialized components (TimberCard, ShojiReveal, KumikoLattice) that bridge the gap between complex engineering data and high-end marketing aesthetics.

### Real-Time Operations
Leveraging Supabase Realtime and Edge Functions, the platform provides live presence tracking, game score updates (ESPN API), and environmental monitoring without page refreshes.

---

## 3. Technical Architecture High-Level

| Component | Technology | Implementation |
|-----------|------------|----------------|
| Frontend | React / Lovable | High-performance UI with Framer Motion animations and parallax effects |
| Backend | Supabase / Edge Functions | 27 deployed Edge Functions handling AI logic, payments, and data ingestion |
| AI Layer | OpenAI / ML Models | Custom models with SHAP-style explainability, confidence intervals, and tool-calling capabilities |
| Commerce | ECOMFORGE | AI-native commerce architecture integrated with Shopify Storefront API and Stripe |
| Data Integrations | External APIs | Integration with OpenSky (Flight tracking), ESPN (Scores), and Weather APIs |

---

## 4. Key Product Suites

### A. STRATA (Vertical Intelligence)
"Living Whitepapers" that function as operational dashboards.
- **Aviation:** METAR/TAF parsing and ceiling/visibility analysis
- **Marine:** Wave height, tide predictions, and port intelligence
- **Construction:** Crane wind limits and concrete pour windows
- **Events:** Lightning detection radii and crowd safety protocols

### B. INTELLIGENCE SUITE (AI)
- **Matchup Engine:** The flagship demo featuring proactive AI triggers based on live game momentum
- **Predictive Modeling:** Visualizations of ML model confidence and feature importance (Model Explainability)
- **Player Profile:** Correlation analysis between weather conditions and player performance

### C. SPORTS & GAME DAY
- **Live Dashboard:** Real-time game tracking with weather overlays (wind vectors)

---

## 5. Strategic Readiness

The platform is currently deployed in a production-ready environment (chrono-strata.lovable.app) with fully functional:

- **Authentication:** Secure login, password management, and role-based access
- **Monetization:** Stripe integration for subscriptions (Pro/Enterprise) and one-time payments
- **Administration:** "Uber Mode" for system configuration, SOW generation, and visitor analytics

---

## Conclusion

LAVANDAR represents a shift from static dashboards to active, agentic intelligence. By combining rigorous engineering data with consumer-grade UX, it effectively "explains without explaining," making complex AI and environmental data accessible for decision-making.
`,
  },

  business_plan: {
    type: 'business_plan',
    name: 'Detailed Business Plan',
    status: 'ready',
    content: `# LAVANDAR Intelligence Platform - Business Plan

## The Sovereign AI for High-Stakes Aerospace

**Predictive, patented intelligence for global defense and enterprise security**

| Target Valuation | Core Patents | Algorithm Confidence |
|------------------|--------------|---------------------|
| $100M | 3 | 84.7%+ |

---

## The Patent Moat

*We own the mathematics of the modern battlefield (Rubin & Rubin)*

| Patent | Inventor | Description |
|--------|----------|-------------|
| US 2008/0195495 A1 | Victor Rubin | Hierarchical Threat Classification - Multi-source data aggregation and hierarchical threat classification. The foundational algorithm for categorizing "Friendly," "Unknown," and "Hostile" tracks in real-time. |
| US 10,082,945 B2 | Benzion Rubin | Exit-Intent Detection - Predictive exit-intent detection for intercept trajectory prediction. Identifies when aircraft deviate from commercial paths to tactical intercept trajectories. |
| Academic Research | Dr. Robert Rubin | Atmospheric Modeling - Precision tracking via Saemundsson-Meeus atmospheric refraction modeling. Enables 99.9% intercept window calculations through advanced environmental physics. |

---

## Market Opportunity

### Initial Wedge: UAV Navigation

| Metric | Value |
|--------|-------|
| Total Addressable Market | $7.5-18M |
| Defense Navigation (2034) | $271B |
| Total Expansion | $1 Trillion |

*750-1,200 celestial UAVs × $5-15K per platform*
*Defense navigation systems by 2034 (15.7% CAGR)*

### Expansion Markets

| Precision Munitions | Naval Systems | Submarines |
|---------------------|---------------|------------|
| $2.5M+ | $3.75M+ | $2.5M+ |

### Why Now

- Shield AI valued at $5.6B (Q4 2025)
- Tiltan acquired for $14M (GPS-denied nav)
- DDR&D startup funding 5x since Oct 2023

---

## Product & Traction

### What We Have

| Product | Status |
|---------|--------|
| Working API | lavandar.ai/alpha-os — Live demo |
| Academic Validation | Refraction confirmed as limiting factor |
| Edge SDK | Air-gapped architecture design complete |
| Market Research | 40+ pages validated strategy |

### Target Customers

| Customer | Status |
|----------|--------|
| Elbit Systems | Hermes UAV family integration — RESEARCHING |
| IAI | Heron / Navigation Center — RESEARCHING |
| DDR&D Innofense | Government validation program — Q1 2026 |
| GNC Engineers | 12 engineers identified — ACTIVE OUTREACH |

---

## Competitive Landscape

| Competitor | Position | Our Advantage |
|------------|----------|---------------|
| Shield AI | $5.6B Valuation | Full autonomy stack using standard atmospheric models. We are the precision layer they are missing. |
| Honeywell | Hardware Giant | Excellent star trackers. Needs atmospheric correction software partner. |
| IAI Nav Center | Gov Priority | Heavy on hardware/inertial. Software correction layer is a component gap. |

### Our Positioning

We're not competing with autonomy stacks — we are the atmospheric physics component they are all missing. The precision layer beneath celestial navigation.

### Why Primes Won't Build This

| Focus Problem | Certification Lock-in | Speed + Focus |
|---------------|----------------------|---------------|
| Primes optimize hardware. Software layer isn't prioritized until validated externally. | Once integrated, switching costs are high (12-18 months per system). | We ship in weeks. Prime internal projects take quarters. |

---

## Revenue Model

| Tier | Pricing | Description |
|------|---------|-------------|
| Developer | Free | API testing & validation |
| Pilot License | $2.5-5K | R&D project integration |
| Edge SDK | $25K+/yr | Air-gapped deployment |

### Revenue Path

| Year 1 | Year 2 | Year 3 |
|--------|--------|--------|
| $100-250K | $500K-1M | $2-5M |
| Pilot contracts | Production SDK + DDR&D | Prime integrations |

### Growth Phases

- **Phase 1:** Correction component ($5-15K/platform)
- **Phase 2:** Data layer ($50-100K/year/prime)
- **Phase 3:** "LAVANDAR Inside" standard

---

## Financial Projections

| Quarter | Revenue | Milestone |
|---------|---------|-----------|
| Q1 Y1 | $25K | Pilot contracts |
| Q2 Y1 | $50K | DDR&D engagement |
| Q3 Y1 | $100K | First LOI |
| Q4 Y1 | $150K | Production integration |
| Y2 Total | $500K-1M | SDK licensing |

---

## Why Israel (And Why Shibuya)

GPS denial is an Israeli problem first. 594 incidents daily. My family in the north experiences it every day.

Building in both Japan (Shibuya) and Israel, with partners who understand the operational context, is the right path for global expansion.

**When GPS fails over Israel 594 times a day, the backup better work.**

---

*lavandar.ai/alpha-os | admin@lavandar.ai | Tel Aviv + Shibuya*
`,
  },

  resume: {
    type: 'resume',
    name: 'Resume of Applicants',
    formNumber: 'Form 1-4 (Article 4)',
    status: 'ready',
    content: `# Resume of the Applicant

**Form 1-4 (Article 4)**

---

## Personal Information

| Field | Value |
|-------|-------|
| Name | Ben Rubin |
| Name (Katakana) | ベン・ルービン |
| Date of Birth | [To be filled] |
| Nationality | United States of America |
| Sex | Male |
| Current Address | Falmouth, MA USA → [Japan Residence TBD] |
| Phone Number | +1 530 204 9045 |
| Email | admin@lavandar.ai |

---

## Military Service

| Service | Details |
|---------|---------|
| Branch | Israel Defense Forces (IDF) |
| Unit | Paratroopers 890 |
| Status | Lone Soldier |
| Location | Kibbutz Sasa (Lebanese border) |

---

## Family Connection

Family in Kfar Vradim, northern Israel — experiencing GPS jamming daily. This isn't abstract.

---

## Current Business

| Field | Value |
|-------|-------|
| Company | LAVANDAR Intelligence Platform |
| Role | Founder |
| Website | lavandar.ai |
| Demo | lavandar.ai/alpha-os |
| Production | chrono-strata.lovable.app |

---

## Technical Expertise

- Atmospheric refraction correction algorithms
- Celestial navigation systems
- GPS-denied navigation solutions
- AI/ML predictive modeling
- Edge computing architecture
- Real-time data integration

---

## Patent Portfolio (Family)

| Patent | Inventor | Description |
|--------|----------|-------------|
| US 2008/0195495 A1 | Victor Rubin | Hierarchical Threat Classification |
| US 10,082,945 B2 | Benzion Rubin | Exit-Intent Detection |
| Academic Research | Dr. Robert Rubin | Atmospheric Modeling |

---

## Industry Focus

- Defense & Aerospace
- Autonomous Navigation
- Disaster Response & Humanitarian Aid
- Professional Sports Analytics

---

## Hiring Plans (With This Round)

| Role | Timeline | Purpose |
|------|----------|---------|
| GNC Engineer | Contractor, 6 months | Domain expertise for prime conversations |
| Defense BD Advisor | Immediate | Introductions to DDR&D, prime contacts |
| Part-time CTO | Month 3-4 | Edge SDK development lead |

---

## Why Shibuya

Initial inquiry to Shibuya Startup Support on January 9, 2026:

*"Kizuna Disaster Relief deploys teams and supplies to regions impacted by natural disasters, often in environments where GPS, communications, and infrastructure are degraded or unreliable. We are exploring technologies that improve positioning and navigation resilience when satellite-based systems are unavailable or compromised. Celestial and sensor-fusion navigation is a growing area of interest for emergency logistics, aviation, and maritime operations in disaster zones."*

**Shibuya City Response:** "Shibuya City prefers innovative and scalable business. Please kindly note that the final decision about eligibility will be decided by the Shibuya City."

---

## Family Status

| Field | Value |
|-------|-------|
| Spouse | No |
| Dependents | 0 |
| Obligation of sponsoring spouse | No |
`,
  },

  passport: {
    type: 'passport',
    name: 'Passport Copy',
    status: 'template',
    content: `# Passport Copy Requirements

## Applicant: Ben Rubin

## Required Pages
1. **Photo/Data Page** - Clear copy showing:
   - Full name: Ben Rubin
   - Nationality: United States of America
   - Date of birth
   - Passport number
   - Issue/Expiry dates
   - Photo

2. **Visa Pages** (if applicable)
   - Current Japan visa
   - Previous Japan entries

## Specifications
- Color copy preferred
- High resolution scan
- All text clearly legible
- No glare or shadows on photo

## Status
☐ Passport copy prepared
☐ All required pages included
☐ Quality verified
`,
  },

  photo: {
    type: 'photo',
    name: 'Passport-style Photo',
    status: 'template',
    content: `# Photo Requirements

## Applicant: Ben Rubin

## Specifications
- **Size:** 36-40mm height × 24-30mm width
- **Background:** White or light solid color
- **Recency:** Taken within last 6 months
- **Quality:** High resolution, clear focus

## Requirements
- Face clearly visible
- Neutral expression
- No glasses (if possible)
- No head coverings (except religious)
- Both ears visible

## Quantity
- 2-3 copies recommended

## Status
☐ Photo taken
☐ Specifications verified
☐ Copies prepared
`,
  },

  pledge: {
    type: 'pledge',
    name: 'Pledge Document',
    formNumber: 'Form 1-5 (Article 4)',
    status: 'ready',
    content: `# Pledge

**Form 1-5 (Article 4)**

**Submission Date:** January 18, 2026

**To:** Mayor of Shibuya City

---

## Applicant Information

| Field | Value |
|-------|-------|
| Nationality | United States of America |
| Address | Falmouth, MA USA → [Japan Residence TBD] |
| Contact Information | +1 530 204 9045 / admin@lavandar.ai |
| Name | Ben Rubin |

---

## Pledge Commitments

I hereby pledge the following in relation to my application for the Shibuya Startup Visa program:

### 1. Lawful Conduct
I will conduct all business activities in full compliance with Japanese laws and regulations.

### 2. Business Establishment
I will establish and operate a legitimate business (LAVANDAR Intelligence Platform) within Shibuya Ward during the visa period.

### 3. Financial Responsibility
I will maintain sufficient funds to support my business activities and personal living expenses during my stay in Japan.

### 4. Accurate Information
All information provided in my application is true and accurate to the best of my knowledge.

### 5. Cooperation
I will cooperate fully with Shibuya Ward Office in any verification or review processes.

### 6. Notification
I will promptly notify Shibuya Ward Office of any significant changes to my business plan or circumstances.

### 7. Business Development
I commit to developing my business as outlined in my submitted Schedule of Business Activity:
- Establish Japan office presence in Month 1
- Launch pilot programs by Month 3
- Achieve revenue milestones by Month 6

---

## Business Context

LAVANDAR provides high-precision atmospheric refraction correction for celestial navigation systems, improving accuracy for GPS-denied environments including:
- Disaster response corridors
- Humanitarian air delivery
- Maritime relief routing
- Defense and autonomous navigation

This technology aligns with Shibuya Startup Support's programs for deep-tech startups in global resilience, emergency response, and autonomous navigation.

---

## Signature

| Field | Value |
|-------|-------|
| Date | January 18, 2026 |
| Applicant Name | Ben Rubin |
| Signature | [To be signed] |
`,
  },

  residence_proof: {
    type: 'residence_proof',
    name: 'Proof of Residence (6 months)',
    status: 'template',
    content: `# Proof of Residence Requirements

## Applicant: Ben Rubin

## Required Documents
1. **Rental Contract** showing:
   - Minimum 6-month lease term
   - Address in Japan (preferably Shibuya Ward)
   - Landlord information
   - Monthly rent amount

2. **Alternative Documents** (if rental contract unavailable):
   - Hotel reservation for initial period
   - Temporary housing arrangement
   - Corporate housing agreement

## Specifications
- Contract must be in Japanese or with certified translation
- Clear copy of all pages
- Signatures visible

## Status
☐ Residence identified
☐ Contract signed
☐ Copy prepared
`,
  },

  bank_statement: {
    type: 'bank_statement',
    name: 'Bank Account Balance Statement',
    status: 'template',
    content: `# Bank Account Balance Statement

## Applicant: Ben Rubin

## Required Information
- Current balance sufficient for 6-month operations
- Account holder name matching passport
- Recent statement (within 30 days)

## Recommended Balance
- Minimum: ¥3,000,000 (approx. $20,000)
- Recommended: ¥5,000,000+ for stronger application

## Funding Sources
- Self-funded initial capital
- Angel investment
- Pilot contract revenue (projected $100-250K Year 1)

## Status
☐ Statement obtained
☐ Translation completed (if needed)
☐ Balance sufficient
`,
  },

  education_work: {
    type: 'education_work',
    name: 'Education/Work Verification',
    status: 'template',
    content: `# Education and Work Verification Documents

## Applicant: Ben Rubin

## Education Documents
☐ University degree certificates
☐ Transcripts
☐ Professional certifications

## Work Experience
☐ Employment letters
☐ Reference letters
☐ Portfolio of work

## Military Service
| Service | Details |
|---------|---------|
| Branch | Israel Defense Forces (IDF) |
| Unit | Paratroopers 890 |
| Status | Lone Soldier |
| Location | Kibbutz Sasa (Lebanese border) |

☐ Military service documentation

## Current Business
| Field | Value |
|-------|-------|
| Company | LAVANDAR Intelligence Platform |
| Role | Founder |
| Website | lavandar.ai |

☐ Business registration documents
☐ Company portfolio
☐ Client testimonials

## Status
☐ All documents collected
☐ Translations completed
☐ Certified copies prepared
`,
  },
};

export const getDocumentContent = (type: string): DocumentContent | null => {
  return visaDocumentContents[type] || null;
};
