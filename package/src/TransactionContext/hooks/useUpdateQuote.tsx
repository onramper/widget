import { nanoid } from "nanoid";
import { useCallback, useState } from "react";
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
  const dummyAccount = "0xeD6dF2f28Bb5Ee69B3e2B7518F456eFDC81dFCbb";

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
