"use client";

import React, { useState } from 'react';
import { verifyHash } from '@/lib/hash';

export default function StationBPage() {
    const [inputHash, setInputHash] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [parsedStudentId, setParsedStudentId] = useState<string | null>(null);

    const handleVerify = () => {
        const result = verifyHash(inputHash.trim());
        if (result.valid) {
            setVerificationStatus('valid');
            setParsedStudentId(result.studentId);
        } else {
            setVerificationStatus('invalid');
            setParsedStudentId(null);
        }
    };

    return (
        <div className="min-h-screen bg-black p-8 font-mono text-foreground">
            <header className="mb-12 border-b border-neon-purple/50 pb-4">
                <h1 className="text-3xl font-bold text-neon-purple tracking-tighter">
                    STATION B: <span className="text-white">FACILITATOR</span>
                </h1>
                <div className="text-sm text-gray-400 mt-2">
                    REAL-TIME MONITORING // ACTIVE SESSION
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hash Verification Module */}
                <div className="p-6 border border-white/20 rounded-lg bg-charcoal">
                    <h2 className="text-xl mb-4 text-neon-blue">HASH VERIFICATION</h2>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            value={inputHash}
                            onChange={(e) => setInputHash(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                            placeholder="Paste Student Hash Here..."
                            className="flex-1 bg-black/50 border border-gray-600 p-3 rounded text-white focus:border-neon-blue focus:outline-none"
                        />
                        <button
                            onClick={handleVerify}
                            className="bg-neon-blue text-black font-bold px-6 rounded hover:bg-cyan-400"
                        >
                            SCAN
                        </button>
                    </div>

                    {verificationStatus === 'valid' && (
                        <div className="p-4 bg-green-500/20 border border-green-500 rounded text-green-400 text-center animate-pulse">
                            <div>VALID HASH. MASTERY CONFIRMED.</div>
                            <div className="text-xl font-bold mt-2 text-white">STUDENT ID: {parsedStudentId}</div>
                        </div>
                    )}

                    {verificationStatus === 'invalid' && (
                        <div className="p-4 bg-red-500/20 border border-red-500 rounded text-red-400 text-center">
                            INVALID HASH. RETRY REQUIRED.
                        </div>
                    )}
                </div>

                {/* Live Session Metrics (Mock) */}
                <div className="p-6 border border-white/20 rounded-lg bg-charcoal/50">
                    <h2 className="text-xl mb-4 text-gray-300">SESSION METRICS</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>Active Students</span>
                            <span className="text-neon-purple text-xl">18/20</span>
                        </div>
                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-neon-purple h-full w-[90%]"></div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <span>Avg. Loop Velocity</span>
                            <span className="text-neon-blue text-xl">4m 12s</span>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <span>Fatigue Alerts</span>
                            <span className="text-red-500 text-xl">2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
