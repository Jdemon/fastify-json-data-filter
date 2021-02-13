import axios from "axios";

const R = require("ramda");
const unflatten = require("flat").unflatten;
const flatten = require("flat");
const url =
  process.env.DATA_URL ||
  "https://raw.githubusercontent.com/Jdemon/fastify-json-data-filter/main/resources/data.json";

export class DataService {
  private dataMaster: any;

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
    this.dataMaster = transformed;
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
    const filterData = R.path([route], this.dataMaster);
    return filterData;
  }

  public async findByKey(key: string, data: any[]): Promise<any> {
    const query = {
      key: key,
    };
    return await this.filter(query, data);
  }

  public async filter(query: any, data: any[]): Promise<any> {
    if (!data) {
      return;
    }

    if (!query.q) {
      if (query.no) query.no = +query.no;

      if (query.postalCode) {
        data = R.filter(
          R.where({ postalCodes: R.includes(+query.postalCode) })
        )(data);
      } else {
        data = R.filter(R.whereEq(query))(data);
      }
    } else {
      const qFilter = (val: any) =>
        R.filter(R.compose(R.any(R.contains(val)), R.values));
      data = qFilter(query.q)(data);
    }

    return await this.unflat(data);
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
