import { BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { TokenInfo } from "layer2";
import { GatewayRateOption } from "./ApiContext";
import { StaticRoutingItemType } from "./ApiContext/initialState";
import { lifi } from "./web3/lifi";

export const knownDexes = ["LIFI", "UNISWAP"];

export const lifiNativeTokens = async (): Promise<TokenInfo[]> => {
  const res = await lifi.getChains();
  return res.map((chain) => {
    return {
      chainId: Number(chain.metamask.chainId),
      symbol: chain.metamask.nativeCurrency.symbol,
      address: "0x0000000000000000000000000000000000000000",
      name: chain.metamask.nativeCurrency.name,
      decimals: chain.metamask.nativeCurrency.decimals,
      logoURI: chain.logoURI,
    };
  });
};

// for now we just do ethereum,
export const getNativeToken = async (chainId: number): Promise<TokenInfo> => {
  const chainTokens = await lifiNativeTokens();

  if (chainTokens) {
    const nativeToken = chainTokens.find((chain) => chain.chainId === chainId);
    if (nativeToken) {
      return nativeToken;
    }
  }

  throw new Error("Chain not supported!");
};

export const trimLargeNumber = (
  num: string | number,
  trailingDecimals: number
): string => {
  if (typeof num === "number") {
    return num.toFixed(trailingDecimals);
  }
  return Number(num).toFixed(trailingDecimals);
};
export const formatTokenAmount = (
  token: TokenInfo,
  amount: BigNumberish
): string => {
  const { decimals } = token;
  return formatUnits(amount, decimals);
};
// for quote api
export const apiKey = "oIMeQOqDsg9vFAs6WU1ks2hFxZ32DONF4MkhyDyI";

export const getDexFromGateway = (
  gateway: string | undefined
): string | undefined => {
  if (!gateway) return undefined;
  return gateway.toUpperCase().split("_").at(-1);
};

// Moonpay_Uniswap => true
export const isL2Gateway = (gateway: string | undefined): boolean => {
  if (gateway === undefined) return false;

  const dex = getDexFromGateway(gateway);
  if (dex === undefined) return false;
  return knownDexes.includes(dex);
};

export const isTransactionHash = (hash: string) => {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};

export const isMobile = (): boolean => {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
      navigator.userAgent.substring(0, 4)
    )
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */

export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

// 500 => "0.05%"
export const getFeePercentString = (fee: number): string => {
  return fee > 0 ? `${(fee / 10000).toFixed(2)}%` : "0%";
};

const isFirefox = (userAgent: string): boolean => {
  return userAgent.includes("Firefox");
};

const isChromium = (userAgent: string): boolean => {
  return userAgent.includes("Chrome");
};

const isOpera = (userAgent: string): boolean => {
  return /Opera|OPR\//.test(userAgent);
};

export const browserSupportsMetamask = (): boolean => {
  const userAgent = window.navigator.userAgent;
  // Metamask only on Firefox & Chromium browsers (Brave, Chrome etc)
  if (isFirefox(userAgent) || (isChromium(userAgent) && !isOpera(userAgent))) {
    return true;
  } else {
    return false;
  }
};

/**
 * this functions takes a token object as an argument and modifies the display name and symbol IF the token's symbol is "WETH". this is for display purposes, we don't want to confuse the user by showing "wrapped ether" instead of "ether"
 * @param token standard Token interface (check if weth)
 */
export const parseWrappedTokens = (token: TokenInfo): TokenInfo => {
  if (token.symbol === "WETH") {
    return {
      ...token,
      symbol: "ETH",
      name: "Ether",
    };
  } else {
    return token;
  }
};

/**
 * Given a URI that may be ipfs, ipns, http, https, ar, or data protocol, return the fetch-able http(s) URLs for the same content
 * @param  {string} uri to convert to fetch-able http url
 */
export default function uriToHttp(uri: string): string[] {
  const protocol = uri.split(":")[0].toLowerCase();
  switch (protocol) {
    case "data":
      return [uri];
    case "https":
      return [uri];
    case "http":
      return ["https" + uri.substring(4), uri];
    case "ipfs":
      return [
        `https://cloudflare-ipfs.com/ipfs/${
          uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2]
        }/`,
        `https://ipfs.io/ipfs/${uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2]}/`,
      ];
    case "ipns":
      return [
        `https://cloudflare-ipfs.com/ipns/${
          uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2]
        }/`,
        `https://ipfs.io/ipns/${uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2]}/`,
      ];
    case "ar":
      return [`https://arweave.net/${uri.match(/^ar:(\/\/)?(.*)$/i)?.[2]}`];
    default:
      return [];
  }
}

export const copyToClipBoard = async (
  text: string,
  copied: (status: boolean, text: string) => void
) => {
  try {
    await navigator.clipboard.writeText(text);
    copied(true, text);
  } catch (err) {
    copied(false, text);
  }
};

export const arrayUnique = (array: any[]) => {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
};

export const arrayObjUnique = (array: any[], attrFilter: string) => {
  return array.filter(
    (value: any, index: number, self: any) =>
      self.findIndex((el: any) => el[attrFilter] === value[attrFilter]) ===
      index
  );
};

export const toMaxDecimalsFloor = (n: number | string, decimals: number) => {
  const amount = typeof n === "string" ? Number(n.replace(",", ".")) : n;
  const factor = Number("1e" + decimals);
  const nRound = Math.floor(amount * factor) / factor;
  return !isFinite(nRound) ? 0 : nRound;
};

export const toMaxDecimalsRound = (n: number | string, decimals: number) => {
  const amount = typeof n === "string" ? Number(n.replace(",", ".")) : n;
  const factor = Number("1e" + decimals);
  const nRound = Math.round(amount * factor) / factor;
  return !isFinite(nRound) ? 0 : nRound;
};

const ordredMagnitudes = [
  { magnitude: "seconds", magnitudeShort: "s", factor: 1 },
  { magnitude: "minutes", magnitudeShort: "m", factor: 60 },
  { magnitude: "hours", magnitudeShort: "h", factor: 3600 },
  { magnitude: "days", magnitudeShort: "d", factor: 86400 },
];
export const formatSeconds = (s: number) => {
  let value = s;
  let i = 0;
  for (i; i < ordredMagnitudes.length; i++) {
    const nextValue = s / ordredMagnitudes[i].factor;
    if (nextValue < 1) break;
    value = nextValue;
  }
  return {
    n: value,
    magnitude: ordredMagnitudes[i - 1].magnitude,
    magnitudeShort: ordredMagnitudes[i - 1].magnitudeShort,
  };
};

export const scrollTo = (
  element: HTMLElement | null,
  to: number,
  duration: number
) => {
  //t = current time
  //b = start value
  //c = change in value
  //d = duration
  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  if (element === null) return;
  const start = element.scrollTop;
  const change = to - start;
  let currentTime = 0;
  const increment = 20;

  const animateScroll = function () {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
};

let lastId = 0;
export function idGenerator(prefix = "id") {
  return `${prefix}${lastId++}`;
}

export function onChangeTextNumber(
  targetValue: string,
  precision: number = 1
): string | number | false {
  let value: string | number = targetValue.replace(",", ".");
  if (value.split(".").length > 2 || !isFinite(Number(value))) return false;

  if (
    !value.match(/\.(0+)?$|,(0+)?$|^\.(0+)?|^,(0+)?/) &&
    value !== "" &&
    value.charAt(value.length - 1) !== "0"
  ) {
    value = toMaxDecimalsRound(value ?? 0, precision ?? 1);
  }

  if (value !== 0 && value !== "" && !value) return false;

  return value;
}

export function toStringOrDefault(value: number | undefined) {
  return String(value || 0);
}

export const getArrOfMinsMaxs = (
  list: { name: string; value: number }[],
  min: boolean
) => {
  let lowest = min ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  let tmp;
  let easiests: string[] = [];

  for (let i = list.length - 1; i >= 0; i--) {
    tmp = list[i].value;
    if (min) {
      if (tmp < lowest) {
        lowest = tmp;
        easiests = [list[i].name];
      } else if (tmp === lowest) {
        lowest = tmp;
        easiests.push(list[i].name);
      }
    } else {
      if (tmp > lowest) {
        lowest = tmp;
        easiests = [list[i].name];
      } else if (tmp === lowest) {
        lowest = tmp;
        easiests.push(list[i].name);
      }
    }
  }
  return easiests;
};

export function getBestGatewayByPrice(
  allRates: GatewayRateOption[],
  amountInCrypto: boolean
) {
  let lowest = amountInCrypto
    ? Number.POSITIVE_INFINITY
    : Number.NEGATIVE_INFINITY;
  const comparator = (tmp: number, lowest: number) =>
    amountInCrypto ? tmp < lowest : tmp > lowest;
  const availbaleRates = allRates.filter((item) => item.available);

  let bestGateway: GatewayRateOption | undefined;
  for (let i = availbaleRates.length - 1; i >= 0; i--) {
    const amount = availbaleRates[i].receivedCrypto ?? 0;
    if (comparator(amount, lowest)) {
      lowest = amount;
      bestGateway = availbaleRates[i];
    }
  }

  return bestGateway;
}

/**
 * selects best success-reliable gateway based on given fiat->crypto
 * uses best price as fallback
 * @param allRates
 * @param amountInCrypto
 * @param fiat
 * @param crypto
 * @param staticRouting
 */
export function getBestGatewayByPerformance(
  allRates: GatewayRateOption[],
  fiat?: string,
  crypto?: string,
  staticRouting?: StaticRoutingItemType[]
) {
  const bestGatewayName = staticRouting
    ?.find((i) => i.fiat === fiat && i.crypto === crypto)
    ?.gateway?.toLowerCase();
  if (!bestGatewayName) {
    return null;
  }

  const bestGateway = allRates
    .filter((item) => item.available)
    .find((i) => i.name?.toLocaleLowerCase() === bestGatewayName);
  if (!bestGateway) {
    return null;
  }
  return bestGateway;
}

export const onChangeFloat = (
  e: React.ChangeEvent<HTMLInputElement>,
  updateValue: (value: string) => void
) => {
  const inputFilter = (value: string) => /^-?\d*[.]?\d*$/.test(value);
  const target = e.target;
  if (inputFilter(target.value)) {
    updateValue(e.target.value);
    return;
  }
  return false;
};

//ADD TYPES
/* export function usePromise(promiseOrFunction, defaultValue) {
    const [state, setState] = React.useState({ value: defaultValue, error: null, isPending: true })

    React.useEffect(() => {
        const promise = (typeof promiseOrFunction === 'function')
            ? promiseOrFunction()
            : promiseOrFunction

        let isSubscribed = true
        promise
            .then(value => isSubscribed ? setState({ value, error: null, isPending: false }) : null)
            .catch(error => isSubscribed ? setState({ value: defaultValue, error: error, isPending: false }) : null)

        return () => (isSubscribed = false)
    }, [promiseOrFunction, defaultValue])

    const { value, error, isPending } = state
    return [value, error, isPending]
} */
