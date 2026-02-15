"use client";

import React, { useState, useEffect } from 'react';

export default function SignOffModule({ onComplete }: { onComplete: () => void }) {
    const [timer, setTimer] = useState(15);
    const [isActive, setIsActive] = useState(false);
    const [targetHash, setTargetHash] = useState('');
    const [studentId, setStudentId] = useState('');
    const [isIdLocked, setIsIdLocked] = useState(false);

    useEffect(() => {
        // Generate partial hash on mount, but wait for Student ID to finalize
        setTargetHash("PENDING-ID-INPUT");
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timer, onComplete]);

    const lockStudentId = () => {
        if (studentId.trim().length > 0) {
            setIsIdLocked(true);
            // Hash Algo: SESSION-STUDENTID-RANDOM
            const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
            setTargetHash(`SESSION-${studentId.toUpperCase()}-${randomPart}`);
        }
    };

    const startSprint = () => {
        if (isIdLocked) {
            setIsActive(true);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-md">
            <div className="max-w-md w-full p-6 border border-red-500 rounded-lg bg-charcoal">
                <h2 className="text-2xl text-red-500 font-bold mb-4 text-center">EXIT SPRINT PROTOCOL</h2>

                {!isIdLocked ? (
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2 text-sm">ENTER STUDENT ID TO ARM PROTOCOL:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="e.g. STU-001"
                                className="flex-1 bg-black/50 border border-gray-600 p-2 rounded text-white focus:border-neon-blue focus:outline-none"
                            />
                            <button
                                onClick={lockStudentId}
                                className="bg-gray-700 text-white px-4 rounded hover:bg-gray-600"
                            >
                                LOCK
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 text-center">
                        <span className="text-green-500 font-mono">ID LOCKED: {studentId.toUpperCase()}</span>
                    </div>
                )}

                <p className="text-gray-400 text-center mb-6">
                    To generate Completion Hash, solve the final definition sprint in under 15s.
                </p>

                {isActive ? (
                    <div className="text-center">
                        <div className="text-4xl font-mono text-neon-blue mb-4">{timer}s</div>
                        <p className="mb-4">Target: {targetHash}</p>
                        <button onClick={onComplete} className="bg-red-500 text-white px-6 py-2 rounded">
                            SIMULATE COMPLETION
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={startSprint}
                        disabled={!isIdLocked}
                        className={`w-full font-bold py-3 rounded ${isIdLocked ? 'bg-neon-blue text-black cursor-pointer' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        INITIATE SEQUENCE
                    </button>
                )}
            </div>
        </div>
    );
}
