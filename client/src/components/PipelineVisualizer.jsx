import React, { useState } from 'react';
import { ArrowRight, HelpCircle, Search, Database, FileText, Cpu, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function PipelineVisualizer({ pipelineStatus = {}, details = {} }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    {
      id: 'question',
      label: 'Question',
      sublabel: 'User Query',
      icon: HelpCircle,
      status: pipelineStatus.question || 'Passed',
      info: details.question || 'User question received.'
    },
    {
      id: 'queryProcessing',
      label: 'Query Processing',
      sublabel: 'Embedding & Vector',
      icon: Search,
      status: pipelineStatus.queryProcessing || 'Passed',
      info: 'Generated query embedding vector and calculated cosine similarity across document chunks.'
    },
    {
      id: 'retrieval',
      label: 'Retrieval',
      sublabel: 'Vector Search',
      icon: Database,
      status: pipelineStatus.retrieval || 'Passed',
      info: details.retrievalInfo || 'Retrieved Top-K candidate document chunks.'
    },
    {
      id: 'context',
      label: 'Context',
      sublabel: 'Relevance Filter',
      icon: FileText,
      status: pipelineStatus.context || 'Passed',
      info: details.contextInfo || 'Constructed prompt context from retrieved chunks.'
    },
    {
      id: 'llm',
      label: 'LLM',
      sublabel: 'Answer Generation',
      icon: Cpu,
      status: pipelineStatus.llm || 'Passed',
      info: details.llmInfo || 'Sent context payload to LLM model for grounded generation.'
    },
    {
      id: 'answer',
      label: 'Answer',
      sublabel: 'Health & Evidence',
      icon: CheckCircle2,
      status: pipelineStatus.answer || 'Passed',
      info: details.answerInfo || 'Generated final answer and checked for grounded citations.'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Passed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
          badgeBg: 'bg-emerald-500 text-white',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: '🟢 Passed'
        };
      case 'Warning':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
          badgeBg: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          label: '🟡 Warning'
        };
      case 'Failed':
      default:
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
          badgeBg: 'bg-rose-500 text-white',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: '🔴 Failed'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl">📊</span>
          <h3 className="font-bold text-slate-900 text-lg">RAG Pipeline Flow Visualizer</h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          Click any stage to inspect payload details
        </span>
      </div>

      {/* Horizontal Pipeline Diagram */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 overflow-x-auto py-3 px-1">
        {nodes.map((node, index) => {
          const NodeIcon = node.icon;
          const statusStyle = getStatusBadge(node.status);
          const isSelected = selectedNode === node.id;

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className={`flex-1 min-w-[135px] cursor-pointer p-3 rounded-xl border transition-all duration-200 flex flex-col items-center text-center ${
                  statusStyle.bg
                } ${isSelected ? 'ring-2 ring-sky-500 shadow-md scale-105' : 'shadow-xs hover:shadow'}`}
              >
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <NodeIcon className="w-4 h-4 opacity-80" />
                  <span className="font-semibold text-xs tracking-tight">{node.label}</span>
                </div>

                <span className="text-[10px] text-slate-500 mb-2 font-mono">{node.sublabel}</span>

                <div className="mt-auto">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/80 border border-slate-200 shadow-2xs">
                    {statusStyle.label}
                  </span>
                </div>
              </div>

              {/* Arrow Connector */}
              {index < nodes.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-slate-300 px-0.5">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 text-xs animate-fadeIn">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-sky-300 text-sm">
                Stage Inspector: {nodes.find(n => n.id === selectedNode)?.label}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
            >
              Close
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed font-mono">
            {nodes.find(n => n.id === selectedNode)?.info}
          </p>
        </div>
      )}
    </div>
  );
}
