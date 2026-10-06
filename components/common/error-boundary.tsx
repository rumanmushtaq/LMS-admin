import React from "react";

interface Props {
  children: React.ReactNode;
  /** Shown instead of a white screen when a child throws during render. */
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

/**
 * Catches render-time exceptions in its subtree so one bad record can't take
 * the whole page down with "Application error: a client-side exception".
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }

  componentDidCatch(error: unknown) {
    // Surfaced in the console for diagnosis; the UI stays usable.
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
            <p className="font-semibold text-red-700">
              Couldn&apos;t display this section
            </p>
            <p className="text-sm text-red-500">{this.state.message}</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
