import { handle } from '@hono/node-server/vercel'
import { createApp } from '../src/app'
import { IncomingMessage, ServerResponse } from 'node:http'

export default (req: IncomingMessage, res: ServerResponse) => {
  console.log('Node request', req.url)
  return handle(createApp().mount('/api', createApp().fetch))(req, res)
}
