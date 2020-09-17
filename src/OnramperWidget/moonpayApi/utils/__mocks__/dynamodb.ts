import {constructKey, Keys} from '../dynamodb'

const storage = {} as {
    [key:string]:any
};

export default {
    get: async ({PK, SK}:Keys) => {
          const res = storage[constructKey(PK, SK)];
          if(res===undefined){
              throw new Error(`Key ${constructKey(PK, SK)} not in storage`)
          }
          return res;
      },
    put: async (params: Keys & {
      [key: string]: any;
    }) =>
      storage[constructKey(params.PK, params.SK)] = params,
    scan: async () => Object.values(storage),
  };
  