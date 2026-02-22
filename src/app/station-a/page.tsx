"use client";

import LoopContainer from "@/components/LoopContainer";
import { PedagogicalArchitect } from "@/lib/agents/architect";
import { useState, useEffect } from "react";

export default function StationAPage() {
    const [architect] = useState(() => new PedagogicalArchitect());
    const [sessionMinute, setSessionMinute] = useState(0);
    const [currentPhase, setCurrentPhase] = useState<'LOOP_0' | 'LOOP_1' | 'LOOP_2' | 'LOOP_3'>('LOOP_0');
    const [studentId, setStudentId] = useState('');
    const [studentIdInput, setStudentIdInput] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setSessionMinute(prev => {
                const next = prev + 1;
                setCurrentPhase(architect.getRotationSchedule(next));
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [architect]);

    const handleJoin = () => {
        if (studentIdInput.trim().length > 0) {
            setStudentId(studentIdInput.trim().toUpperCase());
        }
    };

    if (!studentId) {
        return (
            <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
                <div className="max-w-sm w-full p-8 border border-neon-blue/50 rounded-xl bg-black/40 backdrop-blur-sm text-center">
                    <div className="text-neon-blue text-xs font-mono tracking-widest mb-6">STATION A: DOJO</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Enter Student ID</h1>
                    <p className="text-gray-500 text-sm mb-8">Your ID is used to log your progress. Ask your facilitator if you don&apos;t have one.</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={studentIdInput}
                            onChange={(e) => setStudentIdInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            placeholder="e.g. STU001"
                            className="flex-1 bg-black/50 border border-gray-600 p-3 rounded text-white focus:border-neon-blue focus:outline-none font-mono"
                            autoFocus
                        />
                        <button
                            onClick={handleJoin}
                            className="bg-neon-blue text-black font-bold px-5 rounded hover:bg-cyan-400 transition-colors"
                        >
                            ENTER
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal p-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue animate-pulse z-50"></div>

            <header className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-neon-blue tracking-widest">
                    STATION A: <span className="text-white">DOJO</span>
                </h1>
                <div className="text-xs font-mono text-gray-500">
                    ID: <span className="text-neon-purple">{studentId}</span>
                </div>
            </header>

            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
                <div className="text-neon-purple font-mono">
                    PHASE: {currentPhase}
                </div>
                <div className="text-gray-400 font-mono text-sm">
                    T+{sessionMinute}m / 15m
                </div>
            </div>

            <div className="border border-white/10 rounded-xl p-2 bg-black/40 backdrop-blur-sm">
                <LoopContainer currentPhase={currentPhase} studentId={studentId} />
            </div>
        </div>
    );
}
