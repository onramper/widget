import React from "react";
import OnramperWidget from "@onramper/widget";

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
const fontFamily = getParam("fontFamily", "'Roboto', sans-serif");
const defaultAmount = Number(getParam("defaultAmount", "100"));
const defaultCrypto = getParam("defaultCrypto", "BTC");
const defaultFiat = getParam("defaultFiat");
const defaultFiatSoft = getParam("defaultFiatSoft");
const defaultPaymentMethod = getParam("defaultPaymentMethod");
const addresses = getAddressesParam();
const onlyCryptos = getArrayParam("onlyCryptos");
const excludeCryptos = getArrayParam("excludeCryptos");
const onlyPaymentMethods = getArrayParam("onlyPaymentMethods");
const excludePaymentMethods = getArrayParam("excludePaymentMethods");
const excludeFiat = getArrayParam("excludeFiat");
const onlyGateways = getArrayParam("onlyGateways");
const onlyFiat = getArrayParam("onlyFiat");
const country = getParam("country");
const isAddressEditable = getParam("isAddressEditable");
const wallets = getWalletsParam();
const displayChatBubble = getParam("displayChatBubble")
const amountInCrypto = getParam("amountInCrypto")
const gFontPath = getParam("gFontPath", 'css2?family=Roboto:wght@400;500&display=swap')

if (gFontPath)
  loadGoogleFont(gFontPath)

function App() {

  const style = {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    backgroundColor: inIframe() ? "transparent" : "whitesmoke"
  } as React.CSSProperties;

  return (
    <>
      <div style={style}>
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
            filters={{
              onlyCryptos: onlyCryptos,
              excludeCryptos: excludeCryptos,
              onlyPaymentMethods: onlyPaymentMethods,
              excludePaymentMethods: excludePaymentMethods,
              excludeFiat: excludeFiat,
              onlyGateways: onlyGateways,
              onlyFiat: onlyFiat,
            }}
            country={country}
            isAddressEditable={isAddressEditable === undefined ? undefined : isAddressEditable === "true"}
            displayChatBubble={displayChatBubble === undefined ? undefined : displayChatBubble === "true"}
            amountInCrypto={amountInCrypto === undefined ? undefined : amountInCrypto === "true"}
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
    .reduce((acc, wallet) => {
      const paramSplitted = wallet.split(":")
      const denom = paramSplitted[0];
      const walletAddr = paramSplitted.slice(1).join(":").split(";")
      if (walletAddr && walletAddr.length > 2) return acc;
      let address;
      let memo;
      if (walletAddr.length >= 1) address = walletAddr[0];
      if (walletAddr.length === 2) memo = walletAddr[1];
      return {
        ...acc,
        [denom]: { address, memo },
      };
    }, {});
}

function getAddressesParam() {
  const addrs = JSON.parse(getParam("addresses", "{}") ?? "{}")
  return Object.entries(addrs).reduce((acc, [key, address]) => {
    return {
      ...acc,
      [key]: { address }
    }
  }, {})
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function loadGoogleFont (gFontPath: string) {
  const css = `@import url('https://fonts.googleapis.com/${gFontPath}');`
  const head = document.getElementsByTagName('head')[0]
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  /* head.appendChild(style); */
  head.prepend(style)
}


export default App;
