# AI Video Asset Generation Guide

This guide helps you create custom "Cyber-Noir" background visuals for your Vocab Gym videos and integrate them into the pipeline.

# AI Video Asset Generation Guide

This guide helps you create custom "Cyber-Noir" background visuals for your Vocab Gym videos and integrate them into the pipeline.

## 1. Composition & Aesthetic
To ensure maximum visibility of the Cyber-Noir imagery:
*   **Layering:** Text overlays will now appear at the **BOTTOM** of the screen (Subtitle style).
*   **Safe Zone:** The top 80% of the image is safe for complex visuals. The bottom 20% should be darker to ensure text readability.
*   **Dynamic Palette:** Don't stick to a static palette. Adjust based on word tone:
    *   *Negative/Dark words:* Charcoal, Deep Red, Glitch Green.
    *   *Positive/Structure words:* Gold, Neon Cyan, White.
    *   *Neutral/Logic words:* Silver, Cool Blue, Geometry.

## 2. Choosing Your Tool (Cost & Performance)
We recommend a "Mix & Match" strategy for cost-effectiveness.

### A. Nano Banana (Google Gemini 2.5/3) - *Best All-Rounder*
*   **What is it?** Google's state-of-the-art image model (powering Imagen 3/Gemini).
*   **Pros:** Incredible prompt adherence, fast, native text rendering (if needed).
*   **Cost:** ~$0.04 per image (Standard). competitive.
*   **Recommendation:** Use for **Hero Assets** (the most important words).

### B. Stable Diffusion (via API/Runware) - *Cheapest*
*   **Cost:** As low as **$0.002** per image (via Runware/Replicate).
*   **Pros:** Extremely cheap for volume.
*   **Cons:** Requires more prompt engineering to get "Cyber-Noir" right.
*   **Recommendation:** Use for **Bulk Generation** (the 800-word long tail).

### C. Midjourney - *Best Style*
*   **Cost:** ~$10/mo subscription.
*   **Recommendation:** Use for establishing the "Vibe" and style reference sheets.

## 3. Storage Strategy (The 2400 Image Problem)
**Constraint:** 800 words * 3 variants = 2400 images.
*   At ~5MB per HQ image, that is **12 GB of data**.
*   **GitHub is NOT suitable** for this. (Repos >1GB are slow; LFS gets expensive).

**Recommended Solution: S3 Compatible Storage (R2 / AWS)**
1.  **Cloudflare R2:** $0 egress fees. You only pay for storage (~$0.015/GB/mo).
    *   12GB = ~$0.18/month. Extremely cheap.
2.  **AWS S3:** Reliable, standard.
3.  **Workflow:**
    *   Generate Image -> Upload to R2 Bucket -> Get Public URL (`https://cdn.vocabgym.com/assets/word_ID.jpg`).
    *   Store URL in Supabase database, NOT the key in the code.

## 4. Integration Workflow
1.  **Generate** image (using SD for bulk, Nano Banana for Heroes).
2.  **Upload** to R2/S3.
3.  **Update Database**: We will move away from hardcoding URLs in `Architect.ts` to fetching them from Supabase.
4.  **Test:** Run `npx tsx scripts/lab_render.ts` to verify the "Bottom Text" layout works with your new image.

## 6. How to Integrate a New Image
1.  **Generate** your image.
2.  **Upload** it to a persistent URL (e.g., GitHub).
3.  **Update Code** (`src/lib/agents/asset.ts`):
    ```typescript
    // Inside generateShotstackPayload...
    {
        asset: {
            type: "image",
            src: "YOUR_NEW_URL_HERE", // <--- Paste here
        },
        // ...
    }
    ```
4.  **Test:** Run `npx tsx scripts/lab_render.ts`.
