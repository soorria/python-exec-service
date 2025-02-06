import { handle } from '@hono/node-server/vercel'
import { createApp } from '../src/app'
import { IncomingMessage, ServerResponse } from 'node:http'
import { runPythonCode } from '../src/lib/python-execution/run-code'

export default async (req: IncomingMessage, res: ServerResponse) => {
  console.log('Node request', req.url)
  // return handle(createApp().mount('/api', createApp().fetch))(req, res)

  res.statusCode = 200
  res.write(JSON.stringify(await runPythonCode({ code: '1 + 1' })))
  res.end()

  return
}
