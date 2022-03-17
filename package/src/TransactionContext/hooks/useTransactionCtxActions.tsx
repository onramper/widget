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

  const updateSlippage = useCallback(
    (slippageTolerance: number) => {
      dispatch({
        type: ActionTypes.UpdateSlippageTolerance,
        payload: slippageTolerance,
      });
    },
    [dispatch]
  );

  const updateDeadline = useCallback(
    (deadline: number) => {
      dispatch({
        type: ActionTypes.UpdateDeadline,
        payload: deadline,
      });
    },
    [dispatch]
  );

  return { setQuote, updateSlippage, updateDeadline };
};
