import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase the warning limit to 1MB since we have a feature-rich app
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'sonner'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers'],
          'date-vendor': ['date-fns'],
          'chart-vendor': ['recharts'],
          
          // Feature chunks
          'auth-features': [
            './src/components/auth/AuthForms.tsx',
            './src/components/auth/LoginForm.tsx', 
            './src/components/auth/SignUpForm.tsx',
            './src/hooks/useAuthForm.ts',
            './src/hooks/useSignIn.ts',
            './src/hooks/useSignUp.ts'
          ],
          'brand-features': [
            './src/components/brand/dashboard/BrandDashboardStats.tsx',
            './src/components/brand/projects/ProjectsTable.tsx',
            './src/components/brand/campaign-wizard/CampaignWizard.tsx'
          ],
          'creator-features': [
            './src/components/creator/dashboard/DashboardContent.tsx',
            './src/components/creator/campaigns/CampaignList.tsx',
            './src/components/creator/analytics/PerformanceMetrics.tsx'
          ],
          'admin-features': [
            './src/components/admin/ProjectTable.tsx',
            './src/components/admin/UserRequestsTable.tsx',
            './src/components/admin/crm/BrandsTable.tsx'
          ]
        }
      }
    }
  }
}));
