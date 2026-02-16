
import { AssetAgent } from '../src/lib/agents/asset';
import { PedagogicalArchitect } from '../src/lib/agents/architect';

const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const API_URL = 'https://api.shotstack.io/edit/v1/render';

if (!SHOTSTACK_API_KEY) {
    console.error("Error: SHOTSTACK_API_KEY environment variable is missing.");
    process.exit(1);
}

async function renderWord(word: string, definition: string, context: string) {
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

async function main() {
    console.log("Initializing Video Production Pipeline...");

    // Initialize Agents
    const architect = new PedagogicalArchitect();
    const corpus = architect.getCurriculum();

    // Filter for Bundle 01 (First 5 words)
    const bundle01 = corpus.slice(0, 5);
    console.log(`Targeting Bundle 01: [${bundle01.map(c => c.word).join(', ')}]`);

    const renderMap: Record<string, string> = {};

    // 1. Initiate Renders
    for (const item of bundle01) {
        const id = await renderWord(item.word, item.definition, item.contextSentence);
        if (id) {
            renderMap[item.word] = id;
        }
    }

    console.log("\nWaiting for renders to complete (Polling)...");

    // 2. Poll for Completion
    const results: Record<string, string> = {};
    const words = Object.keys(renderMap);

    while (words.length > 0) {
        for (let i = words.length - 1; i >= 0; i--) {
            const word = words[i];
            const id = renderMap[word];
            const status = await checkStatus(id);

            if (status.status === 'done') {
                console.log(`[${word}] READY: ${status.url}`);
                results[word] = status.url;
                words.splice(i, 1);
            } else if (status.status === 'failed') {
                console.error(`[${word}] FAILED.`);
                words.splice(i, 1);
            } else {
                process.stdout.write('.');
            }
        }
        if (words.length > 0) await new Promise(r => setTimeout(r, 2000));
    }

    console.log("\n\n--- FINAL ASSET MANIFEST ---");
    console.log(JSON.stringify(results, null, 2));
}

main();
