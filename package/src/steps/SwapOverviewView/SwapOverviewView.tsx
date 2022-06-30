import React, { useCallback, useEffect, useRef, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import { apiKey, getDexFromGateway, parseWrappedTokens } from "../../utils";
import ButtonAction from "../../common/Buttons/ButtonAction";
import {
  isMetamaskEnabled,
  getUniswapQuote,
  getUniswapSwapParams,
  getLifiQuote,
} from "layer2";
import {
  useEtherBalance,
  useSendTransaction,
  TransactionStatus,
} from "@usedapp/core";
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
import { useLayer2 } from "../../web3/config";

const SwapOverviewView = ({
  nextStep: {
    customerGateway,
    progress,
    amountIn: initialAmountIn,
    amountOut,
    tokenIn: initialTokenIn,
    tokenOut: initialTokenOut,
    fiatSymbol: initialFiatSymbol,
    userId,
    txId,
  },
}: SwapOverviewViewProps) => {
  const { setQuote, setTransactionRequest, initialiseTransactionContext } =
    useTransactionCtxActions();

  const { account: metaAddress, active, chainId } = useLayer2();
  const balance = useEtherBalance(metaAddress);
  const {
    fiatSymbol,
    tokenIn,
    tokenOut,
    slippageTolerance,
    deadline,
    quote,
    inAmount,
  } = useTransactionContext();

  // const { fetchAndUpdateUserWallets } = useTransactionCtxWallets();

  const { sendTransaction, state } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const isActive = metaAddress && active;
  useWalletSupportRedirect(progress);
  const { connect, connectionPending } = useConnectWallet();
  const { nextScreen } = useNav();
  const { addNotification } = useWidgetNotifications();

  const beforeUnLoadRef = useRef<AbortController>(new AbortController());

  // const handleUpdateUniswap = useCallback(
  //   async (amountIn: number) => {
  //     addNotification({
  //       type: NotificationType.Info,
  //       message: "Loading Swap Data...",
  //       shouldExpire: true,
  //     });
  //     setLoading(true);
  //     try {
  //       const newQuote = await getUniswapQuote(
  //         tokenIn,
  //         tokenOut,
  //         amountIn,
  //         false,
  //         apiKey,
  //         beforeUnLoadRef.current.signal
  //       );
  //       if (newQuote) {
  //         setQuote(newQuote);
  //       }
  //     } catch (error) {
  //       if (isErrorWithName(error) && error.name === "AbortError") {
  //         return;
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [addNotification, setQuote, tokenIn, tokenOut]
  // );

  const handleUpdateLifi = useCallback(
    async (amountIn: number) => {
      addNotification({
        type: NotificationType.Info,
        message: "Loading Swap Data...",
        shouldExpire: true,
      });
      setLoading(true);
      try {
        const res = await getLifiQuote(
          tokenIn,
          tokenOut,
          amountIn,
          beforeUnLoadRef.current.signal
        );
        if (res) {
          setQuote(res.estimate);
          if (res.transactionRequest) {
            setTransactionRequest(res.transactionRequest);
          }
        }
      } catch (error) {
        if (isErrorWithName(error) && error.name === "AbortError") {
          return;
        }
      } finally {
        setLoading(false);
      }
    },
    [addNotification, setQuote, setTransactionRequest, tokenIn, tokenOut]
  );

  useEffect(() => {
    initialiseTransactionContext({
      customerGateway: customerGateway,
      txId,
      userId,
      tokenIn: initialTokenIn,
      tokenOut: initialTokenOut,
      fiatSymbol: initialFiatSymbol,
      inAmount: initialAmountIn,
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleUpdateLifi(initialAmountIn);
  }, [initialAmountIn, handleUpdateLifi]);

  // if tokenIn === "WETH" then we want to display ETH instead
  const parsedTokenIn = parseWrappedTokens(tokenIn);
  const heading = `Swap ${parsedTokenIn.name} (${parsedTokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const handleEdit = useCallback(async () => {
    nextScreen(<EditSwapView progress={progress} />);
  }, [nextScreen, progress]);

  const handleExecuteUniswap = async () => {
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
        message: "Getting ready to swap...",
        shouldExpire: true,
      });
      try {
        const res = await getUniswapSwapParams(
          Number(utils.formatEther(balance)),
          tokenIn,
          tokenOut,
          inAmount,
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

  const handleExecuteLifi = useCallback(async () => {
    setLoading(true);
    addNotification({
      type: NotificationType.Info,
      message: "Getting ready to swap...",
      shouldExpire: true,
    });
    if (metaAddress) {
      try {
        const res = await getLifiQuote(tokenIn, tokenOut, inAmount);
        if (res?.transactionRequest) {
          addNotification({
            type: NotificationType.Info,
            message: "Please sign transaction",
            shouldExpire: true,
          });
          await sendTransaction({
            data: res.transactionRequest.data,
            from: metaAddress,
            to: res.transactionRequest.to,
            value: res.transactionRequest.value,
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
  }, [
    addNotification,
    inAmount,
    metaAddress,
    sendTransaction,
    tokenIn,
    tokenOut,
  ]);

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

  const handleExecute = () => {
    const dex = getDexFromGateway(customerGateway);
    if (!dex) alert("No dex found!");
    if (dex === "UNISWAP") {
      handleExecuteUniswap();
    }
    if (dex === "LIFI") {
      handleExecuteLifi();
    }
  };

  return (
    <div className={commonClasses.view}>
      <ProgressHeader noSeparator useBackButton percentage={progress} />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading className={classes.heading} text={heading} />
        <WidgetNotification />
        <SwapDetailsBar
          tokenIn={parsedTokenIn}
          tokenOut={tokenOut}
          amountIn={Number(quote?.amountDecimals) ?? inAmount}
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
                onClick={handleExecute}
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
