import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import { ToastProvider } from './components/ToastContext';
import AmbientBackground from './components/AmbientBackground';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import TestRAG from './pages/TestRAG';
import History from './pages/History';
import TestLabPage from './pages/TestLabPage';
import RepairLab from './pages/RepairLab';
import PipelineReplayPage from './pages/PipelineReplayPage';
import PerformancePage from './pages/PerformancePage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col relative transition-colors duration-300">
            {/* Meta Ambient Background Glowing Blobs */}
            <AmbientBackground />

            {/* Sticky Glass Navbar */}
            <Navbar />

            {/* Main Content Viewport */}
            <main className="flex-1 z-10 relative">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/test" element={<TestRAG />} />
                <Route path="/history" element={<History />} />
                <Route path="/test-lab" element={<TestLabPage />} />
                <Route path="/repair" element={<RepairLab />} />
                <Route path="/replay" element={<PipelineReplayPage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Developer Footer */}
            <footer className="z-10 relative bg-slate-900/90 dark:bg-slate-950/90 text-slate-400 border-t border-slate-800/80 text-center py-4 text-xs font-mono">
              <p>🩺 RAG Doctor v2.0 — Diagnostic, Repair, Testing & Monitoring Platform for RAG Systems</p>
            </footer>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}
