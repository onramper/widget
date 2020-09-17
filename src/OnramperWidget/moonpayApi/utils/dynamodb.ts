export function constructKey(PK:string, SK:string){
  return `${PK}:${SK}`;
}

function getItem(key:string){
  const item = localStorage.getItem(key);
  if(item === null){
    return undefined;
  }
  return JSON.parse(item);
}

export interface Keys {PK:string, SK:string}

export default {
  get: async ({PK, SK}:Keys) =>
    getItem(constructKey(PK, SK)),
  put: async (params: Keys & {
    [key: string]: any;
  }) =>
    localStorage.setItem(constructKey(params.PK, params.SK), JSON.stringify(params)),
  scan: () => 
    Object.keys(localStorage).map(key=>getItem(key)),
};
