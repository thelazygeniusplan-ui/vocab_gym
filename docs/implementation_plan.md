# Vocab Gym V2.7 - Implementation Plan

## Goal Description
Build a "High-Intensity Interval Learning" (HIIL) web application for SAT vocabulary mastery. The app features a "Cyber-Noir" aesthetic, a "Trainee Bot" persona, and a strict "3-Loop Spiral" pedagogical method. The system is conceptually managed by 5 "Agents" (Architect, Developer, Asset, QC, BI).

## User Review Required
> [!IMPORTANT]
> - Confirmation on Supabase and Shotstack API keys availability.
> - Validation of the "Cyber-Noir" color palette specifics (#121212 background, Neon Blue/Purple accents).

## Proposed Changes

### Project Setup
- **Framework**: Next.js (React) for a robust, interactive web app.
- **Styling**: Tailwind CSS for rapid, custom design (Noir theme).
- **State Management**: React Context or Zustand for Agent states and Loop progress.

### [Software Developer] System Architecture
#### [NEW] `src/lib/agents/`
- `architect.ts`: Logic for curriculum and hints.
- `developer.ts`: API clients and system logic.
- `asset.ts`: Placeholder for asset generation.
- `qc.ts`: Validation logic.
- `bi.ts`: Analytics tracking.

### [Asset Agent] Cyber-Noir UI
#### [NEW] `src/styles/globals.css`
- Custom CSS variables for Neon Blue, Neon Purple, and Charcoal backgrounds.
- CRT/Glitch effects for the "Cyber-Noir" vibe.

### [Software Developer] Modular Stations
#### [NEW] `src/app/station-a/page.tsx` (Student Dojo)
- Embeddable in Gather.town iframe.
- Contains the 3-Loop Spiral logic.
- Displays "Sign-Off Hash" for copy-paste.

#### [NEW] `src/app/station-b/page.tsx` (Facilitator Dashboard)
- Private view for the coach.
- Input field to verify student hashes.
- Real-time status of "Active Practice" block.

### [Pedagogical Architect] Bundle 01 & Rotation
- **Bundle 01**: Bolster, Anomalous, Ambivalent, Qualify, Paucity.
- **Rotation Flow**: 15-minute timer block.
    - 0-3m: Loop 0 (Shadow)
    - 3-10m: Loop 2 (Synthesis)
    - 10-15m: Loop 3 (Mastery & Trainee Bot)

#### [MODIFY] [SignOffModule.tsx](file:///c:/Users/USER/Documents/workspace/vocab_gym_v2.7/src/components/SignOffModule.tsx)
#### [NEW] [deployment_plan.md](file:///C:/Users/USER/.gemini/antigravity/brain/9d8496e9-1a4a-414c-80d3-0bb4a44c27ca/deployment_plan.md)

## Phase 5: Content Production (Video)
We will transition from placeholders to real "Cyber-Noir" video assets.

### Script: `scripts/generate_assets.ts`
- **Purpose**: Batch render "Bundle 01" words using Shotstack API.
- **Input**: `Architect` corpus (Words + Definitions).
- **Process**:
    1.  Generate JSON Payload via `AssetAgent`.
    2.  POST to `https://api.shotstack.io/stage/render`.
    3.  Poll for status.
    4.  Output list of `videoUrl`s.
- **Output**: A JSON mapping of `word -> videoUrl`.

### Integration
- **Update**: `CurriculumItem` interface to include `videoUrl`.
- **Update**: `LoopContainer.tsx` to play `<video>` instead of placeholder.

### [BI Agent] Unit Economics
- Track cost per 1-hour session for 20 students.
### [Software Developer] Supabase & Fatigue Logic
#### [NEW] `src/lib/supabase_client.ts`
- Real connection using environment variables (or graceful fallback).
- `trackFatigue(word_id, user_id, error_count)`: Updates error rates.
- `getForgottenFactors(user_id)`: Fetches words with high decay rates.

### [Asset Agent] Shotstack Integration
- **JSON Payload Generator**: Create a dedicated method to structure Shotstack edits.
- **Assets**: Text overlays, Cyber-Noir background assets, and Audio timing.

### [Pedagogical Architect] Expanded Corpus (Bundles 02-05)
- **Scale**: Add 20 new words (Total 25 with Bundle 01).
- **Cryptic Hints**: Loop 0 prompts should be less direct (e.g., "A ghost in the machine of time..." for 'Ephemeral').

### [BI Agent] Video Scale Economics
- **New Metric**: Rendering Cost.
- **Formula**: 20 students * 5 videos * $0.05/min render cost.

### [QC Agent] Completion Hash 2.0
- **Input**: Student ID field in `SignOffModule`.
- **Hash Algo**: `Base64(SessionID + StudentID + Salt)`.

## Verification Plan
### Manual Verification
- **Hash Check**: Confirm Hash changes when Student ID changes.
- **Cost Check**: Verify BI logs reflect the video rendering costs.
- **Corpus Check**: Verify random selection from new bundles in Station A.
