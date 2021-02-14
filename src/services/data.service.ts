import axios from "axios";
import NodeCache from "node-cache";

const R = require("ramda");
const unflatten = require("flat").unflatten;
const flatten = require("flat");
const cacheTtl = process.env.CACHE_TTL || 600;
const url =
  process.env.DATA_URL ||
  "https://raw.githubusercontent.com/Jdemon/fastify-json-data-filter/main/resources/data.json";

export class DataService {
  private dataCache = new NodeCache({ stdTTL: 180, checkperiod: 200 });

  constructor() {
    this.fetch(url);
  }

  public async fetch(urlFetch: string) {
    const transformed: Record<
      string,
      Record<string, any>[]
    > = await this.download(urlFetch);
    let transformedData: Record<string, any>[] = [];
    for (let k in transformed) {
      transformed[k].forEach((item) => {
        item = flatten(item, { safe: true });
        transformedData.push(item);
      });
      transformed[k] = transformedData;
      transformedData = [];
    }
    const isSuccess = this.dataCache.set("data", transformed, cacheTtl);
    console.info("Set Cache isSuccess:" + isSuccess);
    return await this.dataCache.get("data");
  }

  public async download(urlFetch: string): Promise<any> {
    if (!urlFetch) urlFetch = url;
    let data = [{}];
    console.info("Fetching data at: " + urlFetch);
    await axios.get(urlFetch).then((res) => {
      if (res.status === 200) {
        data = res.data;
        console.info("Fetch Successfully");
      } else {
        console.info("Fetch Fail");
      }
    });
    return data;
  }

  public async getData(route: string): Promise<any> {
    let data = await this.dataCache.get("data");
    if (data == undefined) {
      data = await this.fetch(url);
    }
    return await R.path([route], data);
  }

  public async findByKey(key: string, data: any[]): Promise<any> {
    const query = {
      key: key,
    };
    return await this.filter(query, data);
  }

  public async filter(query: any, data: any[]): Promise<any> {
    if (!data) return;

    if (!query.q) {
      data = await this.find(data, query);
    } else {
      const qFilter = (val: any) =>
        R.filter(R.compose(R.any(R.contains(val)), R.values));
      data = await qFilter(query.q)(data);
    }

    return await this.unflat(data);
  }

  private async find(data: any[], query: Record<string, any>): Promise<any> {
    const baseData = data[0];
    if (!baseData) {
      return data;
    }

    for (let jsonKey in baseData) {
      if (query[jsonKey]) {
        const type = typeof baseData[jsonKey];
        if (type === "object" && Array.isArray(baseData[jsonKey])) {
          const typeInArray = typeof baseData[jsonKey][0];
          let value = await this.convertType(typeInArray, query[jsonKey]);
          delete query[jsonKey];
          let queryArray: any = {};
          queryArray[jsonKey] = R.includes(value);
          console.log(query);
          data = R.filter(R.where(queryArray))(data);
        } else {
          query[jsonKey] = await this.convertType(type, query[jsonKey]);
        }
      }
    }
    return await R.filter(R.whereEq(query))(data);
  }

  public async convertType(type: any, val: string): Promise<any> {
    let convertVal: any;
    if (type === "number") {
      convertVal = Number(val);
    } else if (type === "bigint") {
      convertVal = BigInt(val);
    } else if (type === "boolean") {
      convertVal = val === "true";
    } else {
      convertVal = val;
    }
    return convertVal;
  }

  private async unflat(data: any[]) {
    const untransformed: Record<string, any>[] = [];
    data.forEach((item) => {
      item = unflatten(item);
      untransformed.push(item);
    });
    return untransformed;
  }
}
