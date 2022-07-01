import { useTransactionsContext } from "@usedapp/core/dist/esm/src/providers";
import { nanoid } from "nanoid";
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
  const { addNotification, removeNotification } = useWidgetNotifications();
  const { tokenIn, tokenOut, selectedWalletAddress, slippageTolerance } =
    useTransactionContext();
  const { setQuote, setTransactionRequest } = useTransactionCtxActions();
  const { account } = useLayer2();

  // we can't update quote without a destination wallet. this is so we can do a quote update before user connects.
  const dummyAccount = "0xe4181e5DcD7D2ff8FB8fE8869d98F3124EDF1faD";

  const updateQuote = useCallback(
    async (amountIn: number, signal?: AbortSignal) => {
      const fromAddress = account ?? dummyAccount;
      const destinationAddress = selectedWalletAddress ?? account;
      setLoading(true);
      try {
        const id = nanoid();
        addNotification({
          type: NotificationType.Info,
          message: "Updating quote...",
          shouldExpire: true,
          id,
        });
        const res = await getLifiQuote(
          tokenIn,
          tokenOut,
          amountIn,
          fromAddress,
          destinationAddress,
          signal,
          slippageTolerance
        );
        removeNotification(id);
        if (signal?.aborted) {
          setLoading(false);
          return;
        }
        if (res) {
          addNotification({
            type: NotificationType.Success,
            message: "Quote updated",
            shouldExpire: true,
          });
          setQuote(res.estimate);
          // we do not want to save a txRequest to a dummy address (this was just for displaying an initial quote)
          if (res.transactionRequest && fromAddress !== dummyAccount) {
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
      removeNotification,
      selectedWalletAddress,
      setQuote,
      setTransactionRequest,
      slippageTolerance,
      tokenIn,
      tokenOut,
    ]
  );

  return {
    loading,
    updateQuote,
  };
};
