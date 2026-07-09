import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full w-full bg-zinc-950 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/50 max-w-md mb-8">
            An unexpected error occurred in this module. We've caught the error to prevent the app from crashing.
          </p>
          
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 mb-8 text-left max-w-2xl w-full overflow-auto">
            <p className="text-rose-400 font-mono text-sm font-semibold mb-2">
              {this.state.error?.toString()}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-6 py-2.5 rounded-lg font-bold transition-all"
          >
            <RefreshCcw className="w-4 h-4" /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
