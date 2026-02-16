
const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY || "";

async function probeEndpoint(name: string, url: string) {
    console.log(`\nProbing [${name}]...`);
    console.log(`URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': SHOTSTACK_API_KEY
            }
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            console.log("SUCCESS! This endpoint accepted the key.");
            const data = await response.json();
            console.log("Response Preview:", JSON.stringify(data).substring(0, 100) + "...");
            return true;
        } else {
            const errText = await response.text();
            console.error("FAILED. Body:", errText);
            return false;
        }
    } catch (error) {
        console.error("NETWORK ERROR:", error);
        return false;
    }
}

async function main() {
    console.log("--- Shotstack Key Debugger ---");
    console.log(`Key: ${SHOTSTACK_API_KEY.substring(0, 5)}... (Length: ${SHOTSTACK_API_KEY.length})`);

    // Probe 1: Edit API - Stage (Sandbox)
    // Using GET /renders (list renders) as a probe
    await probeEndpoint("Edit API (Stage)", "https://api.shotstack.io/edit/stage/renders");

    // Probe 2: Edit API - Production (Just in case)
    await probeEndpoint("Edit API (Production)", "https://api.shotstack.io/edit/v1/renders");

    // Probe 3: Ingest API - Stage
    await probeEndpoint("Ingest API (Stage)", "https://api.shotstack.io/ingest/stage/sources");

    // Probe 4: Serve API - Stage (Hosting)
    await probeEndpoint("Serve API (Stage)", "https://api.shotstack.io/serve/stage/assets");

    // Probe 5: Create API - Stage (AI Generation)
    await probeEndpoint("Create API (Stage)", "https://api.shotstack.io/create/stage/assets");

    console.log("\n--- CONCLUSION ---");
    console.log("If INGEST works but EDIT fails, you might need to enable 'Edit API' in your dashboard.");

}

main();
