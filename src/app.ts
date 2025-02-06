import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'
import { runPythonCodeInputSchema } from './lib/python-execution/types'
import { runPythonCode } from './lib/python-execution/run-code'

export function createApp() {
  const app = new Hono()

  app.use(async (c, next) => {
    console.log('Request', c.req.url)

    await next()
  })

  app.post('/v1/run-python-code', vValidator('json', runPythonCodeInputSchema), async (c) => {
    const { result, timings } = await runPythonCode(c.req.valid('json'))

    return c.json({
      ...result,
      timings,
    })
  })

  return app
}
