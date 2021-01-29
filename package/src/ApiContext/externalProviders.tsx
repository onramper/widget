import ERC20COINS from "./utils/erc20Coins";

export enum Provider {
  Metamask = "Metamask",
  imToken = "imToken",
}

let providerName: Provider | undefined;
let _cryptoCode: string | undefined;
let _cryptoName: string | null = null;

const providerIsPresent = (cryptoCode?: string, cryptoName?: string) => {
  if (!cryptoCode || !cryptoName) return false;
  if (ERC20COINS.includes(cryptoCode.toUpperCase()))
    return typeof window.ethereum !== "undefined";
};

const connect = (cryptoCode: string, cryptoName?: string) => {
  providerName = undefined;
  _cryptoCode = cryptoCode.toUpperCase();
  _cryptoName = cryptoName ? cryptoName.toUpperCase() : null;
  if (ERC20COINS.includes(_cryptoCode.toUpperCase())) _cryptoName = "ETHEREUM";

  // IMTOKEN
  if (
    IMTOKEN_supportedCryptos.includes(cryptoCode.toUpperCase()) ||
    (IMTOKEN_supportedCryptos.includes("ETH") &&
      ERC20COINS.includes(cryptoCode.toUpperCase()))
  ) {
    if (!(typeof window.ethereum !== "undefined")) return false;
    if (window.ethereum.isImToken) {
      providerName = Provider.imToken;
      return true;
    }
  }

  // METAMASK
  if (ERC20COINS.includes(cryptoCode.toUpperCase())) {
    if (!(typeof window.ethereum !== "undefined")) return false;
    if (window.ethereum.isMetaMask) {
      providerName = Provider.Metamask;
      return true;
    }
  }

  return false;
};

const isdApp = () => {
  if (!providerName) return false;
  if ([Provider.imToken].includes(providerName)) return true;
};

const getAccounts = async (): Promise<
  { [cryptoCode: string]: string } | undefined
> => {
  if (providerName === Provider.imToken) return getImTokenAccounts();
  else if (providerName === Provider.Metamask) return getMetamaskAccounts();
};

/**
 * metamask
 */

const getMetamaskAccounts = async () => {
  try {
    const eth_account = await window.ethereum!.enable();
    return ERC20COINS.reduce(
      (acc, act) => ({ ...acc, [act]: eth_account[0] }),
      {}
    );
  } catch {
    return undefined;
  }
};

/**
 * imToken
 */

const IMTOKEN_supportedCryptos = [
  "ETH",
  "BTC",
  "ATOM",
  "EOS",
  "TRX",
  "CKB",
  "BCH",
  "LTC",
  "KSM",
  "DOT",
  "FIL",
  "XTZ",
];

const getImTokenAccounts = async () => {
  const imToken = (window as any).imToken;
  try {
    let accounts = {};
    /*     const eth_account = await window.ethereum!.enable();
    accounts = {
      ...accounts,
      ...ERC20COINS.reduce(
        (acc, act) => ({ ...acc, [act]: eth_account[0] }),
        {}
      ),
    }; */

    const account = await imToken.callPromisifyAPI("user.showAccountSwitch", {
      chainType: _cryptoName,
    });

    accounts = {
      ...accounts,
      [_cryptoCode ?? "default"]: account,
    };

    if (_cryptoName === "ETHEREUM")
      accounts = {
        ...accounts,
        ...ERC20COINS.reduce((acc, act) => ({ ...acc, [act]: account }), {}),
      };

    imToken.callAPI("native.toast", {
      type: "success",
      message: "Address successfully imported",
      align: "bottom",
      model: "banner",
      duration: 1000 * 3,
    });

    return accounts;
  } catch (error) {
    imToken.callAPI("native.toast", {
      type: "info",
      message: error.message,
      align: "top",
      model: "banner",
      duration: 1000 * 3,
    });
    return undefined;
  }
};

export { providerIsPresent, connect, isdApp, getAccounts, providerName };
