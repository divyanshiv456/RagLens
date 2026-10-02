import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import TestRAG from './pages/TestRAG';
import History from './pages/History';

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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Simple Developer Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-center py-4 text-xs">
          <p>🩺 RAG Doctor — Diagnostic & Debugging Suite for RAG Pipelines</p>
        </footer>
      </div>
    </Router>
  );
}
