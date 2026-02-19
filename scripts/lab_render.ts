
import { AssetAgent } from '../src/lib/agents/asset';
import { PedagogicalArchitect } from '../src/lib/agents/architect';

const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const API_URL = 'https://api.shotstack.io/edit/v1/render';

if (!SHOTSTACK_API_KEY) {
    console.error("Error: SHOTSTACK_API_KEY environment variable is missing.");
    process.exit(1);
}

async function main() {
    console.log("🧪 Video Lab: Starting Experimental Render...");

    // Test Word
    const word = "ephemeral";
    const definition = "Lasting for a very short time.";
    const context = "Fame is ephemeral.";

    const assetAgent = new AssetAgent();
    // Generate Payload
    const payload = assetAgent.generateShotstackPayload(word, definition, context);

    console.log("Payload generated. Sending to Shotstack API...");

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
            console.error("API Error:", await response.text());
            return;
        }

        const data = await response.json();
        const id = data.response.id;
        console.log(`Render ID: ${id}`);
        console.log("Waiting for status...");

        // Poll
        while (true) {
            await new Promise(r => setTimeout(r, 2000));
            const statusRes = await fetch(`${API_URL}/${id}`, {
                headers: { 'x-api-key': SHOTSTACK_API_KEY! }
            });
            const statusData = await statusRes.json();
            const status = statusData.response.status;

            if (status === 'done') {
                console.log(`\n✅ SUCCESS! Video URL: ${statusData.response.url}`);
                break;
            } else if (status === 'failed') {
                console.error(`\n❌ FAILED: ${statusData.response.error}`);
                break;
            } else {
                process.stdout.write('.');
            }
        }

    } catch (error) {
        console.error("Experiment Failed:", error);
    }
}

main();
