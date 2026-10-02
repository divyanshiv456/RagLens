import React from 'react';
import { X, FileText, Hash } from 'lucide-react';

export default function ChunkViewerModal({ document, onClose }) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-base">{document.filename}</h3>
              <p className="text-xs text-slate-400">
                {document.fileType} • {document.chunkCount || document.chunks?.length || 0} Chunks Extracted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chunks List Body */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
          {(!document.chunks || document.chunks.length === 0) ? (
            <p className="text-slate-500 text-center py-8 text-sm">No chunks available for this document.</p>
          ) : (
            document.chunks.map((chunk, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2 border-b border-slate-100 pb-2 font-mono">
                  <span className="font-bold text-sky-700 flex items-center space-x-1">
                    <Hash className="w-3.5 h-3.5" />
                    <span>Chunk #{chunk.chunkIndex + 1} ({chunk.chunkId || `chunk_${chunk.chunkIndex + 1}`})</span>
                  </span>
                  <span>Word Count: {chunk.wordCount || chunk.content?.split(/\s+/).length || 0}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans font-normal whitespace-pre-wrap">
                  {chunk.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
