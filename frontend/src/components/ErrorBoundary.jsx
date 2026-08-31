// frontend/src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

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

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen bg-navy-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full p-8 rounded-3xl bg-slate-900/90 border border-rose-500/40 shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Application Interface Notice
              </h2>
              <p className="text-xs text-slate-400">
                A client-side render exception occurred. You can restore the state or reload the terminal below.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-black/50 border border-slate-800 text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-40">
                <div className="font-bold text-rose-400 mb-1">{this.state.error.name}: {this.state.error.message}</div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-slate-400 whitespace-pre-wrap">{this.state.error.stack.slice(0, 300)}...</pre>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Terminal</span>
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/dashboard';
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-all flex items-center gap-2 border border-slate-700"
              >
                <Home className="w-4 h-4" />
                <span>Go to Dashboard</span>
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
