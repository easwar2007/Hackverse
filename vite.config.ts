import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleIngestRequest, handleChatRequest } from './src/server/backendHandler.ts'
import { handleAuthRequest } from './src/server/authHandler.ts'

function backendApiPlugin(authConfig: { mongoUri?: string; databaseName?: string; isProduction: boolean }): Plugin {
  return {
    name: 'backend-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = new URL(req.url || '/', 'http://localhost').pathname
        if (path.startsWith('/api/auth/')) {
          let body: unknown
          if (req.method === 'POST') {
            let bodyStr = ''
            try {
              for await (const chunk of req) {
                bodyStr += chunk.toString()
                if (bodyStr.length > 16_384) {
                  res.statusCode = 413
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'Request body is too large.' }))
                  return
                }
              }
              body = bodyStr ? JSON.parse(bodyStr) : {}
            } catch {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid JSON request body.' }))
              return
            }
          }

          const handled = await handleAuthRequest(req, res, path, body, authConfig)
          if (handled) return
        }

        if (req.url === '/api/ingest' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr);
              const result = await handleIngestRequest(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Ingest failed' }));
            }
          });
          return;
        }

        if (req.url === '/api/chat' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr);
              const result = await handleChatRequest(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Chat failed' }));
            }
          });
          return;
        }

        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok', serverTime: new Date().toISOString() }));
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      backendApiPlugin({
        mongoUri: env.MONGODB_URI,
        databaseName: env.MONGODB_DB,
        isProduction: mode === 'production',
      }),
      react(),
      tailwindcss(),
    ],
  }
})
