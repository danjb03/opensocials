
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<any>;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  customMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info);
    
    // Auto-retry for certain types of errors (max 2 attempts)
    if (this.state.retryCount < 2 && this.isRetryableError(error)) {
      this.retryTimeoutId = window.setTimeout(() => {
        this.setState(prevState => ({
          hasError: false,
          error: null,
          retryCount: prevState.retryCount + 1
        }));
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private isRetryableError = (error: Error): boolean => {
    const retryableMessages = [
      'network error',
      'fetch failed',
      'loading chunk',
      'dynamically imported module'
    ];
    
    return retryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  };

  private handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      retryCount: 0 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-6">
            <h2 className="text-xl font-semibold mb-2 text-white">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              {this.props.customMessage || 'Please refresh the page or try again'}
            </p>
            
            <div className="space-x-4">
              <button 
                onClick={this.handleReset}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Try Again
              </button>
              
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
              >
                Refresh Page
              </button>
              
              {this.props.showHomeButton && (
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="px-4 py-2 bg-accent text-black rounded hover:bg-accent/90"
                >
                  Go Home
                </button>
              )}
            </div>
            
            <details className="mt-4 text-sm text-left">
              <summary className="cursor-pointer text-muted-foreground">Error details</summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {this.state.error?.message || 'Unknown error'}
                {this.state.error?.stack && (
                  <>
                    <br />
                    <br />
                    {this.state.error.stack}
                  </>
                )}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
