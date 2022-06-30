import {
  TransactionStatus,
  useEtherBalance,
  useSendTransaction,
} from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import { lifiChains } from "layer2";
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
  } = useTransactionContext();
  const { addNotification } = useWidgetNotifications();
  const balance = useEtherBalance(account);
  const [loading, setLoading] = useState<boolean>(false);
  const { sendTransaction, state } = useSendTransaction();
  const { nextScreen } = useNav();
  const beforeUnLoadRef = useRef<AbortController>(new AbortController());

  const executeTransaction = useCallback(async () => {
    setLoading(true);
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
        message: `You are on the incorrect network. PLease switch to ${tokenInChainName}`,
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
        addNotification({
          type: NotificationType.Info,
          message: "Please sign transaction",
          shouldExpire: true,
        });
        await sendTransaction({
          data: transactionRequest.data,
          from: selectedWalletAddress ?? account,
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
          account,
          beforeUnLoadRef.current.signal
        );
        if (res?.transactionRequest) {
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
          addNotification({
            type: NotificationType.Error,
            message: "Could not find a route for your requested trade",
            shouldExpire: true,
          });
        }
      }
    } catch (error) {
      //eslint-disable-next-line
      debugger;
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
      if (state.transaction && account) {
        storeTransactionData({
          transactionResponse: state.transaction,
          address: account,
          transactionId: txId,
        });
      }
    }
    if (state.status === "Exception") {
      handleException(state);
    }
  }, [handleException, account, nextScreen, txId, state, tokenOut]);

  useEffect(() => {
    const onBeforeUnload = () => {
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return { loading, state, executeTransaction };
};
