import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * App-level error boundary. Catches render-time crashes anywhere in the tree
 * and shows a recoverable fallback instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surfaced for diagnostics; replace with Sentry/logging in production.
    console.error("Uncaught UI error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.assign("/");
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-obsidian px-6 text-center text-white">
          <p className="font-display text-6xl text-brand">Oops.</p>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold">Something broke on our end</h1>
            <p className="max-w-md text-sm text-white/70">
              An unexpected error interrupted the page. You can head back to the homepage and try again.
            </p>
          </div>
          <Button onClick={this.handleReset} className="bg-brand hover:bg-brand-strong">
            Back to homepage
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
