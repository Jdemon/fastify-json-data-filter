# JSON DATA FILTER

Filter json data array 

## Stack

- [Fastify](https://www.fastify.io/)
- [Ramda](https://ramdajs.com/)
- [Node-Cache](https://www.npmjs.com/package/node-cache)


## Example data

``` json
{
    "examples": [
        {
            "key": "1",
            "value": "Ping"
        },
        {
            "key": "2",
            "value": "Pong"
        }
    ],
    "provinces": [{...}],
    "districts": [{...}],
    "subDistricts": [{...}],
}
```

### Auto generate APIs from example data

- `/examples{?key}{?value}`
- `/provinces{?no}{?key}{?translations.th.name}{?translations.en.name}{?postalCodes}{?q}`
- `/districts{?no}{?key}{?provinceKey}{?translations.th.name}{?translations.en.name}{?q}`
- `/subDistricts{?no}{?key}{?provinceKey}{?districtKey}{?translations.th.name}{?translations.en.name}{?postalCodes}{?q}`

## Example API Doc

## Sub Districts API [/subDistricts{?no}{?key}{?provinceKey}{?districtKey}{?translations.th.name}{?translations.en.name}{?postalCodes}{?q}]

### GET DATA [GET]

+ Parameters

    + no: `32` (number, optional) - retrive data `no` equal `32`.
    + key: `100508` (string, optional) - retrive data `key` equal `100508`.
    + translations.th.name: `ท่าแร้ง` (string, optional) - retrive data `translations.th.name` equal `ท่าแร้ง`.
    + translations.en.name: `Tha Raeng` (string, optional) - retrive data `translations.en.name` equal `Tha Raeng`.
    + postalCodes: `10220` (string, optional) - retrive data `postalCodes` equal `10220` in array.
    + q: `Tha` (string, optional) - search all value contain `Tha` *___when use 'q' ignore another fields and don't support in array value search___

+ Response 200 (application/json)

    + Body

            [
                {
                    "no": 32,
                    "key": "100508",
                    "provinceKey": "10",
                    "districtKey": "1005",
                    "postalCodes": [
                        10220,
                        10230
                    ],
                    "translations": {
                        "th": {
                            "name": "ท่าแร้ง"
                        },
                        "en": {
                            "name": "Tha Raeng"
                        }
                    }
                }
            ]

### Enviroment Variable

- `PORT` :  **default `3000`**
- `DATA_URL` :  **default [data](https://raw.githubusercontent.com/Jdemon/fastify-json-data-filter/main/resources/data.json)**
- `CACHE_TTL` :  **default `600` -> 10 mins** ___*cache time out(seconds)___

## Reference

- [Master Data](https://github.com/ThepExcel/download/blob/master/ThepExcel-Thailand-Tambon.xlsx)