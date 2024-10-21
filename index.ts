import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { main } from './generate.js';

const app = new Hono();

app.get('/', async (c) => {
  const email = c.req.query('email');
  const encryptMessage = await main(email);
  return c.text(encryptMessage);
});

const port = 3333;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
