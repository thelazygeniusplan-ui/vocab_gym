"use client";

import React, { useState, useEffect } from 'react';

interface TraineeBotProps {
    message: string;
    emotion?: 'eager' | 'confused' | 'glitching';
}

export default function TraineeBot({ message, emotion = 'eager' }: TraineeBotProps) {
    const [displayMessage, setDisplayMessage] = useState('');

    // Typewriter effect logic
    useEffect(() => {
        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayMessage(message.slice(0, i));
            i++;
            if (i > message.length) clearInterval(intervalId);
        }, 30); // Speed of typing

        return () => clearInterval(intervalId);
    }, [message]);

    const emotionColor = {
        eager: 'text-neon-blue',
        confused: 'text-neon-purple',
        glitching: 'text-red-500 animate-pulse',
    };

    return (
        <div className="flex flex-col items-center p-6 border border-neon-blue/30 rounded-lg bg-charcoal shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <div className="w-16 h-16 mb-4 rounded-full bg-black border-2 border-neon-blue flex items-center justify-center relative overflow-hidden">
                {/* Avatar Placeholder: Glowing Eye */}
                <div className={`w-8 h-8 rounded-full bg-neon-blue blur-sm ${emotion === 'glitching' ? 'animate-ping' : ''}`}></div>
            </div>

            <div className={`font-mono text-lg ${emotionColor[emotion]} min-h-[3rem] text-center`}>
                <span className="mr-2">[TRAINEE_BOT]:</span>
                {displayMessage}
                <span className="animate-blink">_</span>
            </div>
        </div>
    );
}
