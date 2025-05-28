
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

// Create QueryClient inside the render function to avoid issues
function AppWithProviders() {
  // Create a client inside the component to ensure React context is available
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

root.render(<AppWithProviders />);
