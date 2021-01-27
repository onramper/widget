import React from "react";
import OnramperWidget from "@onramper/widget";
/* import Web3 from "web3"; */

const com_key = "pk_prod_trQ0nGBcmU_JY41N8Tl50Q00";
const dev_key = "pk_test_oDsXkHokDdr06zZ0_sxJGw00";

const defaultApiKey =
  window.self !== window.top
    ? undefined
    : window.location.origin.split(".")[2] === "com"
    ? com_key
    : dev_key;

const apiKey = getParam("apiKey", defaultApiKey);
const defaultColor = `#${getParam("color", "266678")}`;
const fontFamily = getParam("fontFamily");
const defaultAmount = Number(getParam("defaultAmount", "100"));
const defaultCrypto = getParam("defaultCrypto", "BTC");
const defaultFiat = getParam("defaultFiat");
const defaultFiatSoft = getParam("defaultFiatSoft");
const defaultPaymentMethod = getParam("defaultPaymentMethod");
const addresses = JSON.parse(getParam("addresses", "{}") ?? "{}");
const onlyCryptos = getArrayParam("onlyCryptos");
const excludeCryptos = getArrayParam("excludeCryptos");
const onlyPaymentMethods = getArrayParam("onlyPaymentMethods");
const excludePaymentMethods = getArrayParam("excludePaymentMethods");
const excludeFiat = getArrayParam("excludeFiat");
const onlyGateways = getArrayParam("onlyGateways");
const onlyFiat = getArrayParam("onlyFiat");
const country = getParam("country");
/* let isAddressEditable = getParam("isAddressEditable", "true"); */
//let wallets = getWalletsParam();

const erc20Coins = [
  "AAVE",
  "BAND",
  "BAT",
  "CHZ",
  "COMP",
  "CVC",
  "DAI",
  "ETH",
  "FUN",
  "LINK",
  "MANA",
  "MATIC",
  "MKR",
  "OCEAN",
  "OKB",
  "OM",
  "OMG",
  "PAX",
  "PAXG",
  "REP",
  "STMX",
  "TUSD",
  "UNI",
  "USDC",
  "USDT",
  "WBTC",
  "ZRX",
  "ETH"
];

function App() {
  const [wallets, setWallets] = React.useState(getWalletsParam());
  const [isAddressEditable, setIsAddressEditable] = React.useState(
    getParam("isAddressEditable", "true")
  );

  React.useEffect(() => {
    const d = async () => {
      /* let web3: Web3; */
      if (window.ethereum) {
        const ethereum = window.ethereum as any;
        /* web3 = new Web3(ethereum as any); */
        try {
          // Request account access if needed
          if (ethereum.isImToken) {
            await ethereum.enable().then((w: string[]) => {
              setIsAddressEditable("false");
              setWallets((old) => ({
                ...old,
                ...(erc20Coins.reduce((acc, act)=>({...acc, [act]:w[0]}), {}))
              }));
            });
          }
          // Acccounts now exposed
        } catch (error) {
          // User denied account access...
        }
      }
    };
    d();
  }, []);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        {/*         <div className={'onramper-pane'}></div> */}
        <div className={"widget-container"}>
          <OnramperWidget
            API_KEY={apiKey}
            color={defaultColor}
            fontFamily={fontFamily}
            defaultAddrs={wallets || addresses}
            defaultAmount={defaultAmount}
            defaultCrypto={defaultCrypto}
            defaultFiat={defaultFiat}
            defaultFiatSoft={defaultFiatSoft}
            defaultPaymentMethod={defaultPaymentMethod}
            onlyCryptos={onlyCryptos}
            excludeCryptos={excludeCryptos}
            onlyPaymentMethods={onlyPaymentMethods}
            excludePaymentMethods={excludePaymentMethods}
            excludeFiat={excludeFiat}
            onlyGateways={onlyGateways}
            onlyFiat={onlyFiat}
            country={country}
            isAddressEditable={isAddressEditable === "true"}
          />
        </div>
      </div>
    </>
  );
}

function getParam(name: string, defaultValue?: string): string | undefined {
  const value = new URLSearchParams(window.location.search).get(name);
  if (value === null) {
    if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      //throw new Error(`Parameter ${name} has not been provided in the query string`)
      return undefined;
    }
  }
  return value;
}

function getArrayParam(paramName: string) {
  return getParam(paramName, undefined)
    ?.split(",")
    .map((code) => code.trim());
}

function getWalletsParam() {
  return getParam("wallets", undefined)
    ?.split(",")
    .reduce(
      (acc, wallet) => ({
        ...acc,
        [wallet.split(":")?.[0]]: wallet.split(":")?.[1],
      }),
      {}
    );
}

export default App;
