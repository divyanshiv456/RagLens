import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Wrench, Sparkles, ArrowRight, Activity, Database, Cpu, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white border border-slate-800 p-8 sm:p-10 shadow-2xl">
      {/* Decorative Light Radial Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Text & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>AI Pipeline Observability & Diagnostics Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Diagnose Your RAG. <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Fix What’s Broken.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            RAG Doctor analyzes your retrieval, context, grounding, and evidence to find exactly where your AI pipeline fails.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/test')}
              className="flex items-center space-x-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-sky-500/25 transition hover:scale-105 active:scale-95 shrink-0"
            >
              <Stethoscope className="w-5 h-5" />
              <span>🩺 Diagnose RAG</span>
            </button>

            <button
              onClick={() => navigate('/repair')}
              className="flex items-center space-x-2 px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl border border-slate-700 shadow-md transition hover:scale-105 active:scale-95 shrink-0"
            >
              <Wrench className="w-5 h-5 text-amber-400" />
              <span>🔬 Open Repair Lab</span>
            </button>
          </div>
        </div>

        {/* Right Animated ASCII / SVG Node Flow Visual */}
        <div className="lg:col-span-5 bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-inner space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span>RAG PIPELINE INSPECTOR</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>LIVE</span>
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            
            {/* Node 1: User Query */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-slate-200">1. Question</span>
              </div>
              <span className="text-[10px] text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">Query Vector</span>
            </div>

            {/* Connecting Pulse Line */}
            <div className="relative h-4 flex items-center justify-center">
              <div className="w-0.5 h-full bg-slate-800 relative overflow-hidden">
                <div className="absolute w-full h-2 bg-sky-400 animate-pulse" />
              </div>
            </div>

            {/* Node 2: Retrieval */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-slate-200">2. Retrieval</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Vector Search</span>
            </div>

            {/* Connecting Pulse Line */}
            <div className="relative h-4 flex items-center justify-center">
              <div className="w-0.5 h-full bg-slate-800 relative overflow-hidden">
                <div className="absolute w-full h-2 bg-teal-400 animate-pulse" />
              </div>
            </div>

            {/* Node 3: LLM Generation */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-200">3. Generation</span>
              </div>
              <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">Grounded LLM</span>
            </div>

            {/* Connecting Pulse Line */}
            <div className="relative h-4 flex items-center justify-center">
              <div className="w-0.5 h-full bg-slate-800 relative overflow-hidden">
                <div className="absolute w-full h-2 bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Node 4: Diagnosis Verdict */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-300">4. Diagnosis</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-300">Health 92/100 🟢</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
