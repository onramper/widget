import React, { useEffect, useState } from "react";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import commonClasses from "../../styles.module.css";
import classes from "./PaymentProgressView.module.css";
import { ReactComponent as Mail } from "../../icons/mail.svg";
import Heading from "../../common/Heading/Heading";
import { SingleNotification } from "../WidgetNotification/WidgetNotification";
import { NotificationType } from "../../NotificationContext";
import { QuoteDetails, resolveWeth, TokenInfo, uriToHttp } from "layer2";
import { ReactComponent as Wallet } from "../../icons/wallet2.svg";
import Spinner from "../../common/Spinner";
import { ReactComponent as Check } from "../../icons/check.svg";
import { ImageWithFallback } from "../../common/ImageWithFallback/ImageWithFallback";
import { ReactComponent as Fallback } from "../../icons/fallback_token_icon.svg";
import { ReactComponent as Chevron } from "../../icons/chevron2.svg";
import { ReactComponent as CheckCircle } from "../../icons/check_circle.svg";
import { ReactComponent as Error } from "../../icons/close_circle.svg";
import { PaymentProgressViewProps, Status } from "./PaymentProgressView.models";
import { pollTransaction } from "../../ApiContext/api";
import { useNav } from "../../NavContext";
import SwapOverviewView from "../SwapOverviewView/SwapOverviewView";

const defaults: {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  gatewayAndDex: string;
  txId: string;
} = {
  tokenIn: {
    name: "Input Token Name",
    address: "In address",
    symbol: "WETH",
    decimals: 18,
    chainId: 3,
    logoURI: "",
  },
  tokenOut: {
    name: "Output Token Name",
    address: "output token address",
    symbol: "OUT",
    decimals: 18,
    chainId: 3,
    logoURI: "",
  },
  gatewayAndDex: "Gateway_DExchange",
  txId: "--some--random--L1--tx--id--",
};

export const PaymentProgressView = ({
  nextStep: {
    gatewayAndDex = defaults.gatewayAndDex,
    tokenIn = defaults.tokenIn,
    tokenOut = defaults.tokenOut,
    txId = defaults.txId,
  },
}: PaymentProgressViewProps) => {
  const [layer1Status, setLayer1Status] = useState<Status>(Status.Pending);
  const symbolInUpper = resolveWeth(tokenIn).symbol.toUpperCase();
  const symbolOutUpper = tokenOut.symbol.toUpperCase();
  const [userAddress, setUserAddress] = useState<string>("");
  const { nextScreen } = useNav();

  useEffect(() => {
    const interval = setInterval(async () => {
      const tx = await pollTransaction(txId);
      if (tx && tx.lastStatus === "ok") {
        setLayer1Status(Status.Success);
        setUserAddress(tx.cryptocurrencyAddress);
        clearInterval(interval);
      }
      if (tx && tx.lastStatus === "rip") {
        setLayer1Status(Status.Fail);
        clearInterval(interval);
      }
    }, 2000);
    //eslint-disable-next-line
  }, []);

  const tokenOutURL = uriToHttp(tokenOut.logoURI as string)[0] ?? "";

  const heading = (): string => {
    if (layer1Status === Status.Pending) {
      return "Order in Progress. Receiving payment.";
    }
    if (layer1Status === Status.Success) {
      return `Your ${symbolInUpper} has arrived!`;
    }
    if (layer1Status === Status.Fail) {
      return `Your transaction failed.`;
    }
    return "";
  };

  const subHeading = (): string => {
    if (layer1Status === Status.Pending) {
      return `${gateway.toLocaleLowerCase()} is sending you your ${symbolInUpper}. Once your ${symbolInUpper} arrives in your wallet, you will receive an email to complete step 3.`;
    }
    if (layer1Status === Status.Success) {
      return `${gateway.toLocaleLowerCase()} has successfully sent you ${symbolInUpper}. You can now swap ${symbolInUpper} for ${symbolOutUpper} here. We don’t add fees on top of Uniswap.`;
    }
    if (layer1Status === Status.Fail) {
      return `${gateway.toLocaleLowerCase()} has failed to send your ${symbolInUpper}. There may be something wrong with the network. Please try again later.`;
    }
    return "";
  };

  const [gateway, dex] = gatewayAndDex.split("_");

  const handleNext = () => {
    console.log("next screen");
    nextScreen(
      <SwapOverviewView
        nextStep={{
          type: "transactionOverview",
          progress: 80,
          url: "",
          data: {
            userData: {
              userAddress: "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48",
            },
            transactionData: {} as QuoteDetails,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fiatSymbol: "$",
            balance: 0,
            userId: "",
            txId: txId,
          },
        }}
      />
    );
  };

  return (
    <div className={commonClasses.view}>
      <ProgressHeader />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        {layer1Status === Status.Pending && <Mail className={classes.icon} />}
        {layer1Status === Status.Success && (
          <CheckCircle className={classes.icon} />
        )}
        {layer1Status === Status.Fail && <Error className={classes.icon} />}
        <Heading
          className={classes.heading}
          text={heading()}
          textSubHeading={subHeading()}
        />

        <div
          className={`${classes.stepBar} ${classes.status} ${classes[layer1Status]}`}
        >
          <div
            className={`${classes.stepIconContainer} ${classes[layer1Status]}`}
          >
            <Wallet className={classes.walletIcon} />
          </div>
          <div className={classes.textContainer}>
            <div
              className={classes.stepTitle}
            >{`Step 2: Depositing ${symbolInUpper} in wallet`}</div>
            <div className={classes.stepDescription}>
              Awaiting deposit in your wallet...
            </div>
          </div>
          {layer1Status === Status.Pending && (
            <Spinner className={classes.statusIcon} />
          )}
          {layer1Status === Status.Success && (
            <Check className={classes.statusIcon} />
          )}
        </div>

        <button
          disabled={layer1Status !== Status.Success}
          onClick={handleNext}
          className={`${classes.stepBar} ${classes.button} ${classes[layer1Status]}`}
        >
          <div
            className={`${classes.stepIconContainer} ${classes[layer1Status]}`}
          >
            <ImageWithFallback
              className={classes.tokenIcon}
              src={tokenOutURL}
              alt={tokenOut?.name ?? "token to buy"}
              FallbackComponent={Fallback}
            />
          </div>

          <div className={classes.textContainer}>
            <div
              className={classes.stepTitle}
            >{`Step 3: ${symbolInUpper}-to-${symbolOutUpper} token`}</div>
            <div className={classes.stepDescription}>
              {`Swap ${symbolInUpper} for ${symbolOutUpper} via ${dex}`}
            </div>
          </div>
          <Chevron className={classes.chevron} />
        </button>
        {layer1Status === Status.Pending && (
          <SingleNotification
            className={classes.notification}
            notification={{
              type: NotificationType.Info,
              message: "Attention! You do not need to keep your browser open.",
            }}
          />
        )}

        {layer1Status === Status.Fail && (
          <SingleNotification
            className={classes.notification}
            notification={{
              type: NotificationType.Error,
              message: "Oh no! Something's gone wrong. Please try again later.",
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};
