import { handle } from '@hono/node-server/vercel'
import { createApp } from '../src/app'
import { Hono } from 'hono'

export default handle(new Hono().mount('/api', createApp().fetch))
