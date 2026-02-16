
const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const API_URL = 'https://api.shotstack.io/edit/v1/render';
const RENDER_ID = 'c03b14c0-a55c-47ca-a504-d414ad612da3';

async function check() {
    console.log(`Checking status for: ${RENDER_ID}`);
    try {
        const response = await fetch(`${API_URL}/${RENDER_ID}`, {
            headers: { 'x-api-key': SHOTSTACK_API_KEY! }
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

check();
