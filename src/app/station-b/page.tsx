"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase_client';

interface Completion {
    id: string;
    student_id: string;
    word: string;
    completed_at: string;
}

export default function StationBPage() {
    const [completions, setCompletions] = useState<Completion[]>([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!supabase) {
            setConnected(false);
            return;
        }
        setConnected(true);

        // Fetch existing completions for this session (last 2 hours)
        const since = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        supabase
            .from('completions')
            .select('*')
            .gte('completed_at', since)
            .order('completed_at', { ascending: false })
            .then(({ data }) => {
                if (data) setCompletions(data as Completion[]);
            });

        // Subscribe to new completions in real time
        const channel = supabase
            .channel('completions-feed')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'completions' },
                (payload) => {
                    setCompletions(prev => [payload.new as Completion, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase!.removeChannel(channel);
        };
    }, []);

    // Group completions by student
    const byStudent = completions.reduce<Record<string, string[]>>((acc, c) => {
        if (!acc[c.student_id]) acc[c.student_id] = [];
        if (!acc[c.student_id].includes(c.word)) acc[c.student_id].push(c.word);
        return acc;
    }, {});

    const studentCount = Object.keys(byStudent).length;

    return (
        <div className="min-h-screen bg-black p-8 font-mono text-foreground">
            <header className="mb-8 border-b border-neon-purple/50 pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-neon-purple tracking-tighter">
                        STATION B: <span className="text-white">FACILITATOR</span>
                    </h1>
                    <div className="text-sm text-gray-400 mt-1">LIVE COMPLETION FEED</div>
                </div>
                <div className="text-right">
                    <div className={`text-xs mb-1 ${connected ? 'text-green-500' : 'text-red-500'}`}>
                        ● {connected ? 'SUPABASE CONNECTED' : 'OFFLINE — NO CREDENTIALS'}
                    </div>
                    <div className="text-gray-400 text-sm">{studentCount} student{studentCount !== 1 ? 's' : ''} active</div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Per-student summary */}
                <div>
                    <h2 className="text-neon-blue text-lg mb-4">STUDENT PROGRESS</h2>
                    {studentCount === 0 ? (
                        <div className="p-6 border border-white/10 rounded-lg text-gray-600 text-center">
                            Waiting for completions...
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(byStudent).map(([id, words]) => (
                                <div key={id} className="p-4 border border-white/10 rounded-lg bg-charcoal/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-neon-purple font-bold">{id}</span>
                                        <span className="text-gray-400 text-xs">{words.length} word{words.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {words.map(word => (
                                            <span key={word} className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded px-2 py-1">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Live event log */}
                <div>
                    <h2 className="text-gray-300 text-lg mb-4">LIVE LOG</h2>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {completions.length === 0 ? (
                            <div className="p-6 border border-white/10 rounded-lg text-gray-600 text-center">
                                No completions yet this session.
                            </div>
                        ) : (
                            completions.map(c => (
                                <div key={c.id} className="flex justify-between items-center p-3 border border-white/10 rounded bg-charcoal/30 text-sm">
                                    <div>
                                        <span className="text-neon-purple">{c.student_id}</span>
                                        <span className="text-gray-500 mx-2">→</span>
                                        <span className="text-white">{c.word}</span>
                                    </div>
                                    <span className="text-gray-600 text-xs">
                                        {new Date(c.completed_at).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
