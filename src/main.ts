import { createApp } from './app'
import { serve } from '@hono/node-server'

const app = createApp()

serve(
  {
    fetch: app.basePath('/api').fetch,
    port: parseInt(process.env.PORT ?? '8000') || 8000,
  },
  (info) => {
    console.log('Listening', info)
  }
)
