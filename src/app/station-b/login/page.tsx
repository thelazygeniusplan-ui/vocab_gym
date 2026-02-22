"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FacilitatorLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!password) return;
        setLoading(true);
        setError('');

        const res = await fetch('/api/facilitator-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push('/station-b');
        } else {
            setError('ACCESS DENIED. INVALID CREDENTIALS.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center font-mono">
            <div className="max-w-sm w-full p-8 border border-neon-purple/50 rounded-lg bg-charcoal">
                <h1 className="text-2xl text-neon-purple font-bold mb-2 text-center tracking-widest">
                    STATION B
                </h1>
                <p className="text-gray-500 text-center text-sm mb-8">FACILITATOR ACCESS REQUIRED</p>

                <div className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="Enter facilitator password..."
                        className="w-full bg-black/50 border border-gray-600 p-3 rounded text-white focus:border-neon-purple focus:outline-none"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-neon-purple text-black font-bold py-3 rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
                    </button>
                </div>

                <p className="text-gray-600 text-xs text-center mt-6">
                    Set password via FACILITATOR_PASSWORD env var
                </p>
            </div>
        </div>
    );
}
