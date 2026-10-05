import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="flex-1">
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
        
        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-center py-4 text-xs">
          <p>🩺 RAG Doctor v2.0 — Diagnostic, Repair, Testing & Monitoring Platform for RAG Systems</p>
        </footer>
      </div>
    </Router>
  );
}
