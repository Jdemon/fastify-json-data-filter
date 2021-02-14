import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { DataService } from "../services/data.service";

export default async function dataRoute(server: FastifyInstance) {
  const dataService = new DataService();

  server.get("/fetch", async (req: FastifyRequest, res: FastifyReply) => {
    const querys: any = req.query;
    try {
      await dataService.fetch(querys.url);
      res.code(200).send({ status: "success" });
    } catch (e) {
      req.log.error("Fetching Data " + e);
      res.code(500).send({
        status: "fail",
        message: "System can't download file | url: " + querys.url,
      });
    }
  });

  server.get("/:route", async (req: FastifyRequest, res: FastifyReply) => {
    const params: any = req.params;
    let data = await dataService.getData(params.route);
    data = await dataService.filter(req.query, data);
    if (data) {
      res.code(200).send(data);
    } else {
      res.code(404).send();
    }
  });

  server.get("/:route/:key", async (req: FastifyRequest, res: FastifyReply) => {
    const params: any = req.params;
    let data = await dataService.getData(params.route);
    data = await dataService.findByKey(params.key, data);
    if (data) {
      res.code(200).send(data[0]);
    } else {
      res.code(404).send();
    }
  });
}
