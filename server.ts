import { serve } from "@hono/node-server";
import app from "./index.js";

const port = Number(process.env.PORT) || 3334;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
