# Vocab Gym — Project Context
*Last updated: 2026-02-22. Keep this file current after every major session.*

---

## What This Project Is

**Vocab Gym V2.7** is a "High-Intensity Interval Learning" (HIIL) web app for SAT vocabulary mastery. It runs as an iframe inside Gather.town for live coached classroom sessions. The core pedagogical method is the **3-Loop Spiral**:

- **Loop 0 (Shadow):** Cryptic hint only — student guesses the word
- **Loop 1 (Cinema):** A short video plays showing the word in a Cyber-Noir visual context
- **Loop 2 (Synthesis):** Student defines the word in their own words (>3 chars)
- **Loop 3 (Mastery):** Trainee Bot makes a deliberate error — student corrects it (>10 chars)

On completion, the word is logged to Supabase and the student moves to the next word automatically.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (Turbopack) |
| Styling | Tailwind CSS (Cyber-Noir theme) |
| Database | Supabase (Postgres + Realtime) |
| Video rendering | Shotstack API |
| Auth (Station B) | Next.js proxy middleware + httpOnly cookie |
| Hosting | Vercel (auto-deploys from GitHub main) |
| Package manager | npm |

---

## Architecture

### Two Stations
- **Station A (`/station-a`)** — Student Dojo. Embeddable in Gather.town iframe. Students enter their ID once at the start, then work through the 3-Loop Spiral word by word.
- **Station B (`/station-b`)** — Facilitator Dashboard. Password-protected. Shows live completion feed from Supabase in real time. Login at `/station-b/login`.

### Five Agents (conceptual, in `src/lib/agents/`)
- `architect.ts` — Curriculum, corpus, shadow hints, Trainee Bot errors
- `asset.ts` — Shotstack payload generator, image/audio prompt generators
- `developer.ts` — Supabase init, 70/30 intake logic (mocked)
- `qc.ts` — Definition validation, code audit (not yet wired to UI)
- `bi.ts` — Session cost tracking

### Key Components
- `LoopContainer.tsx` — Core learning loop. Cycles through all 25 corpus words. Accepts `currentPhase` prop from session timer.
- `SignOffModule.tsx` — **Deprecated/unused.** Replaced by Supabase auto-submit flow.
- `TraineeBot.tsx` — Displays the bot's deliberate error in Loop 3.

### Key Lib Files
- `src/lib/supabase_client.ts` — Real Supabase client. Exports `logCompletion()`, `trackFatigue()`, `getForgottenFactors()`.
- `src/lib/hash.ts` — Hash utility (kept but no longer central to flow).
- `src/proxy.ts` — Next.js 16 proxy (middleware) protecting `/station-b`.

---

## Corpus

25 words across 5 bundles in `src/lib/agents/architect.ts`.

**Bundle 01 (IDs 1–5):** bolster, anomalous, ambivalent, qualify, paucity — have video URLs (`/videos/*.mp4`) and rich data.
**Bundle 02 (IDs 6–10):** ephemeral (has video), pragmatic, venerable, condone, aesthetic — ephemeral has video, others do not.
**Bundles 03–05 (IDs 11–25):** mitigate, reticent, mundane, zeal, paradox, obsequious, revere, digression, intuitive, scrutinize, substantiate, benevolent, emulate, prudent, inevitable — **no video URLs, thinner data (fewer synonyms/antonyms).**

Target corpus: 150 words minimum (currently 25). Long-term: 500 words.

---

## Supabase Setup Required

The `completions` table must be created manually in Supabase dashboard:

| Column | Type | Default |
|---|---|---|
| `id` | `uuid` | `gen_random_uuid()` |
| `student_id` | `text` | — |
| `word` | `text` | — |
| `completed_at` | `timestamptz` | `now()` |

**Also:** Enable Realtime for the `completions` table (Table Editor → Realtime toggle).

---

## Environment Variables

### Local (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://zhjwugjshufbtnavrncd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PbJkUD3Bgk6xuwDRAORKaw_Bo5B4WX-
FACILITATOR_PASSWORD=coach123
```

### Vercel (must be added manually in Project Settings)
- `NEXT_PUBLIC_SUPABASE_URL` ✅ already set
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ already set
- `SHOTSTACK_API_KEY` ✅ already set
- `ELEVENLABS_API_KEY` ✅ already set
- `FACILITATOR_PASSWORD` ⚠️ **not yet added — needs to be added**

---

## Image & Video Strategy

### Current State
All existing videos use a single hardcoded background image (SynthWave VS Code theme from GitHub). Bundles 01 + ephemeral have rendered MP4s stored in `public/videos/`. Everything else shows "[VIDEO FEED OFFLINE]".

### Decided Approach
Image quality is the **core differentiator** for memory encoding. Do not compromise quality for speed.

**Tool: Midjourney** (manual, $30/mo Standard plan)
- 3 image variations per word
- Target: 500 words = 1500 images total
- Willing to grind for 2 months

**Three-tier priority:**
- **Tier 1 (~100 words):** Highest-frequency SAT words. Maximum quality, multiple Midjourney iterations. These are style anchors.
- **Tier 2 (~200 words):** Good quality, less iteration.
- **Tier 3 (~200 words):** Use Tier 1 images as style references for Flux API bulk generation.

**Tools considered and rejected for bulk:**
- Higgsfield — no API, expensive at scale ($0.29–0.32/video), text overlay still unsolved
- Stable Diffusion — cheapest but lower quality
- DALL-E 3 API — $120 for 1500, less artistic than Flux

**Storage:** Cloudflare R2 (~$0.18/mo for 12GB). URLs stored in Supabase, not hardcoded.

### Video Pipeline (Shotstack)
`AssetAgent.generateShotstackPayload()` in `src/lib/agents/asset.ts` produces the render JSON:
- Background: image layer with zoomIn effect
- Foreground: HTML overlay (word + definition) at bottom, slideUp effect
- Duration: 5 seconds, SD resolution, MP4 output

Scripts in `scripts/`:
- `lab_render.ts` — test render one word
- `lab_preview.ts` — generate payload JSON without rendering
- `generate_assets.ts` — batch render Bundle 01
- `check_render.ts` — check status of a specific render ID
- `debug_shotstack.ts` — probe Shotstack API endpoints

---

## Current Midjourney Prompts (Ephemeral — In Testing)

Three conceptual angles tested first:

**Variation 1 — Dissolution:**
```
a lone figure standing in a rain-soaked alleyway at night, their body dissolving into thousands of golden light particles from the edges inward, wet cobblestones reflecting faint neon below, deep shadow in the lower third, rising mist, cinematic wide shot, melancholic and breathtaking, photorealistic --ar 16:9 --v 6.1 --s 750
```

**Variation 2 — The Brief Window:**
```
extreme macro of a soap bubble at the exact millisecond before it bursts, the entire universe reflected in its iridescent surface, suspended against pure darkness, quantum clarity, the last perfect moment, lower half deep black, otherworldly beauty, studio lighting --ar 16:9 --v 6.1 --s 750
```

**Variation 3 — Afterglow:**
```
ocean waves slowly erasing a pair of footprints in wet sand at golden hour, the tide advancing frame by frame, warm amber light dissolving into deep violet horizon, nobody in sight, profound solitude, lower third in shadow, cinematic color grading, shot on film --ar 16:9 --v 6.1 --s 750
```

Status: **not yet generated — pending user review in Midjourney.**

---

## Known Remaining Issues (Medium/Low Priority)

- **Corpus quality:** Bundles 03–05 have thin data (1 synonym, 1 antonym, short context sentences, no video URLs). Needs enriching as corpus grows.
- **`processingLevel` field:** Always set to `'shadow'` on every word — field exists but is never read.
- **QC Agent:** `validateDefinition()` and `auditCode()` exist but are never called from anywhere.
- **`developer.ts` 70/30 logic:** `fetchDailyIntake()` is mocked — slices array from index 0 instead of fetching real forgotten words.
- **Station B metrics:** Active students, loop velocity, fatigue alerts are still hardcoded. Real data now comes from the completions feed — the old metrics panel can be removed or replaced.
- **`bi.ts` console.log in production:** The QC agent flags this but it's not addressed.
- **150-word corpus mandate:** Comment in `architect.ts` says minimum 150 words, only 25 exist.

---

## Recent Git History

```
7616d9f feat(supabase): replace hash flow with live completion logging
bc33949 fix(loop3): relax mastery validation to not require word in response
08ad99a fix(core): resolve 4 high-priority bugs in learning loop and auth
dfd78db docs: move project documentation into codebase
1b7dd0b fix(video): serve MP4s from public/videos/ to prevent Shotstack URL expiration
```

---

## Immediate Next Actions

1. ☐ Create `completions` table in Supabase dashboard (see schema above)
2. ☐ Enable Realtime on `completions` table in Supabase
3. ☐ Add `FACILITATOR_PASSWORD` to Vercel environment variables
4. ☐ Generate ephemeral prompts in Midjourney and review results
5. ☐ Once a prompt formula is approved, write prompts for remaining Tier 1 words
6. ☐ Enrich Bundles 03–05 corpus data (synonyms, antonyms, context sentences)
