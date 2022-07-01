import {
  TransactionStatus,
  useEtherBalance,
  useSendTransaction,
} from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import { lifiChains } from "layer2";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { storeTransactionData } from "../../ApiContext/api";
import { useNav } from "../../NavContext";
import {
  NotificationType,
  useWidgetNotifications,
} from "../../NotificationContext";
import OrderCompleteView from "../../steps/OrderCompleteView/OrderCompleteView";
import TransactionErrorOverlay from "../../steps/SwapOverviewView/TransactionErrorOverlay/TransactionErrorOverlay";
import { useLayer2 } from "../../web3/config";
import { getLifiQuote } from "../../web3/lifi";
import { useTransactionContext } from "./useTransactionContext";
// import TransactionErrorOverlay from "./TransactionErrorOverlay";

export const useExecuteTransaction = () => {
  const { account, chainId } = useLayer2();
  const {
    tokenIn,
    inAmount,
    tokenOut,
    transactionRequest,
    selectedWalletAddress,
    txId,
    slippageTolerance,
  } = useTransactionContext();
  const { addNotification, removeNotification } = useWidgetNotifications();
  const balance = useEtherBalance(account);
  const [loading, setLoading] = useState<boolean>(false);
  const { sendTransaction, state } = useSendTransaction();
  const { nextScreen } = useNav();
  const beforeUnLoadRef = useRef<AbortController>(new AbortController());

  const executeTransaction = useCallback(async () => {
    const destinationAddress = selectedWalletAddress ?? account;
    if (!account) {
      addNotification({
        type: NotificationType.Info,
        message: "Please connect wallet",
        shouldExpire: true,
      });
      return;
    }
    if (chainId !== tokenIn.chainId) {
      const tokenInChainName = lifiChains.find(
        (c) => c.chainId === tokenIn.chainId
      )?.name;
      if (!tokenInChainName) {
        addNotification({
          type: NotificationType.Error,
          message: "This network is currently not supported",
          shouldExpire: true,
        });
        return;
      }
      addNotification({
        type: NotificationType.Warning,
        message: `You are on the incorrect network. Please switch to ${tokenInChainName}`,
        shouldExpire: true,
      });
      return;
    }
    const formattedBalance = balance && Number(formatEther(balance));
    if (formattedBalance && formattedBalance <= inAmount) {
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
        const id = nanoid();
        addNotification({
          type: NotificationType.Info,
          message: "Please sign transaction",
          shouldExpire: false,
          id,
        });
        await sendTransaction({
          data: transactionRequest.data,
          from: selectedWalletAddress ?? account,
          to: transactionRequest.to,
          value: transactionRequest.value,
        });
        removeNotification(id);
      } else {
        setLoading(true);
        addNotification({
          type: NotificationType.Info,
          message: "Getting ready to swap...",
          shouldExpire: true,
        });
        // //eslint-disable-next-line
        // debugger;
        //update quote before tx
        const res = await getLifiQuote(
          tokenIn,
          tokenOut,
          inAmount,
          account,
          destinationAddress,
          beforeUnLoadRef.current.signal,
          slippageTolerance
        );
        if (res?.transactionRequest) {
          addNotification({
            type: NotificationType.Info,
            message: "Please sign transaction",
            shouldExpire: true,
          });
          const receipt = await sendTransaction({
            data: res.transactionRequest.data,
            from: selectedWalletAddress ?? account,
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
          setLoading(false);
          addNotification({
            type: NotificationType.Error,
            message: "Could not find a route for your requested trade",
            shouldExpire: true,
          });
        }
      }
    } catch (error) {
      addNotification({
        type: NotificationType.Error,
        message: (error as Error)?.message ?? "something went wrong",
        shouldExpire: true,
      });
    } finally {
      setLoading(false);
    }
  }, [
    account,
    addNotification,
    balance,
    chainId,
    inAmount,
    removeNotification,
    selectedWalletAddress,
    sendTransaction,
    slippageTolerance,
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

  const handleMining = useCallback(async () => {
    if (state.transaction && account) {
      try {
        //eslint-disable-next-line
        debugger;
        storeTransactionData({
          transactionResponse: state.transaction,
          address: account,
          transactionId: txId,
        });
      } catch (error) {
        console.log(error);
      }
    }
    nextScreen(
      <OrderCompleteView
        title="Success! Your Swap has been executed."
        description="You will receive an email when the swap is complete and the crypto has arrived in your wallet. "
        tokenOut={tokenOut}
      />
    );
  }, [account, nextScreen, state.transaction, tokenOut, txId]);

  useEffect(() => {
    if (state.status === "Mining") {
      handleMining();
    }
    if (state.status === "Exception") {
      handleException(state);
    }
  }, [
    handleException,
    account,
    nextScreen,
    txId,
    state,
    tokenOut,
    handleMining,
  ]);

  useEffect(() => {
    const onBeforeUnload = () => {
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return { loading, state, executeTransaction };
};
