import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function ExportReportButton({ diagnosisId }) {
  const [loading, setLoading] = useState(false);

  const handleDownloadReport = async () => {
    setLoading(true);
    try {
      const data = await api.exportReport(diagnosisId);
      
      // Build clean HTML document for printing / PDF saving
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to view and download the PDF diagnosis report.');
        return;
      }

      const reportHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>RAG Doctor Diagnosis Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; color: #1e293b; }
            .header { border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; }
            .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
            .subtitle { font-size: 13px; color: #64748b; margin-top: 5px; }
            .section { margin-bottom: 25px; background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; }
            .section-title { font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 12px; uppercase; }
            .score-badge { font-size: 20px; font-weight: 800; color: #0284c7; background: #e0f2fe; padding: 6px 14px; border-radius: 8px; display: inline-block; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .card { background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; }
            ul { margin: 5px 0 0 18px; padding: 0; font-size: 12px; }
            .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">🩺 RAG Doctor Diagnosis Report</h1>
            <div class="subtitle">Generated on ${new Date(data.createdAt).toLocaleString()}</div>
          </div>

          <div class="section">
            <div class="section-title">Query & AI Output</div>
            <p><strong>Question:</strong> "${data.question}"</p>
            <p><strong>Generated Answer:</strong> "${data.generatedAnswer}"</p>
            <p><strong>Health Score:</strong> <span class="score-badge">${data.healthScore}/100</span> — <strong>${data.healthStatus}</strong></p>
            <p><strong>Primary Diagnosis:</strong> ${data.primaryProblem}</p>
          </div>

          <div class="section">
            <div class="section-title">Diagnostic Checks Breakdown</div>
            <div class="grid">
              <div class="card">
                <strong>Retrieval Check:</strong> ${data.checks?.retrieval?.status}<br>
                <em>${data.checks?.retrieval?.explanation}</em>
              </div>
              <div class="card">
                <strong>Context Relevance:</strong> ${data.checks?.relevance?.status}<br>
                <em>${data.checks?.relevance?.explanation}</em>
              </div>
              <div class="card">
                <strong>Groundedness:</strong> ${data.checks?.groundedness?.status}<br>
                <em>${data.checks?.groundedness?.explanation}</em>
              </div>
              <div class="card">
                <strong>Evidence / Citation:</strong> ${data.checks?.evidence?.status}<br>
                <em>${data.checks?.evidence?.explanation}</em>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Source Evidence & Citation</div>
            <p><strong>Supporting Document:</strong> ${data.evidence?.docName || 'N/A'}</p>
            <p><strong>Page:</strong> ${data.evidence?.pageNumber || 1} | <strong>Chunk:</strong> ${data.evidence?.chunkId || 'N/A'}</p>
            <p><strong>Citation Snippet:</strong> "${data.evidence?.snippet || 'No citation available'}"</p>
          </div>

          <div class="section">
            <div class="section-title">Suggested Fixes</div>
            <ul>
              ${(data.suggestedFixes || []).map(fix => `<li>${fix}</li>`).join('')}
            </ul>
          </div>

          <div class="footer">
            RAG Doctor 🩺 Diagnostic Suite — Platform for RAG Pipeline Debugging & Evaluation
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(reportHtml);
      printWindow.document.close();
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate export report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadReport}
      disabled={loading}
      className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-sm transition disabled:opacity-50 shrink-0"
    >
      {loading ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
          <span>Generating Report...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-sky-400" />
          <span>Download Report (PDF)</span>
        </>
      )}
    </button>
  );
}
