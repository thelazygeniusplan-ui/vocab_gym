"use client";

import LoopContainer from "@/components/LoopContainer";

export default function Home() {
  return (
    <main className="min-h-screen p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-neon-purple/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-blue/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            VOCAB GYM v2.7
          </h1>
          <div className="text-sm font-mono text-gray-400">
            STATUS: <span className="text-green-400">ONLINE</span>
          </div>
        </header>

        <LoopContainer studentId="DEMO" />
      </div>
    </main>
  );
}
