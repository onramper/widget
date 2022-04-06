import React from "react";
import ReactDOM from "react-dom";
import styles from "./styles.module.css";
// import BuyCryptoView from "./BuyCryptoView";
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
import SwapCryptoView from "./SwapCryptoView";
import { TransactionContextProvider } from "./TransactionContext";
import { NotificationProvider } from "./NotificationContext";
// import { PaymentProgressView } from "./steps/PaymentProgressView";

type OnramperWidgetProps = Omit<APIProviderType, "themeColor"> & {
  color?: string;
  fontFamily?: string;
  className?: string;
  displayChatBubble?: boolean;
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
                    <NavContainer
                      home={
                        <SwapCryptoView />
                        // <PaymentProgressView
                        //   gateway="moonpay"
                        //   tokenIn={{
                        //     name: "Wrapped Ether",
                        //     address:
                        //       "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                        //     symbol: "WETH",
                        //     decimals: 18,
                        //     chainId: 4,
                        //     logoURI:
                        //       "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                        //   }}
                        //   tokenOut={{
                        //     name: "Uniswap",
                        //     address:
                        //       "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
                        //     symbol: "UNI",
                        //     decimals: 18,
                        //     chainId: 4,
                        //     logoURI:
                        //       "ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg",
                        //   }}
                        // />
                      }
                    />
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
