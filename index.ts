import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { main } from './generate.js';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/', async (c) => {
  const email = c.req.query('email');
  const encryptMessage = await main(email?.replaceAll(' ', '+'));
  return c.text(`https://staging.helpbnk.terminal3.io?e=${encryptMessage}`);
});

app.get('/auth/redirect', (c) => {
  const params = c.req.query();
  return c.text(`Redirecting... with params: ${JSON.stringify(params)}`);
});

app.get('/error-new', (c) => {
  c.status(400);
  return c.json({ error: 'An error occurred' });
});

const port = 3334;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
