import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 animate-pulse">
      <div className="h-3 bg-slate-800 rounded w-1/3" />
      <div className="h-8 bg-slate-800 rounded w-1/2" />
      <div className="h-3 bg-slate-800/80 rounded w-2/3" />
    </div>
  );
}

export function SkeletonReport() {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6 animate-pulse">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="space-y-2 w-1/2">
          <div className="h-5 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800/60 rounded w-1/2" />
        </div>
        <div className="w-16 h-16 bg-slate-800 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-24 bg-slate-800/60 rounded-xl" />
        <div className="h-24 bg-slate-800/60 rounded-xl" />
        <div className="h-24 bg-slate-800/60 rounded-xl" />
        <div className="h-24 bg-slate-800/60 rounded-xl" />
      </div>
    </div>
  );
}
