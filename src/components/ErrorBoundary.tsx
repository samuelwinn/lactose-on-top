import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'An unexpected error occurred.';
      let isFirestoreError = false;
      
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Firestore Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path || 'unknown path'}`;
            isFirestoreError = true;
          }
        }
      } catch (e) {
        // Not a JSON error message
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <div className="text-red-500 text-4xl">⚠️</div>
            </div>
            <h2 className="text-2xl font-black mb-4 tracking-tighter uppercase italic text-white">Something went wrong</h2>
            <p className="text-zinc-500 text-sm mb-8 font-medium leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all"
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              Reload Application
            </button>
            {isFirestoreError && (
              <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
                Check console for detailed error info
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
