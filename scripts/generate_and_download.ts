import { AssetAgent } from '../src/lib/agents/asset';
import { PedagogicalArchitect } from '../src/lib/agents/architect';
import * as fs from 'fs';
import * as path from 'path';

const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const API_URL = 'https://api.shotstack.io/edit/v1/render';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'videos');

if (!SHOTSTACK_API_KEY) {
    console.error("Error: SHOTSTACK_API_KEY environment variable is missing.");
    process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function renderWord(word: string, definition: string, context: string): Promise<string | null> {
    const assetAgent = new AssetAgent();
    const payload = assetAgent.generateShotstackPayload(word, definition, context);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': SHOTSTACK_API_KEY!
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`API Error: ${err}`);
        }

        const data = await response.json();
        const id = data.response.id;
        console.log(`[${word}] Render Initiated. ID: ${id}`);
        return id;
    } catch (error) {
        console.error(`[${word}] Failed to initiate render:`, error);
        return null;
    }
}

async function checkStatus(id: string) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: { 'x-api-key': SHOTSTACK_API_KEY! }
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        return { status: 'failed' };
    }
}

async function downloadVideo(url: string, word: string): Promise<string> {
    const filename = `${word}.mp4`;
    const filepath = path.join(OUTPUT_DIR, filename);

    console.log(`[${word}] Downloading to ${filepath}...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    console.log(`[${word}] Downloaded! (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

    return `/videos/${filename}`; // Return the public path for the app
}

async function main() {
    console.log("=== Video Production Pipeline (with Local Download) ===\n");

    const architect = new PedagogicalArchitect();
    const corpus = architect.getCurriculum();

    // Target Bundle 01 + Ephemeral
    const targets = [...corpus.slice(0, 5), corpus[5]];
    console.log(`Targeting: [${targets.map(c => c.word).join(', ')}]\n`);

    const renderMap: Record<string, string> = {};

    // 1. Initiate Renders
    for (const item of targets) {
        const id = await renderWord(item.word, item.definition, item.contextSentence);
        if (id) {
            renderMap[item.word] = id;
        }
    }

    console.log("\nWaiting for renders to complete...\n");

    // 2. Poll for Completion
    const remoteUrls: Record<string, string> = {};
    const words = Object.keys(renderMap);

    while (words.length > 0) {
        for (let i = words.length - 1; i >= 0; i--) {
            const word = words[i];
            const id = renderMap[word];
            const status = await checkStatus(id);

            if (status.status === 'done') {
                console.log(`[${word}] Render READY: ${status.url}`);
                remoteUrls[word] = status.url;
                words.splice(i, 1);
            } else if (status.status === 'failed') {
                console.error(`[${word}] FAILED: ${status.error}`);
                words.splice(i, 1);
            } else {
                process.stdout.write('.');
            }
        }
        if (words.length > 0) await new Promise(r => setTimeout(r, 2000));
    }

    // 3. Download all videos locally
    console.log("\n\n=== Downloading Videos Locally ===\n");
    const localPaths: Record<string, string> = {};

    for (const [word, url] of Object.entries(remoteUrls)) {
        try {
            const localPath = await downloadVideo(url, word);
            localPaths[word] = localPath;
        } catch (err) {
            console.error(`[${word}] Download failed:`, err);
        }
    }

    console.log("\n\n=== FINAL LOCAL MANIFEST ===");
    console.log("Update architect.ts videoUrl fields with these paths:\n");
    console.log(JSON.stringify(localPaths, null, 2));
}

main();
