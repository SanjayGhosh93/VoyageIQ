// frontend/src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw, Home, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OceanCharter App Crash caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleNavigateDashboard = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-slate-900/90 border border-rose-500/40 shadow-2xl space-y-6 text-center backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Application Interface Notice
              </h2>
              <p className="text-xs text-slate-400">
                A client-side render exception occurred. You can attempt to clear state, reload the view, or navigate back to the main dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-40">
                <div className="font-bold text-rose-400 mb-1">
                  {this.state.error.name || 'Error'}: {this.state.error.message || 'Unknown render exception'}
                </div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-slate-400 whitespace-pre-wrap leading-relaxed">
                    {this.state.error.stack.slice(0, 350)}...
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={this.handleResetState}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-all flex items-center gap-1.5 border border-slate-700 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>Try Recovering</span>
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-sky-600/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleNavigateDashboard}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-all flex items-center gap-1.5 border border-slate-700 shadow-sm"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;