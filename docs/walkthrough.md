# Vocab Gym V2.7 - Walkthrough

## Overview
The "Vocab Gym V2.7" has evolved into a **Modular Reality** platform designed for live coached sessions in Gather.town and Zoom. The system now operates via two distinct stations and includes the "Bundle 01" corpus.

## Features Implemented

### 1. Modular Stations (Phase 3 Updates)
- **Station A (Student Dojo)** (`/station-a`):
    - **Student ID Lock**: Users must enter a Student ID (e.g., STU-001) to arm the "Exit Sprint".
    - **Hash 2.0**: Generates `SESSION-ID-RANDOM` for secure verification.
- **Station B (Facilitator Dashboard)** (`/station-b`):
    - **Smart Verification**: Parses and displays the Student ID from valid hashes.
    - **Session Metrics**: Tracks 20-student session costs including video rendering.

### 2. Expanded Corpus (Bundles 01-05)
- **Total Words**: 25 High-Frequency SAT Words (Bolster, Ephemeral, Mitigate, Obsequious, Substantiate, etc.).
- **Cryptic Hints**: Loop 0 prompts are now "Phantom" hints (Category + Antonym only) to force deep processing.
- **Asset Engine**: `AssetAgent` now generates render-ready Shotstack JSON payloads.

### 3. Integration & Scaling
- **Supabase Client**: `src/lib/supabase_client.ts` implemented for Fatigue tracking (mocked for offline dev).
- **Unit Economics**: BI Agent now calculates "Video Rendering Cost" (5 videos * $0.05/min * 20 students).

## Verification Results
### Build Status
- `npm run lint`: **PASSED**.
- `npm run build`: **PASSED** (Next.js 16.1.6).

### Manual Test Scenarios
1.  **Station A**: Enter "STU-001" -> Complete Sprint -> Copy Hash `SESSION-STU001-XYZ`.
2.  **Station B**: Paste Hash -> System validates and displays "STUDENT ID: STU-001".
3.  **BI Agent**: Logs estimated session cost (~$15.50 for 20 students + 100 videos).

## Verification Results
### Build Status
- `npm run lint`: **PASSED**.
- `npm run build`: **PASSED** (Next.js 16.1.6 production build).

### Manual Test Scenarios
1.  **Station A Flow**: Student opens Dojo -> Timer starts -> Completes Loop 3 -> Copies Hash.
2.  **Station B Flow**: Coach receives Hash -> Pastes in Dashboard -> "VALID HASH" verified.
3.  **Rotation Logic**: Timer correctly indicates "PHASE: LOOP_0" to "LOOP_3" as minutes pass.
