import { TokenInfo } from "layer2";
import { GatewayRateOption } from "./ApiContext";

const isFirefox = (userAgent: string): boolean => {
  return userAgent.includes("Firefox");
};

const isChromium = (userAgent: string): boolean => {
  return userAgent.includes("Chrome");
};

export const browserSupportsMetamask = (): boolean => {
  const userAgent = window.navigator.userAgent;
  // Metamask only on Firefox & Chromium browsers (Brave, Chrome etc)
  if (isFirefox(userAgent) || isChromium(userAgent)) {
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
      return ["https" + uri.substr(4), uri];
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

export function getBestAvailableGateway(
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
