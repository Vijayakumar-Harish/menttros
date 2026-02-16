import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});
import { createServer } from "./infrastructure/server/createServer";
import { env } from "./infrastructure/config/env";

const app = createServer();

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
process.on('SIGTERM', async () => {
  console.log("Shutting down...");
  await app.close();
  process.exit(0);
})

start();
