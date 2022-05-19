import React, { useEffect, useState } from "react";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import commonClasses from "../../styles.module.css";
import classes from "./PaymentProgressView.module.css";
import { ReactComponent as Mail } from "../../icons/mail.svg";
import Heading from "../../common/Heading/Heading";
import { SingleNotification } from "../WidgetNotification/WidgetNotification";
import { NotificationType } from "../../NotificationContext";
import { resolveWeth, uriToHttp } from "layer2";
import { ReactComponent as Wallet } from "../../icons/wallet2.svg";
import Spinner from "../../common/Spinner";
import { ReactComponent as Check } from "../../icons/check.svg";
import { ImageWithFallback } from "../../common/ImageWithFallback/ImageWithFallback";
import { ReactComponent as Fallback } from "../../icons/fallback_token_icon.svg";
import { ReactComponent as Chevron } from "../../icons/chevron2.svg";
import { ReactComponent as CheckCircle } from "../../icons/check_circle.svg";
import { PaymentProgressViewProps, Status } from "./PaymentProgressView.models";
import { useNav } from "../../NavContext";
import SwapOverviewView from "../SwapOverviewView/SwapOverviewView";

export const PaymentProgressView = ({
  nextStep: { gateway = "moonpay", tokenIn, tokenOut },
}: PaymentProgressViewProps) => {
  const [layer1TransactionStatus, setLayer1TransactionStatus] = useState<Status>(Status.Pending);
  const symbolInUpper = resolveWeth(tokenIn).symbol.toUpperCase();
  const symbolOutUpper = tokenOut.symbol.toUpperCase();
  const { nextScreen } = useNav();

  // useEffect(() => {
  //   setTimeout(() => setLayer1Status(Status.Success), 3000);
  // }, []);

  const tokenOutURL = uriToHttp(tokenOut.logoURI as string)[0] ?? "";

  const heading = (): string => {
    if (layer1TransactionStatus === Status.Pending) {
      return "Order in Progress. Receiving payment.";
    }
    if (layer1TransactionStatus === Status.Success) {
      return `Your ${symbolInUpper} has arrived!`;
    }
    return "";
  };

  const subHeading = (): string => {
    if (layer1TransactionStatus === Status.Pending) {
      return `${gateway.toLocaleLowerCase()} is sending you your ${symbolInUpper}. Once your ${symbolInUpper} arrives in your wallet, you will receive an email to complete step 3.`;
    }
    if (layer1TransactionStatus === Status.Success) {
      return `${gateway.toLocaleLowerCase()} has successfully sent you ${symbolInUpper}. You can now swap ${symbolInUpper} for ${symbolOutUpper} here. We don’t add fees on top of Uniswap.`;
    }
    return "";
  };

  const handleNext = () => {
    console.log("next screen");
    // nextScreen(
    //   <SwapOverviewView />
    // );
  };

  return (
    <div className={commonClasses.view}>
      <ProgressHeader />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        {layer1TransactionStatus === Status.Pending && <Mail className={classes.icon} />}
        {layer1TransactionStatus === Status.Success && (
          <CheckCircle className={classes.icon} />
        )}
        <Heading
          className={classes.heading}
          text={heading()}
          textSubHeading={subHeading()}
        />

        <div
          className={`${classes.stepBar} ${classes.status} ${classes[layer1TransactionStatus]}`}
        >
          <div
            className={`${classes.stepIconContainer} ${classes[layer1TransactionStatus]}`}
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
          {layer1TransactionStatus === Status.Pending && (
            <Spinner className={classes.statusIcon} />
          )}
          {layer1TransactionStatus === Status.Success && (
            <Check className={classes.statusIcon} />
          )}
        </div>

        <button
          disabled={layer1TransactionStatus !== Status.Success}
          onClick={handleNext}
          className={`${classes.stepBar} ${classes.button} ${classes[layer1TransactionStatus]}`}
        >
          <div
            className={`${classes.stepIconContainer} ${classes[layer1TransactionStatus]}`}
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
              {`Swap ${symbolInUpper} for ${symbolOutUpper} via Uniswap`}
            </div>
          </div>
          <Chevron className={classes.chevron} />
        </button>
        {layer1TransactionStatus === Status.Pending && (
          <SingleNotification
            className={classes.notification}
            notification={{
              type: NotificationType.Info,
              message: "Attention! You do not need to keep your browser open.",
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};
