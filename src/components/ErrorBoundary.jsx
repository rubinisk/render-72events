import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary-screen" role="alert" aria-live="assertive">
          <div className="error-boundary-card">
            <div className="error-icon" aria-hidden="true">⚠️</div>
            <h1>Something went wrong</h1>
            <p>An unexpected application error occurred. We have kept your session safe.</p>
            <div className="error-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleReload}
              >
                Reload Page
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.handleReset}
              >
                Back to Safety
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
