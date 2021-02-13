import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function indexRoute(server: FastifyInstance) {
  server.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    res.code(200).send({ version: "1.0.0" });
  });
}
