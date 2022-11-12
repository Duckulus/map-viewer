import {defineConfig, loadEnv} from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({mode}) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    return {
      plugins: [solidPlugin()],
      base: process.env.VITE_BASE_URL,
      server: {
        port: 3000,
      },
      build: {
        target: 'esnext',
      },
    }
});
