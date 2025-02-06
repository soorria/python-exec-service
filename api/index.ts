import { handle } from 'hono/vercel'
import { createApp } from '../src/app'
import { Hono } from 'hono'

export default handle(new Hono().mount('/api', createApp().fetch))
