import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    // Graceful error logging without crashing application state
    if (import.meta.env?.DEV) {
      console.warn('ErrorBoundary captured an error:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-[#2D1236]"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full shadow-xl border border-stone-200 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-2xl font-bold text-[#2D1236]">Something went wrong</h1>
              <p className="text-sm text-stone-600">
                CelebrateAI encountered an unexpected issue while rendering this view. Your event data in local storage remains completely safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-left overflow-x-auto text-xs font-mono text-stone-600">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                aria-label="Reload current page"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] shadow-md shadow-[#E05368]/20 hover:brightness-105 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reload View
              </button>
              <button
                onClick={this.handleGoHome}
                aria-label="Navigate back to home page"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#2D1236] bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
