---
name: organize-idea
description: Create or organize a SaaS idea into the standard project structure. Use when the user says "new idea", "organize idea", or wants to set up/reorganize a project in ~/Ideas/. Works for both new and existing projects.
---

# Organize Idea

Create or organize a SaaS project into the standard folder structure at `~/Ideas/<ProjectName>/`.

## Safety Rules

- **NEVER delete any files or folders**
- **NEVER overwrite existing files**
- When moving files, always verify the destination doesn't already have a file with the same name
- If unsure where something belongs, leave it in place and tell the user
- Show the user what you plan to move BEFORE moving anything and get confirmation

## Folder Structure

Every idea gets this structure. Create all folders that don't already exist. Folders are numbered so they sort in logical lifecycle order in Finder and file explorers:

```
<ProjectName>/
├── 01 Idea/
│   ├── 01a Problem Discovery/
│   ├── 01b Market Research/
│   ├── 01c Niche Selection/
│   ├── 01d Competitor Analysis/
│   └── 01e Opportunity Mapping/
│
├── 02 Validation/
│   ├── 02a Customer Interviews/
│   ├── 02b Landing Page Test/
│   ├── 02c Waitlist/
│   ├── 02d Pre Sales/
│   └── 02e Demand Testing/
│
├── 03 Planning/
│   ├── 03a Product Roadmap/
│   ├── 03b Feature Prioritization/
│   ├── 03c MVP Scope/
│   ├── 03d Tech Stack/
│   └── 03e Development Plan/
│
├── 04 Design/
│   ├── 04a Wireframes/
│   ├── 04b UI Design/
│   ├── 04c UX Flows/
│   ├── 04d Prototype/
│   └── 04e Design System/
│
├── 05 Development/
│   ├── 05a Frontend/
│   ├── 05b Backend/
│   ├── 05c APIs/
│   ├── 05d Database/
│   ├── 05e Authentication/
│   └── 05f Integrations/
│
├── 06 Infrastructure/
│   ├── 06a Cloud Hosting/
│   ├── 06b DevOps/
│   ├── 06c CI CD/
│   ├── 06d Monitoring/
│   └── 06e Security/
│
├── 07 Testing/
│   ├── 07a Unit Testing/
│   ├── 07b Integration Testing/
│   ├── 07c Bug Fixing/
│   ├── 07d Performance Testing/
│   └── 07e Beta Testing/
│
├── 08 Launch/
│   ├── 08a Landing Page/
│   ├── 08b Product Hunt/
│   ├── 08c Beta Users/
│   ├── 08d Early Adopters/
│   └── 08e Public Release/
│
├── 09 Acquisition/
│   ├── 09a SEO Wins/
│   ├── 09b Content Marketing/
│   ├── 09c Social Media/
│   ├── 09d Cold Email/
│   ├── 09e Influencer Outreach/
│   └── 09f Affiliate Marketing/
│
├── 10 Distribution/
│   ├── 10a Directories/
│   ├── 10b SaaS Marketplaces/
│   ├── 10c Communities/
│   ├── 10d Partnerships/
│   └── 10e Integrations/
│
├── 11 Conversion/
│   ├── 11a Sales Funnel/
│   ├── 11b Free Trial/
│   ├── 11c Freemium Model/
│   ├── 11d Pricing Strategy/
│   └── 11e Checkout Optimization/
│
├── 12 Revenue/
│   ├── 12a Subscriptions/
│   ├── 12b Upsells/
│   ├── 12c Add-ons/
│   ├── 12d Annual Plans/
│   └── 12e Enterprise Deals/
│
├── 13 Analytics/
│   ├── 13a User Tracking/
│   ├── 13b Funnel Analysis/
│   ├── 13c Cohort Analysis/
│   ├── 13d KPI Dashboard/
│   └── 13e A-B Testing/
│
├── 14 Retention/
│   ├── 14a User Onboarding/
│   ├── 14b Email Automation/
│   ├── 14c Customer Support/
│   ├── 14d Feature Adoption/
│   └── 14e Churn Reduction/
│
├── 15 Growth/
│   ├── 15a Referral Programs/
│   ├── 15b Community Building/
│   ├── 15c Product Led Growth/
│   ├── 15d Viral Loops/
│   └── 15e Expansion Strategy/
│
└── 16 Scaling/
    ├── 16a Automation/
    ├── 16b Hiring/
    ├── 16c Systems/
    ├── 16d Global Expansion/
    └── 16e Exit Strategy/
```

## Steps

### 1. Identify the project

Ask for the project name if not provided. Set `BASE=~/Ideas/<ProjectName>`.

### 2. Create the structure

Run `mkdir -p` for every subfolder listed above. This is safe — it only creates what doesn't exist.

### 3. If the project already had files, organize them

Scan all existing files and folders at the root level and any non-standard subfolders (anything that doesn't match the numbered folder pattern). For each item:

- Read the file or inspect the folder contents to understand what it is
- Determine which category and subfolder it belongs in based on its content
- **Common mappings:**
  - Competitor docs, market analysis → `01 Idea/01d Competitor Analysis` or `01 Idea/01b Market Research`
  - One-pagers, pitch decks, specs → `03 Planning/03c MVP Scope` or `03 Planning/03a Product Roadmap`
  - Wireframes, mockups, Figma exports → `04 Design/04a Wireframes` or `04 Design/04b UI Design`
  - Code repos, source files → `05 Development/` (appropriate subfolder)
  - SEO content, blog posts → `09 Acquisition/09b Content Marketing` or `09 Acquisition/09a SEO Wins`
  - Pricing docs → `11 Conversion/11d Pricing Strategy`
  - User research, interview notes → `02 Validation/02a Customer Interviews`
  - Launch checklists → `08 Launch/` (appropriate subfolder)
  - Meeting notes, call transcripts → categorize by topic discussed
  - Domain research → `01 Idea/01b Market Research`

### 4. Present the plan

Show the user a table of proposed moves:

```
| File/Folder              | From                  | To                                    |
|--------------------------|-----------------------|---------------------------------------|
| competitor-analysis.md   | ./                    | 01 Idea/01d Competitor Analysis/      |
| pricing-v2.xlsx          | ./docs/               | 11 Conversion/11d Pricing Strategy/   |
```

If any files are ambiguous, list them separately and ask the user where they should go.

### 5. Execute after confirmation

Only move files after the user confirms. Use `mv` for each file individually — no bulk operations.

### 6. Report

Show the final state: how many folders exist, how many files were organized, and any files left in place.
