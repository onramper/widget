import React from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.css";
import BuyCryptoView from "./BuyCryptoView";
import ErrorView from "./common/ErrorView";
import { NavProvider, NavContainer } from "./NavContext";
import { APIProvider } from "./ApiContext";
import type { APIProviderType } from "./ApiContext";
import "./polyfills/composedpath.polyfill";
import { ErrorBoundary } from "@sentry/react";
import { on, EVENTS } from "./Onramper";
import "./isolateinheritance.css";
import "./normalize.min.css";
import { L2Provider } from "layer2";
import { TransactionContextProvider } from "./TransactionContext";
import { NotificationProvider } from "./NotificationContext";
import SwapOverviewView from "./steps/SwapOverviewView/SwapOverviewView";
import { SwapOverviewViewProps } from "./steps/SwapOverviewView/SwapOverviewView.models";

type OnramperWidgetProps = Omit<APIProviderType, "themeColor"> & {
  color?: string;
  fontFamily?: string;
  className?: string;
  displayChatBubble?: boolean;
};
// const res = {
//   type: "redirect",
//   url: "https://buy-staging.moonpay.com?apiKey=pk_test_PjABKr88VlgosyTueq3exrVnYYLd4ZB&currencyCode=ETH&baseCurrencyAmount=200&baseCurrencyCode=EUR&externalTransactionId=UGF8MxyjgB8pjWdiE8I9Cg--&lockAmount=true",
//   txId: "UGF8MxyjgB8pjWdiE8I9Cg--",
//   apiKey: "pk_test_oDsXkHokDdr06zZ0_sxJGw00",
//   inCurrency: "EUR",
//   timestamp: 1654004424105,
//   ip: "127.0.0.1",
//   outCurrency: "ETH",
//   lastStatus_date: "init#2022-05-31T13:40:24.105Z",
//   inAmount: 200,
//   lastStatus: "init",
//   outAmount: 200,
//   countryIp: "es",
//   gatewayId: 0,
//   host: "localhost:3001",
//   onramperFee: 1,
//   partnerFee: 0,
//   SK: "tx#metadata",
//   paymentMethod: 0,
//   PK: "tx#UGF8MxyjgB8pjWdiE8I9Cg--",
//   customerCrypto: "ALICE_ETH",
//   customerGateway: "Moonpay_Uniswap",
//   transactionType: "L2",
//   expectedReceivedCrypto: 200,
//   l2TokenOutAmount: 200,
//   l2TokenData: {
//     name: "My Neighbor Alice",
//     symbol: "ALICE",
//     address: "0xAC51066d7bEC65Dc4589368da368b212745d63E8",
//     logoURI:
//       "https://assets.coingecko.com/coins/images/14375/thumb/alice_logo.jpg?1615782968",
//     chainId: 1,
//     decimals: 6,
//   },
// };
const startProps: SwapOverviewViewProps = {
  nextStep: {
    type: "swapOverview",
    progress: 80,
    amountIn: 0.005,
    amountOut: 0,
    tokenIn: {
      name: "Wrapped Ether",
      address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      symbol: "WETH",
      decimals: 18,
      chainId: 3,
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    },
    tokenOut: {
      name: "Onramper Test Token",
      symbol: "OTT",
      address: "0xBe8AFb431f18C126a69B79E87cA3016936D7060C",
      logoURI:
        "https://pbs.twimg.com/profile_images/1309065154856980480/dXJItCo4_400x400.jpg",
      chainId: 3,
      decimals: 18,
    },
    fiatSymbol: "$",
    userId: "",
    txId: "Arf4m7ZCTeH7nM9v8KFXmg--",
  },
};

const OnramperWidget: React.FC<OnramperWidgetProps> = (props) => {
  const [flagRestart, setFlagRestart] = React.useState(0);

  const {
    color = "#0316C1",
    fontFamily = props.fontFamily,
    className = "",
  } = props;

  const style = {
    "--primary-color": color,
    "--font-family": fontFamily,
  } as React.CSSProperties;

  return (
    <div
      key={flagRestart}
      id="main"
      style={style}
      className={`isolate-inheritance ${styles.theme} ${className}`}
    >
      <ErrorBoundary
        fallback={({ resetError }) => (
          <ErrorView type="CRASH" callback={resetError} />
        )}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
          setFlagRestart((old) => ++old);
        }}
      >
        <L2Provider>
          <NavProvider>
            <APIProvider
              API_KEY={props.API_KEY}
              defaultAmount={props.defaultAmount}
              defaultAddrs={props.defaultAddrs}
              defaultCrypto={props.defaultCrypto}
              defaultFiat={props.defaultFiat}
              defaultFiatSoft={props.defaultFiatSoft}
              defaultPaymentMethod={props.defaultPaymentMethod}
              filters={props.filters}
              country={props.country}
              isAddressEditable={props.isAddressEditable}
              themeColor={color.slice(1)}
              displayChatBubble={props.displayChatBubble}
              amountInCrypto={props.amountInCrypto}
              partnerContext={props.partnerContext}
              redirectURL={props.redirectURL}
              minAmountEur={props.minAmountEur}
              supportSell={props.supportSell}
              supportBuy={props.supportBuy}
              isAmountEditable={props.isAmountEditable}
              recommendedCryptoCurrencies={props.recommendedCryptoCurrencies}
            >
              <TransactionContextProvider>
                <NotificationProvider>
                  <div style={{ flexGrow: 1, display: "flex" }}>
                    <NavContainer home={<BuyCryptoView />} />
                  </div>
                </NotificationProvider>
              </TransactionContextProvider>
            </APIProvider>
          </NavProvider>
        </L2Provider>
      </ErrorBoundary>
    </div>
  );
};

const initialize = (selector: string, props: OnramperWidgetProps) => {
  const domContainer = document.querySelector(selector);
  ReactDOM.render(<OnramperWidget {...props} />, domContainer);
};

export interface EventContext {
  type: string;
  gateway: string;
  trackingUrl?: string;
}

const ev = { ...EVENTS };
const Onramper = {
  on,
  EVENTS: ev,
} as {
  on: (event_type: string, cb: (ctx: EventContext) => void) => void;
  EVENTS: typeof ev;
};

export default (props: OnramperWidgetProps) => <OnramperWidget {...props} />;
export { initialize, Onramper };
