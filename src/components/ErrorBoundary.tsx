
import React, { Component, ReactNode } from 'react';
import SomethingWentWrong from './SomethingWentWrong';

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
      const FallbackComponent = this.props.fallback || SomethingWentWrong;
      
      return (
        <FallbackComponent 
          error={this.state.error}
          resetErrorBoundary={this.handleReset}
          showHomeButton={this.props.showHomeButton}
          showBackButton={this.props.showBackButton}
          customMessage={this.props.customMessage}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
