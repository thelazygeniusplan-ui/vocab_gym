"use client";

import LoopContainer from "@/components/LoopContainer";
import { PedagogicalArchitect } from "@/lib/agents/architect";
import { useState, useEffect } from "react";

export default function StationAPage() {
    const [architect] = useState(() => new PedagogicalArchitect());
    const [sessionMinute, setSessionMinute] = useState(0);
    const [currentPhase, setCurrentPhase] = useState<'LOOP_0' | 'LOOP_1' | 'LOOP_2' | 'LOOP_3'>('LOOP_0');

    useEffect(() => {
        // Simulate 15-minute session (accelerated for demo: 1 real sec = 1 session min)
        const interval = setInterval(() => {
            setSessionMinute(prev => {
                const next = prev + 1;
                setCurrentPhase(architect.getRotationSchedule(next));
                return next;
            });
        }, 1000); // Accelerated time
        return () => clearInterval(interval);
    }, [architect]);

    return (
        <div className="min-h-screen bg-charcoal p-4 overflow-hidden relative">
            {/* Visual Glitch Header for Gather.town iframe */}
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue animate-pulse z-50"></div>

            <header className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-neon-blue tracking-widest">
                    STATION A: <span className="text-white">DOJO</span>
                </h1>
                <div className="text-xs font-mono text-gray-500">
                    IFRAME_MODE: <span className="text-green-500">ACTIVE</span>
                </div>
            </header>

            {/* Rotation Status */}
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
                <div className="text-neon-purple font-mono">
                    PHASE: {currentPhase}
                </div>
                <div className="text-gray-400 font-mono text-sm">
                    T+{sessionMinute}m / 15m
                </div>
            </div>

            <div className="border border-white/10 rounded-xl p-2 bg-black/40 backdrop-blur-sm">
                <LoopContainer />
            </div>

            {/* Footer instruction for copy-paste */}
            <div className="mt-4 text-center text-xs text-gray-400">
                <p>INSTRUCTION: COMPLETE THE LOOP &gt; GENERATE HASH &gt; PASTE INTO CHAT</p>
            </div>
        </div>
    );
}
