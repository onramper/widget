import React from "react";
import ReactDOM from "react-dom";
import ErrorView from "./common/ErrorView";
import styles from "./styles.module.css";
import { NavProvider, NavContainer } from "./NavContext";
import { APIProvider } from "./ApiContext";
import type { APIProviderType } from "./ApiContext";
import "./polyfills/composedpath.polyfill";
import { ErrorBoundary } from "@sentry/react";
import { on, EVENTS } from "./Onramper";

import "./i18n/config";

import "./isolateinheritance.css";
import "./normalize.min.css";
import { GTM_ID } from "./ApiContext/api/constants";
import { GTMProvider } from "./hooks/gtm";
import Cookies from "js-cookie";
import BaseScreenView from "./BaseScreenView";

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

  const gtmParams = {
    gtmId: GTM_ID,
    dataLayer: { apiKey: props.API_KEY, clientId: Cookies.get("_ga") },
  };

  return (
    <div
      key={flagRestart}
      id="main"
      style={style}
      className={`isolate-inheritance ${styles.theme} ${className} ${
        props.darkMode ? styles.dark : ""
      }`}
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
        <GTMProvider state={gtmParams}>
          <NavProvider>
            <APIProvider
              API_KEY={props.API_KEY}
              defaultAmount={
                props.skipTransactionScreen &&
                !isNaN(props.transaction.txnAmount!)
                  ? props.transaction.txnAmount
                  : props.defaultAmount
              }
              defaultAddrs={props.defaultAddrs}
              defaultCrypto={
                props.skipTransactionScreen
                  ? props.transaction.txnCrypto
                  : props.defaultCrypto
              }
              defaultFiat={
                props.skipTransactionScreen
                  ? props.transaction.txnFiat
                  : props.defaultFiat
              }
              defaultFiatSoft={props.defaultFiatSoft}
              defaultPaymentMethod={
                props.skipTransactionScreen
                  ? [props.transaction.txnPaymentMethod]
                  : props.defaultPaymentMethod
              }
              filters={props.filters}
              country={props.country}
              language={props.language}
              isAddressEditable={props.isAddressEditable}
              themeColor={color.slice(1)}
              displayChatBubble={props.displayChatBubble}
              amountInCrypto={props.amountInCrypto}
              partnerContext={props.partnerContext}
              redirectURL={props.redirectURL}
              minAmountEur={props.minAmountEur}
              supportSell={props.supportSell}
              supportBuy={props.supportBuy}
              supportSwap={props.supportSwap}
              isAmountEditable={props.isAmountEditable}
              recommendedCryptoCurrencies={props.recommendedCryptoCurrencies}
              selectGatewayBy={props.selectGatewayBy}
              skipTransactionScreen={props.skipTransactionScreen}
              transaction={props.transaction}
              initScreen={props.initScreen}
              queryParams={window.location.search}
            >
              <div style={{ flexGrow: 1, display: "flex" }}>
                <NavContainer home={<BaseScreenView />} />
              </div>
            </APIProvider>
          </NavProvider>
        </GTMProvider>
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
