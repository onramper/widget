import { useTransactionsContext } from "@usedapp/core/dist/esm/src/providers";
import { useCallback, useEffect, useRef, useState } from "react";
import { isErrorWithName } from "../../ApiContext/api";
import {
  NotificationType,
  useWidgetNotifications,
} from "../../NotificationContext";
import { useLayer2 } from "../../web3/config";
import { getLifiQuote } from "../../web3/lifi";
import { useTransactionContext } from "./useTransactionContext";
import { useTransactionCtxActions } from "./useTransactionCtxActions";

export const useUpdateQuote = () => {
  const [loading, setLoading] = useState(false);
  const { addNotification } = useWidgetNotifications();
  const { tokenIn, tokenOut, selectedWalletAddress, slippageTolerance } =
    useTransactionContext();
  const { setQuote, setTransactionRequest } = useTransactionCtxActions();
  const { account } = useLayer2();
  const beforeUnLoadRef = useRef<AbortController>(new AbortController());

  // we can't update quote without a destination wallet. this is so we can do a quote update before user connects.
  const dummyAccount = "0xC54070dA79E7E3e2c95D3a91fe98A42000e65a48";

  const updateQuote = useCallback(
    async (amountIn: number) => {
      const fromAddress = account ?? dummyAccount;
      const destinationAddress = selectedWalletAddress ?? account;
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
          fromAddress,
          destinationAddress,
          beforeUnLoadRef.current.signal,
          slippageTolerance
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
      account,
      addNotification,
      selectedWalletAddress,
      setQuote,
      setTransactionRequest,
      tokenIn,
      tokenOut,
    ]
  );

  useEffect(() => {
    const onBeforeUnload = () => {
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return {
    loading,
    updateQuote,
  };
};
