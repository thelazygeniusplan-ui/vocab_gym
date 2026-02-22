"use client";

import React, { useState, useEffect } from 'react';
import TraineeBot from './TraineeBot';
import SignOffModule from './SignOffModule';
import { PedagogicalArchitect } from '@/lib/agents/architect';
import { BusinessIntelligence } from '@/lib/agents/bi';

const PHASE_TO_LOOP: Record<string, 0 | 1 | 2 | 3> = {
    LOOP_0: 0, LOOP_1: 1, LOOP_2: 2, LOOP_3: 3,
};

interface LoopContainerProps {
    currentPhase?: 'LOOP_0' | 'LOOP_1' | 'LOOP_2' | 'LOOP_3';
}

export default function LoopContainer({ currentPhase }: LoopContainerProps) {
    const [architect] = useState(() => new PedagogicalArchitect());
    const [bi] = useState(() => new BusinessIntelligence());
    const [currentLoop, setCurrentLoop] = useState<0 | 1 | 2 | 3>(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showSignOff, setShowSignOff] = useState(false);

    const curriculum = architect.getCurriculum();
    const currentItem = curriculum[wordIndex];
    const currentWord = currentItem?.word ?? '';

    // Sync loop floor with session phase — only ever advance, never go back
    useEffect(() => {
        if (!currentPhase) return;
        const phaseLoop = PHASE_TO_LOOP[currentPhase];
        setCurrentLoop(prev => (phaseLoop > prev ? phaseLoop : prev));
    }, [currentPhase]);

    const advanceLoop = () => {
        let isValid = false;

        if (currentLoop === 2) {
            // Synthesis: own-words definition, any reasonable length
            isValid = userInput.length > 3;
        } else if (currentLoop === 3) {
            // Mastery: correct the Trainee Bot — any substantive response qualifies
            isValid = userInput.trim().length > 10;
        } else {
            // Loop 0 (Shadow) & Loop 1 (Cinema): type the word to confirm recognition
            isValid = userInput.toLowerCase().trim() === currentWord.toLowerCase();
        }

        if (isValid) {
            bi.trackCost(`Loop ${currentLoop} Completion`, 1);
            if (currentLoop < 3) {
                setCurrentLoop((prev) => (prev + 1) as 0 | 1 | 2 | 3);
                setUserInput('');
            } else {
                setShowSignOff(true);
            }
        } else {
            const errorMsg =
                currentLoop === 2
                    ? "Provide a longer definition in your own words."
                    : currentLoop === 3
                    ? "Correct the bot with a full response (min 10 chars)."
                    : "Incorrect. Type the word exactly.";
            alert(errorMsg);
            bi.trackCost(`Loop ${currentLoop} Error`, 0.5);
        }
    };

    const handleSignOffComplete = () => {
        bi.trackCost('Session Completion', 10);
        setShowSignOff(false);
        setCurrentLoop(0);
        setWordIndex(prev => (prev + 1 < curriculum.length ? prev + 1 : 0));
        setUserInput('');
    };

    if (showSignOff) {
        return <SignOffModule onComplete={handleSignOffComplete} />;
    }

    const getLoopContent = () => {
        switch (currentLoop) {
            case 0:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-neon-purple">LOOP 0: SHADOW PROTOCOL</h2>
                        <p className="text-gray-400 mb-6">{architect.generateShadowHint(currentWord)}</p>
                    </div>
                );
            case 1:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-neon-blue">LOOP 1: CINEMA FEED</h2>
                        <div className="aspect-video bg-black border border-neon-blue/50 flex items-center justify-center mb-6 overflow-hidden">
                            {currentItem?.videoUrl ? (
                                <video
                                    src={currentItem.videoUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-neon-blue">[VIDEO FEED OFFLINE]</span>
                            )}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-white">LOOP 2: SYNTHESIS</h2>
                        <p className="text-gray-300 mb-6">Define &apos;{currentWord}&apos; in your own words.</p>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl mb-4 text-red-500">LOOP 3: MASTERY CHECK</h2>
                        <TraineeBot message={architect.generateTraineeError(currentWord)} emotion="confused" />
                        <p className="text-gray-400 text-sm mt-4">
                            Type your correction (min 10 chars).
                        </p>
                    </div>
                );
        }
    };

    const inputPlaceholder =
        currentLoop === 2
            ? "Define in your own words..."
            : currentLoop === 3
            ? "Type your correction to the bot..."
            : "Type the word...";

    return (
        <div className="max-w-2xl mx-auto p-8 mt-10 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl">
            <div className="text-xs text-gray-500 text-right mb-2 font-mono">
                WORD {wordIndex + 1}/{curriculum.length}:{' '}
                <span className="text-neon-purple">{currentWord.toUpperCase()}</span>
            </div>

            {getLoopContent()}

            <div className="flex gap-4 mt-8">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && advanceLoop()}
                    className="flex-1 bg-black/50 border border-neon-blue/50 text-white p-3 rounded focus:outline-none focus:border-neon-blue"
                    placeholder={inputPlaceholder}
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
