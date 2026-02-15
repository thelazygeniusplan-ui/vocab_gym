"use client";

import React, { useState } from 'react';
import TraineeBot from './TraineeBot';
import SignOffModule from './SignOffModule';
import { PedagogicalArchitect } from '@/lib/agents/architect';
import { BusinessIntelligence } from '@/lib/agents/bi';

export default function LoopContainer() {
    const [architect] = useState(() => new PedagogicalArchitect());
    const [bi] = useState(() => new BusinessIntelligence());
    const [currentLoop, setCurrentLoop] = useState<0 | 1 | 2 | 3>(0);
    const [currentWord] = useState<string>('ephemeral'); // Mock initial word
    const [userInput, setUserInput] = useState('');
    const [showSignOff, setShowSignOff] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const advanceLoop = () => {
        if (userInput.toLowerCase() === currentWord.toLowerCase()) {
            // Correct! Move to next loop or finish
            // BI Tracking
            bi.trackCost(`Loop ${currentLoop} Completion`, 1);

            if (currentLoop < 3) {
                setCurrentLoop((prev) => (prev + 1) as 0 | 1 | 2 | 3);
                setUserInput('');
            } else {
                // Mastery achieved - Trigger Sign-Off
                setShowSignOff(true);
            }
        } else {
            // Incorrect logic here
            alert("Incorrect. Try again.");
            bi.trackCost(`Loop ${currentLoop} Error`, 0.5);
        }
    };

    const handleSignOffComplete = () => {
        alert("SESSION SECURED. HASH GENERATED.");
        bi.trackCost('Session Completion', 10);
        setShowSignOff(false);
        setCurrentLoop(0); // Reset for demo
    };

    if (showSignOff) {
        return <SignOffModule onComplete={handleSignOffComplete} />;
    }

    const getLoopContent = () => {
        switch (currentLoop) {
            case 0: // Shadow Hint
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-neon-purple">LOOP 0: SHADOW PROTOCOL</h2>
                        <p className="text-gray-400 mb-6">{architect.generateShadowHint(currentWord)}</p>
                    </div>
                );
            case 1: // Cinema/Video
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-neon-blue">LOOP 1: CINEMA FEED</h2>
                        <div className="aspect-video bg-black border border-neon-blue/50 flex items-center justify-center mb-6">
                            <span className="text-neon-blue">[VIDEO FEED PLACEHOLDER]</span>
                        </div>
                    </div>
                );
            case 2: // Synthesis
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-white">LOOP 2: SYNTHESIS</h2>
                        <p className="text-gray-300 mb-6">Define &apos;{currentWord}&apos; in your own words.</p>
                    </div>
                );
            case 3: // Mastery / Trainee Bot
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-red-500">LOOP 3: MASTERY CHECK</h2>
                        <TraineeBot message={architect.generateTraineeError(currentWord)} emotion="confused" />
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 mt-10 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl">
            {getLoopContent()}

            <div className="flex gap-4 mt-8">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInput}
                    className="flex-1 bg-black/50 border border-neon-blue/50 text-white p-3 rounded focus:outline-none focus:border-neon-blue"
                    placeholder="Enter input..."
                />
                <button
                    onClick={advanceLoop}
                    className="bg-neon-blue text-black font-bold px-6 py-3 rounded hover:bg-cyan-400 transition-colors"
                >
                    EXECUTE
                </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
                CURRENT CYCLE STATUS: {currentLoop}/3
            </div>
        </div>
    );
}
