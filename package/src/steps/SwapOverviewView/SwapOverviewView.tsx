import React, { useCallback, useEffect, useRef, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { NextStep } from "../../ApiContext";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import { parseWrappedTokens } from "../../utils";
import ButtonAction from "../../common/Buttons/ButtonAction";
import {
  formatEther,
  isMetamaskEnabled,
  useEtherBalance,
  getQuote,
  getSwapParams,
  useLayer2,
  useSendTransaction,
  TransactionStatus,
  MinimumSlippageDeadlineError,
} from "layer2";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";
import SwapDetailsBar from "./SwapDetailsBar/SwapDetailsBar";
import FeeBreakdown from "./FeeBreakdown/FeeBreakdown";
import { useWalletSupportRedirect, useConnectWallet } from "../../hooks";
import { useNav } from "../../NavContext";
import EditSwapView from "./EditSwapView/EditSwapView";
import {
  useTransactionContext,
  useTransactionCtxWallets,
  useTranasactionCtxInit,
  useTransactionCtxActions,
} from "../../TransactionContext/hooks";
import { WidgetNotification } from "../WidgetNotification/WidgetNotification";
import {
  NotificationType,
  useWidgetNotifications,
} from "../../NotificationContext";
import TransactionErrorOverlay from "../../SwapCryptoView/TransactionErrorOverlay/TransactionErrorOverlay";
import { useTransactionResults } from "../../NotificationContext/useTransactionResults";

const SwapOverviewView: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = (props) => {
  const [nextStep] = useState(props.nextStep);
  const { account: metaAddress, active, chainId } = useLayer2();
  const balance = useEtherBalance(metaAddress);
  const {
    currentQuote: quote,
    fiatConversionOut,
    fiatConversionIn,
    fiatSymbol,
    tokenIn,
    tokenOut,
    slippageTolerance,
    deadline,
  } = useTransactionContext();
  const { setQuote } = useTransactionCtxActions();
  const { fetchAndUpdateUserWallets } = useTransactionCtxWallets();

  const { sendTransaction, state } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const isActive = metaAddress && active;
  useWalletSupportRedirect(nextStep.progress);
  const { connect, connectionPending } = useConnectWallet();
  const { nextScreen } = useNav();
  const { addNotification } = useWidgetNotifications();

  const beforeUnLoadRef = useRef<AbortController>(new AbortController());
  useTransactionResults(tokenOut);

  const { amountDecimals } = quote;

  const handleUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const newQuote = await getQuote(
        tokenIn,
        tokenOut,
        Number(amountDecimals),
        false,
        beforeUnLoadRef.current.signal
      );
      if (newQuote) {
        setQuote(newQuote);
      }
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [amountDecimals, setQuote, tokenIn, tokenOut]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  // if tokenIn === "WETH" then we want to display ETH instead
  const parsedTokenIn = parseWrappedTokens(tokenIn);
  const heading = `Swap ${parsedTokenIn.name} (${parsedTokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const handleEdit = useCallback(async () => {
    nextScreen(<EditSwapView progress={nextStep.progress} />);
  }, [nextScreen, nextStep.progress]);

  const handleSwap = async () => {
    if (metaAddress && balance) {
      setLoading(true);
      addNotification({
        type: NotificationType.Info,
        message: "Fetching best price...",
        shouldExpire: true,
      });
      try {
        const res = await getSwapParams(
          Number(formatEther(balance)),
          tokenIn,
          tokenOut,
          Number(amountDecimals),
          metaAddress,
          undefined,
          {
            slippageTolerance,
            deadline,
          }
        );
        addNotification({
          type: NotificationType.Info,
          message: "Please sign transaction",
          shouldExpire: true,
        });
        if (res?.data) {
          await sendTransaction({
            data: res.data,
            to: res.to,
            value: res.value,
            from: metaAddress,
          });
        }
      } catch (error) {
        console.log(error);
        if (error instanceof MinimumSlippageDeadlineError) {
          addNotification({
            type: NotificationType.Error,
            message: "Either slippage or deadline set too low.",
            shouldExpire: true,
          });
        } else {
          addNotification({
            type: NotificationType.Error,
            message: (error as Error)?.message ?? "something went wrong",
            shouldExpire: true,
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      addNotification({
        type: NotificationType.Info,
        message: "Please connect wallet",
        shouldExpire: true,
      });
    }
  };

  const handleException = useCallback(
    ({ status, errorMessage }: TransactionStatus) => {
      if (status === "Exception") {
        if (errorMessage?.includes("INSUFFICIENT_OUTPUT_AMOUNT")) {
          nextScreen(
            <TransactionErrorOverlay
              {...{
                textAlert: "Slippage set too low",
                description:
                  " Insufficient output amount. To avoid a failed transaction try setting the slippage higher.",
              }}
            />
          );
        } else if (errorMessage?.includes("EXPIRED")) {
          nextScreen(
            <TransactionErrorOverlay
              {...{
                textAlert: "Deadline set too low",
                description:
                  "Transaction timed out. To avoid a failed transaction try increasing the deadline time.",
              }}
            />
          );
        } else {
          nextScreen(
            <TransactionErrorOverlay
              {...{
                textAlert: "Rejected transaction",
                description: "You rejected this transaction.",
              }}
            />
          );
        }
      }
    },
    [nextScreen]
  );

  useEffect(() => {
    if (state.status === "Mining") {
      addNotification({
        type: NotificationType.Info,
        message: "Your transaction is being processed, please wait",
        shouldExpire: true,
      });
    }
    if (state.status === "Exception") {
      console.log(state);
      handleException(state);
    }
  }, [addNotification, handleException, nextScreen, state, tokenOut]);

  useEffect(() => {
    const onBeforeUnload = () => {
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    try {
      fetchAndUpdateUserWallets();
    } catch (err) {
      console.log(err);
    }
  }, [fetchAndUpdateUserWallets]);

  const isOnCorrectNetwork = tokenIn.chainId === chainId;

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        noSeparator
        useBackButton
        percentage={nextStep.progress}
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading className={classes.heading} text={heading} />
        <WidgetNotification />
        <SwapDetailsBar
          estimate={quote}
          tokenIn={parsedTokenIn}
          tokenOut={tokenOut}
          conversionIn={`${fiatSymbol}${fiatConversionIn}`}
          conversionOut={`${fiatSymbol}${fiatConversionOut}`}
        />
        <FeeBreakdown transactionDetails={quote} />
        <div className={classes.buttonContainer}>
          {isActive ? (
            <>
              <ButtonSecondary
                className={classes.buttonInGroup}
                text="Edit"
                onClick={handleEdit}
                disabled={loading}
              />
              <ButtonAction
                disabled={!isActive || loading || !isOnCorrectNetwork}
                className={classes.buttonInGroup}
                text={"Confirm Swap"}
                onClick={handleSwap}
                pending={loading}
              />
            </>
          ) : (
            <ButtonAction
              text="Connect Wallet"
              pending={connectionPending}
              onClick={connect}
              disabled={!isMetamaskEnabled() || connectionPending}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const WithContextInit: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = (props) => {
  const isInit = useTranasactionCtxInit(props.nextStep.data, Date.now());
  const { replaceScreen } = useNav();

  useEffect(() => {
    if (isInit) {
      replaceScreen(<SwapOverviewView nextStep={props.nextStep} />);
    }
  }, [isInit, props.nextStep, replaceScreen]);

  return <></>;
};

export default WithContextInit;
