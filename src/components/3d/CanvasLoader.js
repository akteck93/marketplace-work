'use client';

import React from 'react';

export default function CanvasLoader() {
  return (
    <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md rounded-3xl border border-cyan-500/20 p-8">
      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-violet-500 border-b-transparent border-l-transparent animate-spin"></div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-600 blur-sm animate-pulse"></div>
      </div>
      <p className="mt-4 text-sm font-semibold tracking-wider text-cyan-400 uppercase animate-pulse">
        Initializing 3D Canvas Engine...
      </p>
      <span className="mt-1 text-xs text-slate-400">Loading WebGL shaders & spatial geometry</span>
    </div>
  );
}
