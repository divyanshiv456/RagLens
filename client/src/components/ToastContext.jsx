import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map(toast => {
          let bgStyle = 'bg-slate-900 text-white border-slate-700';
          let Icon = Info;
          if (toast.type === 'success') {
            bgStyle = 'bg-slate-900 text-emerald-300 border-emerald-500/40 shadow-emerald-900/20';
            Icon = CheckCircle2;
          } else if (toast.type === 'warning') {
            bgStyle = 'bg-slate-900 text-amber-300 border-amber-500/40 shadow-amber-900/20';
            Icon = AlertTriangle;
          } else if (toast.type === 'error') {
            bgStyle = 'bg-slate-900 text-rose-300 border-rose-500/40 shadow-rose-900/20';
            Icon = XCircle;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md font-medium text-xs animate-slideInRight transition-all ${bgStyle}`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
