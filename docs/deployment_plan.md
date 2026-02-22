# Vocab Gym V2.7 - Deployment & Hosting Plan

## 1. Required API Keys & Environment Variables
To "plug life" into the shell, you must provision the following services and add their keys to your deployment environment (e.g., Vercel Project Settings or `.env.local` for local dev).

| Service | Variable Name | Purpose | Risk Level |
| :--- | :--- | :--- | :--- |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL` | Database Connection URL | Low (Public) |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API Key for RLS | Low (Public) |
| **Shotstack** | `SHOTSTACK_API_KEY` | Video Rendering API (Asset Agent) | **High (Secret)** |
| **ElevenLabs** | `ELEVENLABS_API_KEY` | Audio Generation (Asset Agent) | **High (Secret)** |
| **OpenAI/LLM**| `OPENAI_API_KEY` | (Optional) Future Semantic Analysis | **High (Secret)** |

> [!CAUTION]
> Never commit `SHOTSTACK_API_KEY` or `ELEVENLABS_API_KEY` to the public repository. These should only exist in the secure environment variables of your hosting provider.

## 2. Hosting Strategy: Modular Reality
Since we have split the app into two stations, the hosting strategy must support both **public access** (for students) and **secured access** (for facilitators), with valid SSL for iframe compatibility.

### Recommended Provider: [Vercel](https://vercel.com)
- **Framework Native**: Zero-config deployment for **Next.js** (the technology we built the Gym with).
- **Edge Network**: Low latency for global students.
- **Iframe Support**: Standard HTTPS support required for Gather.town.

### FAQ: What about Hugging Face?
> You might remember us discussing Hugging Face.
> - **Hugging Face (Spaces)** is excellent for hosting **Python/AI Models** (e.g., if we were running our own custom LLM).
> - **Vercel** is the industry standard for hosting **Web Apps** (like our Next.js dashboard).
> 
> **Decision**: Since our app connects to external APIs (OpenAI, Shotstack, Supabase) rather than running a heavy model itself, **Vercel is much faster and cheaper**. We can still use Hugging Face later if we build a custom Python AI agent.

### Deployment Configuration
1.  **Project Root**: `.` (Current Directory)
2.  **Build Command**: `next build`
3.  **Output Directory**: `.next` (Default)
4.  **Install Command**: `npm install`

## 3. Station Logic & Security
### FAQ: Why can't I just use a `.env` file?
> **Security Rule**: Local `.env` files are strictly for your machine. They are usually "git ignored" so your secrets (like API keys) don't get stolen if you push code to GitHub.
> 
> **Vercel Project Settings**: Since Vercel pulls your code from GitHub, it doesn't see your local `.env` file. You must manually "teach" Vercel these secrets.

### Step 0: Git & GitHub Setup (Prerequisite)
Before Vercel can see your project, it must be on GitHub.

1.  **Local Git Init**: I have already initialized the git repo and committed your code locally.
2.  **Create Remote Repo**:
    *   Go to [GitHub.com/new](https://github.com/new)
    *   Name it `vocab_gym_v2.7`
    *   **Do not** initialize with README/gitignore (keep it empty).
3.  **Push Code**:
    *   Copy the commands GitHub gives you under "…or push an existing repository from the command line".
    *   Run them in your terminal (I can run them if you paste them here, or you can run them).
    *   Example:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/vocab_gym_v2.7.git
        git branch -M main
        git push -u origin main
        ```

### How to Configure Vercel (Step-by-Step)
1.  **Go to Vercel**: Log in and click **"Add New Project"**.
2.  **Import (Don't Clone!)**:
    - **First Time Setup**: If you see an **"Install"** button with the GitHub logo (like in your screenshot), click it!
        - It will open a popup to connect Vercel to your GitHub.
        - Select **"All Repositories"** (easiest) or just **"Select Repositories" > `vocab_gym`**.
        - Click **Install/Save**.
    - **After Installing**: You will be redirected back. Now you should see `vocab_gym` in the list.
    - **Action**: Click the **Import** button next to `vocab_gym`.
3.  **Configure Project**:
    - **Project Name**: Leave as `vocab-gym`.
    - **Framework Preset**: Leave as `Next.js`.
    - **Root Directory**: Leave as `./`.
    - **Environment Variables** (The Important Part!):
        - Click the arrow to expand **"Environment Variables"**.
        - Add the following (Key : Value):
            - `NEXT_PUBLIC_SUPABASE_URL` : [Your Supabase URL]
            - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : [Your Supabase Key]
            > **Where to find them (Based on your Screenshot)**:
            > 1. **URL**: Click **"Data API"** in the left sidebar (under Configuration). Copy the "API URL". -> `NEXT_PUBLIC_SUPABASE_URL`
            > 2. **Key**: Look at **"Publishable key"** (starts with `sb_publishable_...`). Copy that. -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            > 3. **Ignore**: Do NOT use the "Secret key" for these variables.
            - `SHOTSTACK_API_KEY` : [Copy the **SANDBOX** key: `nus21...`]
            - `ELEVENLABS_API_KEY` : [Your ElevenLabs Key]
            > **Tip**: Use the **SANDBOX** key first. It allows free testing. Switch to **PRODUCTION** (`7UYp...`) only when you are ready to remove watermarks and pay for renders.
4.  **Deploy**: Once keys are added (or skipped for now), click black **"Deploy"** button.

### Configuration Record (For Reference)
- **Supabase URL**: `https://zhjwugjshufbtnavrncd.supabase.co`
- **Shotstack Key (Sandbox)**: `nus21EKO...`

### Station A (Student Dojo) - `https://vocab-gym.vercel.app/station-a`
- **Access**: Public URL.
- **Restriction**:
    - Use `X-Frame-Options: ALLOW-FROM https://gather.town` (configured in `next.config.js` if strict security is needed).
    - Currently open to allow easy embedding.
- **Capacity**: Stateless (client-side timer). Scales infinitely with Vercel Edge.

### Station B (Facilitator Dashboard) - `https://vocab-gym.vercel.app/station-b`
- **Access**: Obfuscated URL or Basic Auth (Middleware).
- **Recommendation**: For Phase 4, protect `/station-b` with a simple middleware password or Supabase Auth to prevent students from seeing the dashboard.

## 4. Video & Asset Hosting Strategy
### where are we hosting our videos?
**1. Generated "Cyber-Noir" Videos (Shotstack)**
*   **Host**: Shotstack Cloud (AWS S3)
*   **Method**: When `AssetAgent` requests a video, Shotstack renders it and returns a URL (e.g., `https://shotstack-api-stage-output.s3...`).
*   **Retention**: By default, these are hosted for 24 hours.
*   **Scaling**: For permanent access, we will need to configure a webhook to save these to **Supabase Storage**.

**2. Static "Cinema Loop" Videos**
*   **Host**: Supabase Storage (Bucket: `cinema-assets`) OR YouTube/Vimeo (Embedded).
*   **Method**: Upload your curated 30-sec clips here. Use the public URL in `CurriculumItem`.

## 5. Scaling & Limits (Session Unit Economics)
Based on the BI Agent's calculations:
- **Database**: Supabase "Pro" Plan ($25/mo) recommended for >500 active students (Realtime limits).
- **Video Rendering**: Shotstack "Scale" or "Enterprise" plan required if rendering >100 videos/day.
- **Cost Control**:
    - Implement a "Daily Render Limit" in the `SoftwareDeveloper` agent to prevent API cost runaways.

## 5. Next Steps (Execute)
1.  [User Action] Sign up for Supabase, Shotstack, and ElevenLabs.
2.  [User Action] Create a Vercel Project and link `vocab_gym_v2.7` repo.
3.  [User Action] Input the Environment Variables listed above.
4.  [User Action] Deploy and copy the Vercel URL to Gather.town.
