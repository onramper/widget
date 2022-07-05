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
import Fallback from "../../icons/fallback_token_icon.svg";
import { ReactComponent as Chevron } from "../../icons/chevron2.svg";
import { ReactComponent as CheckCircle } from "../../icons/check_circle.svg";
import { ReactComponent as Error } from "../../icons/close_circle.svg";
import {
  defaults,
  PaymentProgressViewProps,
  Status,
  SwapData,
} from "./PaymentProgressView.models";
import { isErrorWithMessage, pollTransaction } from "../../ApiContext/api";
import { useNav } from "../../NavContext";
import SwapOverviewView from "../SwapOverviewView/SwapOverviewView";
import { StepType } from "../../ApiContext/api/types/nextStep";
import { useNavigate, useParams } from "react-router-dom";
import { useAPI } from "../../ApiContext";
import BuyCryptoView from "../../BuyCryptoView";
import { getNativeToken } from "../../utils";

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
//     decimals: 6,c
//   },
// };

// const failedTxId = "2gRJ_18g7yLS-7Dgv9hE4A--";

export const PaymentProgressView = (props: PaymentProgressViewProps) => {
  const [layer1Status, setLayer1Status] = useState<Status>(Status.Pending);
  const { txId: txIdFromUrl } = useParams();
  const txId = txIdFromUrl || props.nextStep?.txId;
  const { collected } = useAPI();
  const { onlyScreen, nextScreen } = useNav();
  const [swapData, setSwapData] = useState<SwapData>(
    props?.nextStep ?? defaults
  );
  const navigate = useNavigate();

  const symbolInUpper = resolveWeth(swapData.tokenIn).symbol.toUpperCase();
  const symbolOutUpper = swapData.tokenOut.symbol.toUpperCase();
  const [inAmount, setInAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (txId) {
      const interval = setInterval(async () => {
        try {
          const tx = await pollTransaction(txId);

          if (tx) {
            const tokenIn = await getNativeToken(tx.l2TokenData.chainId);
            const tokenOut = tx.l2TokenData;
            const customerGateway = tx.customerGateway;
            const inCurrency = tx.inCurrency;
            setSwapData({ tokenIn, tokenOut, customerGateway, inCurrency });
          }
          if (tx && tx.lastStatus === "ok") {
            setLayer1Status(Status.Success);
            setInAmount(tx.outAmount);
            clearInterval(interval);
          }
          if (tx && tx.lastStatus === "rip") {
            setLayer1Status(Status.Fail);
            clearInterval(interval);
          }
        } catch (error) {
          if (
            isErrorWithMessage(error) &&
            error.message === "Transaction not found"
          ) {
            setLayer1Status(Status.Fail);
            clearInterval(interval);
            setError(error.message);
          }
        }
      }, 1000);
      //eslint-disable-next-line
    }
  }, [txId]);

  const tokenOutURL = swapData.tokenOut?.logoURI
    ? uriToHttp(swapData.tokenOut?.logoURI)[0]
    : "";

  const heading = (): string => {
    if (layer1Status === Status.Pending) {
      return "Order in Progress. Receiving payment.";
    }
    if (layer1Status === Status.Success) {
      return `Your ${symbolInUpper} has arrived!`;
    }
    if (layer1Status === Status.Fail) {
      return error ?? `Your transaction failed.`;
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
      return error
        ? "We could not find the transaction you were looking for."
        : `${gateway.toLocaleLowerCase()} has failed to send your ${symbolInUpper}. There may be something wrong with the network. Please try again later.`;
    }
    return "";
  };

  const [gateway, dex] = swapData.customerGateway.split("_");

  const handleNext = () => {
    if (txId) {
      nextScreen(
        <SwapOverviewView
          nextStep={{
            customerGateway: "Moonpay_Lifi", // TODO:revert back to => swapData.customerGateway,
            type: StepType.swapOverview,
            progress: 0,
            amountIn: inAmount,
            amountOut: 0,
            tokenIn: swapData.tokenIn,
            tokenOut: swapData.tokenOut,
            fiatSymbol: swapData.inCurrency,
            userId: "",
            txId: txId,
          }}
        />
      );
    }
  };

  const exitHandler = () => {
    navigate("/", { replace: true });
    collected.redirectURL
      ? window.open(collected.redirectURL, "_parent")
      : onlyScreen(<BuyCryptoView />);
  };

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        onExitClick={exitHandler}
        useExitButton={layer1Status === Status.Fail}
      />
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
              alt={swapData.tokenOut?.name ?? "token to buy"}
              fallbackSrc={Fallback}
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

        {layer1Status === Status.Success && (
          <SingleNotification
            className={classes.notification}
            notification={{
              type: NotificationType.Success,
              message: "Please proceed to the next step",
            }}
          />
        )}
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
