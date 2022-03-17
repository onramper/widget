import { QuoteDetails } from "layer2";
import { useCallback, useContext } from "react";
import { TransactionContext } from "..";
import { ActionTypes } from "../reducers";

export const useTransactionCtxActions = () => {
  const { dispatch } = useContext(TransactionContext);

  const setQuote = useCallback(
    (quote: QuoteDetails) => {
      dispatch({
        type: ActionTypes.SetQuote,
        payload: quote,
      });
    },
    [dispatch]
  );

  const updateSwapSettings = useCallback(
    (payload: { slippageTolerance: number; deadline: number }) => {
      dispatch({
        type: ActionTypes.UpdateSwapSettings,
        payload,
      });
    },
    [dispatch]
  );

  return { setQuote, updateSwapSettings };
};
