
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

console.log('🏁 Main.tsx executing...');

// Create QueryClient with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const root = createRoot(document.getElementById('root')!);

console.log('🏁 Root created, rendering App with providers...');

// Render with all necessary providers
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);

console.log('✅ App rendered successfully with providers');
