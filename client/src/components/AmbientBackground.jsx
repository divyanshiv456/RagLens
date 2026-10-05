import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Top Left Teal/Cyan Glow Blob */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/15 dark:bg-sky-500/10 rounded-full filter blur-3xl animate-blob" />

      {/* Top Right Blue Glow Blob */}
      <div className="absolute top-20 -right-40 w-96 h-96 bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full filter blur-3xl animate-blob-delayed" />

      {/* Center Soft Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-600/5 rounded-full filter blur-[120px] animate-pulse-glow" />

      {/* Subtle Developer Grid Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
