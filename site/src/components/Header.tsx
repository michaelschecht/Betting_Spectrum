import React from 'react';
import { Shield, Sparkles, TrendingUp, Trophy } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 py-4 sticky top-0 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
              Sports Betting Backtest Simulator
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                Live Data Engine
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Historical performance analytics & strategy emulator for MLB, NFL, NHL & NBA from 2000 to 2025
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-800/40 border border-zinc-700/50 rounded-lg text-xs font-mono text-zinc-300">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Simulated Vig Hold: 4.5%</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-500/15 border border-sky-400/20 rounded-lg text-xs font-medium text-sky-300">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span>Optimal Fraction Kelly Model Enabled</span>
          </div>
        </div>
      </div>
    </header>
  );
}
