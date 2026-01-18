// Pre-filled document content based on Shibuya Startup Visa requirements for LAVANDAR

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

**Submission Date:** [To be filled]

**To:** Mayor of Shibuya City

---

## Applicant Information

| Field | Value |
|-------|-------|
| Nationality | [Your Nationality] |
| Address | [Your Address in Japan] |
| Contact Information | [Phone/Email] |
| Name | [Your Full Name] |

---

## Declaration

I hereby apply for the confirmation of Notification No. 5-6 according to the Notification No. 5-4 specified under program to foster international entrepreneurship.

---

## Required Attachments Checklist

| # | Document | Check |
|---|----------|-------|
| 1 | Business Startup Activities Confirmation Application | ☐ |
| 2 | Schedule of business activity | ☐ |
| 3 | Resume of the applicants | ☐ |
| 4 | Pledge | ☐ |
| 5 | Proof of residence for 6 months (rental contract) | ☐ |
| 6 | Bank account balance statement | ☐ |
| 7 | Education/work verification documents | ☐ |
| 8 | Copy of passport | ☐ |
| 9 | Additional business plan documents | ☐ |
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
**Industry Field:** Information Technologies  

---

## Platform Description

The LAVANDAR Intelligence Platform is a multi-vertical operational ecosystem that integrates real-time environmental data, predictive AI modeling, and agentic workflows into a unified user interface.

The platform demonstrates a "write once, deploy everywhere" architecture, successfully adapting a core intelligence engine (STRATA) across distinct industries including:
- Aviation
- Marine
- Construction
- Events
- Professional Sports

---

## Core Value Propositions

### 1. Vertical Adaptability (STRATA)
The system uses a singular codebase to generate industry-specific intelligence. Wind data is interpreted differently for:
- Crane operators (Construction)
- Pilots (Aviation)
- Stadium managers (Events)

### 2. Agentic AI Architecture
Moving beyond simple chatbots, the platform features an Agentic Matchup Engine with tool-calling architecture to autonomously fetch live weather, player stats, and historical data.

### 3. Design as a Differentiator
Utilizing the LAVANDAR Design System (inspired by Kengo Kuma), featuring specialized components:
- TimberCard
- ShojiReveal
- KumikoLattice

### 4. Real-Time Operations
Leveraging Supabase Realtime and Edge Functions for:
- Live presence tracking
- Game score updates (ESPN API)
- Environmental monitoring

---

## Technical Architecture

| Component | Technology | Implementation |
|-----------|------------|----------------|
| Frontend | React / Lovable | High-performance UI with Framer Motion |
| Backend | Supabase / Edge Functions | 27 deployed Edge Functions |
| AI Layer | OpenAI / ML Models | Custom models with SHAP explainability |
| Commerce | ECOMFORGE | AI-native commerce with Shopify/Stripe |
| Data | External APIs | OpenSky, ESPN, Weather APIs |

---

## Strategic Readiness

The platform is deployed in production at: chrono-strata.lovable.app

**Functional Systems:**
- ✅ Authentication (secure login, role-based access)
- ✅ Monetization (Stripe subscriptions)
- ✅ Administration (system configuration, analytics)
`,
  },

  schedule: {
    type: 'schedule',
    name: 'Schedule of Business Activity',
    formNumber: 'Form 1-3 (Article 4)',
    status: 'draft',
    content: `# Schedule of Business Activity

**Form 1-3 (Article 4)**

---

## 6-Month Business Activity Schedule

| Month | Period | Business Activities | Capital/Funding |
|-------|--------|---------------------|-----------------|
| **1** | Month 1 | Platform deployment and Japan market research. Establish office presence in Shibuya. Begin customer discovery. | Initial capital: Self-funded + Angel investment |
| **2** | Month 2 | Develop Japan-specific STRATA vertical. Integrate Japan weather APIs (JMA). Build local partnerships. | Operating expenses from reserves |
| **3** | Month 3 | Launch beta with 3-5 pilot customers in Construction/Events verticals. Refine localization. | Revenue: Pilot subscriptions |
| **4** | Month 4 | Expand to 10+ enterprise customers. Implement Yen-based Stripe payments. Hire first Japan-based team member. | Revenue growth + potential seed round |
| **5** | Month 5 | Full commercial launch. Marketing campaign targeting Japan market. Conference presentations. | Reinvested revenue |
| **6** | Month 6 | Achieve break-even in Japan operations. Document business growth for visa extension. | Sustainable operations |

---

## Extended Schedule (Months 7-12)

| Month | Period | Business Activities | Capital/Funding |
|-------|--------|---------------------|-----------------|
| **7** | Month 7 | Scale enterprise sales team. Add Aviation vertical for Japan airports. | Series A preparation |
| **8** | Month 8 | Partnership with Japan sports organizations (NPB, J.League). | Strategic partnerships |
| **9** | Month 9 | Expand office space. Hire 3-5 additional team members. | Growth capital |
| **10** | Month 10 | Achieve 50+ enterprise customers in Japan. Prepare extension documentation. | Revenue milestone |
| **11** | Month 11 | Begin Status of Residence application. Document all achievements. | Continued operations |
| **12** | Month 12 | Establish Japan subsidiary (KK). Complete corporate registration. | Capital increase |

---

## Key Milestones

1. **Corporate Registration** - Month 4
2. **First Revenue in Japan** - Month 3
3. **Break-even** - Month 6
4. **Team Expansion** - Month 8
5. **Subsidiary Formation** - Month 12

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

The platform demonstrates a "write once, deploy everywhere" architecture, successfully adapting a core intelligence engine (STRATA) across distinct industries including Aviation, Marine, Construction, Events, and Professional Sports.

---

## 2. Core Value Propositions

### Vertical Adaptability (STRATA)
The system uses a singular codebase to generate industry-specific intelligence. For example, wind data is interpreted differently for a crane operator (Construction) versus a pilot (Aviation) or a stadium manager (Events).

### Agentic AI Architecture
Moving beyond simple chatbots, the platform features an Agentic Matchup Engine utilizing tool-calling architecture to autonomously fetch live weather, player stats, and historical data.

### Design as a Differentiator
The platform utilizes the LAVANDAR Design System (inspired by Kengo Kuma), featuring specialized components that bridge complex engineering data and high-end marketing aesthetics.

### Real-Time Operations
Leveraging Supabase Realtime and Edge Functions for live presence tracking, game score updates, and environmental monitoring without page refreshes.

---

## 3. Technical Architecture

| Component | Technology | Implementation |
|-----------|------------|----------------|
| Frontend | React / Lovable | High-performance UI with Framer Motion |
| Backend | Supabase | 27 deployed Edge Functions |
| AI Layer | OpenAI / ML Models | Custom models with SHAP explainability |
| Commerce | ECOMFORGE | Shopify Storefront API + Stripe |
| Data | External APIs | OpenSky, ESPN, Weather APIs |

---

## 4. Key Product Suites

### A. STRATA (Vertical Intelligence)
- Aviation: METAR/TAF parsing and ceiling/visibility analysis
- Marine: Wave height, tide predictions, port intelligence
- Construction: Crane wind limits and concrete pour windows
- Events: Lightning detection and crowd safety protocols

### B. INTELLIGENCE SUITE (AI)
- Matchup Engine with proactive AI triggers
- Predictive modeling with ML confidence visualization
- Player-weather correlation analysis

### C. SPORTS & GAME DAY
- Live dashboard with weather overlays
- Real-time game tracking

---

## 5. Strategic Readiness

**Production URL:** chrono-strata.lovable.app

**Deployed Systems:**
- ✅ Authentication (secure login, role-based access)
- ✅ Monetization (Stripe subscriptions)
- ✅ Administration (system configuration, analytics)

---

## Conclusion

LAVANDAR represents a shift from static dashboards to active, agentic intelligence. By combining rigorous engineering data with consumer-grade UX, it effectively "explains without explaining," making complex AI and environmental data accessible for decision-making.
`,
  },

  business_plan: {
    type: 'business_plan',
    name: 'Detailed Business Plan',
    status: 'draft',
    content: `# LAVANDAR Intelligence Platform - Business Plan

## Japan Market Entry Strategy

### Target Market
- Enterprise weather-sensitive operations in Japan
- Sports organizations (NPB, J.League)
- Construction companies
- Event management firms
- Aviation operators

### Revenue Model
- SaaS subscriptions (Pro: ¥50,000/mo, Enterprise: ¥200,000/mo)
- Custom integrations and consulting
- API access licensing

### Competitive Advantage
- Multi-vertical platform vs. single-purpose tools
- AI-native architecture with explainability
- Real-time edge processing
- Japanese market localization

### Go-to-Market
1. Direct enterprise sales
2. Partnership with local integrators
3. Conference marketing
4. Content marketing (case studies)

### Financial Projections
- Year 1: ¥12M revenue (24 customers)
- Year 2: ¥48M revenue (100 customers)
- Year 3: ¥120M revenue (250 customers)
`,
  },

  financial_projections: {
    type: 'financial_projections',
    name: 'Financial Projections (2 Years)',
    status: 'draft',
    content: `# Financial Projections - 2 Year Outlook

## Revenue Projections

| Quarter | Customers | MRR (¥) | ARR (¥) |
|---------|-----------|---------|---------|
| Q1 Y1 | 5 | 250,000 | 3,000,000 |
| Q2 Y1 | 12 | 600,000 | 7,200,000 |
| Q3 Y1 | 20 | 1,000,000 | 12,000,000 |
| Q4 Y1 | 30 | 1,500,000 | 18,000,000 |
| Q1 Y2 | 45 | 2,250,000 | 27,000,000 |
| Q2 Y2 | 65 | 3,250,000 | 39,000,000 |
| Q3 Y2 | 90 | 4,500,000 | 54,000,000 |
| Q4 Y2 | 120 | 6,000,000 | 72,000,000 |

## Expense Projections

| Category | Year 1 (¥) | Year 2 (¥) |
|----------|------------|------------|
| Infrastructure | 2,400,000 | 4,800,000 |
| Salaries | 6,000,000 | 18,000,000 |
| Marketing | 1,200,000 | 3,600,000 |
| Office | 1,800,000 | 3,600,000 |
| Legal/Admin | 600,000 | 1,200,000 |
| **Total** | **12,000,000** | **31,200,000** |

## Profitability

- Break-even: Month 8-10
- Year 1 Net: ¥6,000,000
- Year 2 Net: ¥40,800,000
`,
  },

  resume: {
    type: 'resume',
    name: 'Resume of Applicants',
    formNumber: 'Form 1-4 (Article 4)',
    status: 'template',
    content: `# Resume of the Applicant

**Form 1-4 (Article 4)**

---

## Personal Information

| Field | Value |
|-------|-------|
| Name | [Full Name] |
| Name (Katakana) | [カタカナ] |
| Date of Birth | [YYYY/MM/DD] (Age: XX) |
| Nationality | [Country] |
| Sex | [Male/Female] |
| Current Address | [Japan Address] |
| Phone Number | [Contact Number] |

---

## Academic Background

| Year | Month | Institution / Details |
|------|-------|----------------------|
| [Year] | [Month] | [University Name] - [Degree] |
| [Year] | [Month] | [Previous Education] |

---

## Work Experience

| Year | Month | Company / Role |
|------|-------|----------------|
| [Year] | [Month] | [Company] - [Position] |
| [Year] | [Month] | [Previous Role] |

---

## Licenses & Qualifications

- [Relevant certifications]
- [Technical qualifications]
- [Language proficiencies]

---

## Special Notes

[Additional relevant information about entrepreneurial experience, technical expertise, or achievements]

---

## Family Status

| Field | Value |
|-------|-------|
| Spouse | Yes / No |
| Dependents | [Number] |
| Obligation of sponsoring spouse | Yes / No |
`,
  },

  passport: {
    type: 'passport',
    name: 'Passport Copy',
    status: 'template',
    content: `# Passport Copy Requirements

## Required Pages
1. **Photo/Data Page** - Clear copy showing:
   - Full name
   - Nationality
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

**Submission Date:** [To be filled]

**To:** Mayor of Shibuya City

---

## Applicant Information

| Field | Value |
|-------|-------|
| Nationality | [Your Nationality] |
| Address | [Your Address] |
| Contact Information | [Phone/Email] |
| Name | [Your Full Name] |

---

## Pledge Commitments

I hereby pledge the following:

### 1. Compliance
I will comply with the Guidelines for the Implementation of the Promotion of Preparatory Activities for International Entrepreneurs of Shibuya City, and follow the instruction of Shibuya Ward staff according to the Guidelines.

### 2. Protection of Proprietary Information
I shall legally protect and take responsibility for the technical and managerial proprietary information written on the application and attached documents by taking legal measures to protect them in advance.

### 3. Document Retention
I acknowledge that Shibuya City will retain and not return the application forms and related documents containing personal information that I submitted.

### 4. Use of Personal Information
I agree that Shibuya City will use my personal information only for the purpose of confirming my startup activities. I agree that Shibuya City may disclose the information to the Director General of the Tokyo Immigration Bureau.

### 5. Monthly Interviews
I will make myself available for an interview **at least once a month** from the time I land or change my status of residence to the time I acquire "Business Manager" residential status, to:
- Report the progress of startup activities
- Explain the schedule
- Submit documents (e.g., bank statements)
- Respond to other requests by Shibuya City

### 6. Return Commitment
I will return to my home country before my status of residence expires if Shibuya City determines that continuous startup activity is not feasible.

### 7. Account Closure
When I leave Japan without renewing my visa, I will withdraw all money from personal and corporate bank accounts I opened in Japan and close them.

### 8. Community Contribution
I will actively cooperate with startup support projects conducted by Shibuya City Office and endeavor to contribute to the formation of an ecosystem and community.

---

**Signature:** ________________________

**Date:** ________________________
`,
  },

  residence_proof: {
    type: 'residence_proof',
    name: 'Proof of Residence in Japan',
    status: 'template',
    content: `# Proof of Residence Requirements

## Acceptable Documents
1. **Rental Contract** - showing 6+ month lease
2. **Rental Application** - if contract pending
3. **Hotel/Residence Confirmation** - temporary accommodation
4. **Guarantor Letter** - from host/sponsor

## Required Information
- Full address in Japan
- Lease period (minimum 6 months)
- Landlord/property information
- Monthly rent amount

## Status
☐ Accommodation secured
☐ Contract signed/pending
☐ Copy prepared
`,
  },

  office_lease: {
    type: 'office_lease',
    name: 'Office Lease Agreement',
    status: 'template',
    content: `# Office Lease Agreement

## Options for LAVANDAR Operations

### Option A: Co-working Space
- **Location:** Shibuya area
- **Type:** Hot desk / Dedicated desk
- **Cost:** ¥30,000-80,000/month
- **Benefit:** Immediate availability, flexible terms

### Option B: Virtual Office
- **Location:** Shibuya registered address
- **Services:** Mail handling, meeting rooms
- **Cost:** ¥10,000-30,000/month
- **Benefit:** Low cost, professional address

### Option C: Private Office
- **Location:** Shibuya/Shibuya-ku
- **Size:** 10-20 sqm initially
- **Cost:** ¥100,000-200,000/month
- **Benefit:** Dedicated space, scalable

## Required for Application
☐ Office address confirmed
☐ Lease/membership agreement
☐ Copy of contract prepared

## Status
[To be determined based on selected option]
`,
  },
};

export const getDocumentContent = (documentType: string): DocumentContent | undefined => {
  return visaDocumentContents[documentType];
};

export const getAllDocumentContents = (): DocumentContent[] => {
  return Object.values(visaDocumentContents);
};
