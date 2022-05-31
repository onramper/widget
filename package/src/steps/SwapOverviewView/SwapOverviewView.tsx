import React, { useCallback, useEffect, useRef, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import { apiKey, parseWrappedTokens } from "../../utils";
import ButtonAction from "../../common/Buttons/ButtonAction";
import {
  isMetamaskEnabled,
  useEtherBalance,
  getQuote,
  getSwapParams,
  useLayer2,
  useSendTransaction,
  TransactionStatus,
} from "layer2";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";
import SwapDetailsBar from "./SwapDetailsBar/SwapDetailsBar";
import FeeBreakdown from "./FeeBreakdown/FeeBreakdown";
import { useWalletSupportRedirect, useConnectWallet } from "../../hooks";
import { useNav } from "../../NavContext";
import OrderCompleteView from "../OrderCompleteView/OrderCompleteView";
import EditSwapView from "./EditSwapView/EditSwapView";
import {
  useTransactionContext,
  useTransactionCtxActions,
} from "../../TransactionContext/hooks";
import { WidgetNotification } from "../WidgetNotification/WidgetNotification";
import {
  NotificationType,
  useWidgetNotifications,
} from "../../NotificationContext";
import TransactionErrorOverlay from "./TransactionErrorOverlay/TransactionErrorOverlay";
import { utils } from "ethers";
import { isErrorWithName, storeTransactionData } from "../../ApiContext/api";
import { SwapOverviewViewProps } from "./SwapOverviewView.models";

const SwapOverviewView = ({
  nextStep: {
    progress,
    amountIn,
    amountOut,
    tokenIn: initialTokenIn,
    tokenOut: initialTokenOut,
    fiatSymbol: initialFiatSymbol,
    userId,
    txId,
  },
}: SwapOverviewViewProps) => {
  const { setQuote, initialiseTransactionContext } = useTransactionCtxActions();

  const { account: metaAddress, active } = useLayer2();
  const balance = useEtherBalance(metaAddress);
  const { fiatSymbol, tokenIn, tokenOut, slippageTolerance, deadline, quote } =
    useTransactionContext();

  console.log({
    fiatSymbol,
    tokenIn,
    tokenOut,
    slippageTolerance,
    deadline,
    quote,
  });

  // const { fetchAndUpdateUserWallets } = useTransactionCtxWallets();

  const { sendTransaction, state } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const isActive = metaAddress && active;
  useWalletSupportRedirect(progress);
  const { connect, connectionPending } = useConnectWallet();
  const { nextScreen } = useNav();
  const { addNotification } = useWidgetNotifications();

  const beforeUnLoadRef = useRef<AbortController>(new AbortController());

  const handleUpdate = useCallback(
    async (amountIn: number) => {
      setLoading(true);
      try {
        const newQuote = await getQuote(
          tokenIn,
          tokenOut,
          amountIn,
          false,
          apiKey,
          beforeUnLoadRef.current.signal
        );
        if (newQuote) {
          setQuote(newQuote);
        }
      } catch (error) {
        if (isErrorWithName(error) && error.name === "AbortError") {
          return;
        }
      } finally {
        setLoading(false);
      }
    },
    [setQuote, tokenIn, tokenOut]
  );

  useEffect(() => {
    initialiseTransactionContext({
      txId,
      userId,
      tokenIn: initialTokenIn,
      tokenOut: initialTokenOut,
      fiatSymbol: initialFiatSymbol,
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleUpdate(amountIn);
  }, [amountIn, handleUpdate]);

  // if tokenIn === "WETH" then we want to display ETH instead
  const parsedTokenIn = parseWrappedTokens(tokenIn);
  const heading = `Swap ${parsedTokenIn.name} (${parsedTokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const handleEdit = useCallback(async () => {
    nextScreen(<EditSwapView progress={progress} />);
  }, [nextScreen, progress]);

  const handleSwap = async () => {
    if (!balance) {
      addNotification({
        type: NotificationType.Error,
        message: "Your balance is 0",
        shouldExpire: true,
      });
    }
    if (metaAddress && balance) {
      setLoading(true);
      addNotification({
        type: NotificationType.Info,
        message: "Fetching best price...",
        shouldExpire: true,
      });
      try {
        const res = await getSwapParams(
          Number(utils.formatEther(balance)),
          tokenIn,
          tokenOut,
          amountIn,
          metaAddress,
          undefined,
          {
            slippageTolerance,
            deadline,
          },
          apiKey
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
        addNotification({
          type: NotificationType.Error,
          message: (error as Error)?.message ?? "something went wrong",
          shouldExpire: true,
        });
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
        } else if (errorMessage?.includes("insufficient funds")) {
          nextScreen(
            <TransactionErrorOverlay
              textAlert="Insufficient funds"
              description="You have insufficient funds to complete this transaction"
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
      nextScreen(
        <OrderCompleteView
          title="Success! Your Swap has been executed."
          description="You will receive an email when the swap is complete and the crypto has arrived in your wallet. "
          tokenOut={tokenOut}
        />
      );
      if (state.transaction && metaAddress) {
        storeTransactionData({
          transactionResponse: state.transaction,
          address: metaAddress,
          transactionId: txId,
        });
      }
    }
    if (state.status === "Exception") {
      handleException(state);
    }
  }, [handleException, metaAddress, nextScreen, txId, state, tokenOut]);

  useEffect(() => {
    const onBeforeUnload = () => {
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // useEffect(() => {
  //   try {
  //     fetchAndUpdateUserWallets();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [fetchAndUpdateUserWallets]);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader noSeparator useBackButton percentage={progress} />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading className={classes.heading} text={heading} />
        <WidgetNotification />
        <SwapDetailsBar
          tokenIn={parsedTokenIn}
          tokenOut={tokenOut}
          amountIn={Number(quote?.amountDecimals) ?? amountIn}
          amountOut={Number(quote?.quoteDecimals) ?? amountOut}
          fiatSymbol={fiatSymbol}
        />
        <FeeBreakdown quote={quote} />
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
                disabled={!isActive || loading}
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

export default SwapOverviewView;
