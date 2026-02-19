
import { AssetAgent } from '../src/lib/agents/asset';
import * as fs from 'fs';

async function main() {
    console.log("Generating Preview JSON...");

    // Test with 'ephemeral'
    const word = "ephemeral";
    const definition = "Lasting for a very short time.";
    const context = "Fame is ephemeral.";

    const assetAgent = new AssetAgent();
    // Force specific image for debugging
    const payload = assetAgent.generateShotstackPayload(word, definition, context);

    // Save to file
    if (!fs.existsSync('lab_output')) {
        fs.mkdirSync('lab_output');
    }

    fs.writeFileSync('lab_output/preview.json', JSON.stringify(payload, null, 2));
    console.log("Preview saved to: lab_output/preview.json");
    console.log(JSON.stringify(payload, null, 2));
}

main();
