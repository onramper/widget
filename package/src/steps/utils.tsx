const areAllKeysFilled_prod = (
  obj: { [key: string]: string },
  keysList: string[],
  exclude: string[] = []
) => {
  return !keysList.some((key) => {
    if (obj[key]) return false;
    else if (exclude.some((excludedKey) => excludedKey === key)) return false;
    else return true;
  });
};

const areAllKeysFilled =
  process.env.STAGE === "demo" ? () => true : areAllKeysFilled_prod;

const isFileUploaded =
  process.env.STAGE === "demo"
    ? () => true
    : (files: File[]) => files.length > 0;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { areAllKeysFilled, isFileUploaded, delay };
