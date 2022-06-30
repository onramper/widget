import React, { useCallback, useEffect, useRef, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import ButtonAction from "../../common/Buttons/ButtonAction";
import { isMetamaskEnabled } from "layer2";
import { getLifiQuote } from "../../web3/lifi";
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
import { isErrorWithName, storeTransactionData } from "../../ApiContext/api";
import { SwapOverviewViewProps } from "./SwapOverviewView.models";
import { useLayer2 } from "../../web3/config";
import { formatEther } from "ethers/lib/utils";

const SwapOverviewView = ({
  nextStep: {
    customerGateway,
    progress,
    amountIn: initialAmountIn,
    amountOut: initialAmountOut,
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
    selectedWalletAddress,
    slippageTolerance,
    deadline,
    quote,
    inAmount,
    transactionRequest,
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
          metaAddress,
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
    [
      addNotification,
      metaAddress,
      setQuote,
      setTransactionRequest,
      tokenIn,
      tokenOut,
    ]
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

  const heading = `Swap ${tokenIn.name} (${tokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const handleEdit = useCallback(async () => {
    nextScreen(<EditSwapView progress={progress} />);
  }, [nextScreen, progress]);

  const handleExecuteLifi = useCallback(async () => {
    if (!metaAddress) {
      addNotification({
        type: NotificationType.Info,
        message: "Please connect wallet",
        shouldExpire: true,
      });
      return;
    }
    if (balance && Number(formatEther(balance)) <= inAmount) {
      addNotification({
        type: NotificationType.Warning,
        message: "You have Insufficient funds to perform this transaction.",
        shouldExpire: true,
      });
      return;
    }
    try {
      if (transactionRequest) {
        setLoading(true);
        addNotification({
          type: NotificationType.Info,
          message: "Please sign transaction",
          shouldExpire: true,
        });
        await sendTransaction({
          data: transactionRequest.data,
          from: selectedWalletAddress ?? metaAddress,
          to: transactionRequest.to,
          value: transactionRequest.value,
        });
      } else {
        addNotification({
          type: NotificationType.Info,
          message: "Getting ready to swap...",
          shouldExpire: true,
        });
        //update quote before tx
        const res = await getLifiQuote(
          tokenIn,
          tokenOut,
          inAmount,
          metaAddress,
          beforeUnLoadRef.current.signal
        );
        if (res?.transactionRequest) {
          const receipt = await sendTransaction({
            data: res.transactionRequest.data,
            from: selectedWalletAddress ?? metaAddress,
            to: res.transactionRequest.to,
            value: res.transactionRequest.value,
          });
          if (receipt && receipt.blockHash) {
            addNotification({
              type: NotificationType.Success,
              message: "Transaction Successful!",
              shouldExpire: true,
            });
          }
        } else {
          addNotification({
            type: NotificationType.Error,
            message: "Could not find a route for your requested trade",
            shouldExpire: true,
          });
        }
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
  }, [
    addNotification,
    balance,
    inAmount,
    metaAddress,
    selectedWalletAddress,
    sendTransaction,
    tokenIn,
    tokenOut,
    transactionRequest,
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

  return (
    <div className={commonClasses.view}>
      <ProgressHeader noSeparator useBackButton percentage={progress} />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading className={classes.heading} text={heading} />
        <WidgetNotification />
        <SwapDetailsBar />
        <FeeBreakdown />
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
                onClick={handleExecuteLifi}
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
