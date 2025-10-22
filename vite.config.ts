import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Conditionally import lovable-tagger only in development
const getDevPlugins = async (mode: string) => {
  const plugins: any[] = [react()];

  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      plugins.push(componentTagger());
    } catch {
      // lovable-tagger not available, skip
      console.warn('lovable-tagger not available in production');
    }
  }

  return plugins;
};

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: await getDevPlugins(mode),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          router: ['react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
          query: ['@tanstack/react-query'],
          form: ['react-hook-form', '@hookform/resolvers', 'zod'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
    target: 'esnext',
    minify: 'esbuild' as const,
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
  },
}));
