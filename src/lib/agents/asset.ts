export class AssetAgent {
    // Mandate: Director of Creative. Generates "Cyber-Noir" Nano Banana prompts and ElevenLabs audio assets.

    constructor() { }

    generateImagePrompt(word: string, context: string): string {
        // Nano Banana / Cyber-Noir Style Prompting
        const baseStyle = "Cyber-Noir style, charcoal background #121212, neon blue and purple accents, high contrast, cinematic lighting, glitch art aesthetic, futuristic, dark atmosphere.";
        const subject = `Visual representation of the concept '${word}'`;
        const action = `Scene describing: ${context}`;

        return `${baseStyle} ${subject}. ${action}. 8k resolution, unlearnt details.`;
    }

    generateAudioPrompt(text: string): string {
        // ElevenLabs: Trainee Bot Persona (Helpful but slightly robotic/glitchy)
        return `[Voice: Trainee_Bot_v2] [Emotion: Eager/Curious] ${text}`;
    }

    generateShotstackPayload(word: string, definition: string, context: string): object {
        // Generates a render-ready JSON for Shotstack API
        return {
            timeline: {
                background: "#000000",
                tracks: [
                    {
                        clips: [
                            {
                                asset: {
                                    type: "html",
                                    html: `<div style="font-family: 'Courier New'; color: #00F0FF; text-align: center; margin-top: 200px;">
                                            <h1 style="font-size: 80px; text-shadow: 0 0 10px #BD00FF;">${word.toUpperCase()}</h1>
                                            <p style="font-size: 30px; color: #FFFFFF;">${definition}</p>
                                           </div>`,
                                    css: "body { background: transparent; }",
                                    width: 1920,
                                    height: 1080
                                },
                                start: 0,
                                length: 5,
                                effect: "zoomIn"
                            }
                        ]
                    },
                    {
                        clips: [
                            {
                                asset: {
                                    type: "luma",
                                    src: "https://shotstack-assets.s3.ap-southeast-2.amazonaws.com/overlays/glitch-static.mp4"
                                },
                                start: 0,
                                length: 5,
                                opacity: 0.3
                            }
                        ]
                    }
                ]
            },
            output: {
                format: "mp4",
                resolution: "sd"
            }
        };
    }
}
