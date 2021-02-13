import fastify from "fastify";
import cors from "fastify-cors";
import indexRoute from "./controllers/index.controller";
import dataRoute from "./controllers/data.controller";

const LOG_LEVEL = process.env.NPM_CONFIG_LOGLEVEL || "info";

function createServer() {
  const server = fastify({ logger: { level: LOG_LEVEL, prettyPrint: true } });
  server.register(indexRoute, { prefix: "/" });
  server.register(dataRoute, { prefix: "/" });
  server.register(cors, {});

  server.setErrorHandler((error, req, res) => {
    req.log.error(error.toString());
    res.send({ error });
  });

  return server;
}

export default createServer;
