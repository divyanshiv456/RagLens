import React, { useEffect, useState } from 'react';
import { Stethoscope, CheckCircle2, RefreshCw, Database, FileText, Cpu, ShieldCheck } from 'lucide-react';

export default function DiagnosticScannerModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Scanning document retrieval & similarity scores...", icon: Database },
    { title: "Checking context relevance & keyword overlap...", icon: FileText },
    { title: "Verifying groundedness & checking hallucination...", icon: Cpu },
    { title: "Testing evidence citations & scanning security risks...", icon: ShieldCheck }
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      const timer1 = setTimeout(() => setStep(1), 500);
      const timer2 = setTimeout(() => setStep(2), 1000);
      const timer3 = setTimeout(() => setStep(3), 1500);
      const timer4 = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-white space-y-6">
        
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-sky-500/20 rounded-2xl border border-sky-500/30 text-sky-400">
            <Stethoscope className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">RAG Doctor Pipeline Scan</h3>
            <p className="text-xs text-slate-400">Examining pipeline health across 4 key stages...</p>
          </div>
        </div>

        <div className="space-y-3">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isDone = idx < step;
            const isCurrent = idx === step;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : (isCurrent ? 'bg-sky-950/60 border-sky-500 text-sky-200 ring-1 ring-sky-400' : 'bg-slate-950/50 border-slate-800/80 text-slate-500')
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">{s.title}</span>
                </div>

                <div>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-sky-400 animate-spin shrink-0" />
                    ) : null
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

      </div>
    </div>
  );
}
