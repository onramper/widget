import { QuoteDetails, TokenInfo } from "layer2";
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

  const updateTokenIn = useCallback(
    (token: TokenInfo) => {
      dispatch({
        type: ActionTypes.UpdateTokenIn,
        payload: token,
      });
    },
    [dispatch]
  );

  const updateTokenOut = useCallback(
    (token: TokenInfo) => {
      dispatch({
        type: ActionTypes.UpdateTokenOut,
        payload: token,
      });
    },
    [dispatch]
  );

  const updateFiatSymbol = useCallback(
    (faitSymbol: string) => {
      dispatch({
        type: ActionTypes.UpdateFiatSymbol,
        payload: faitSymbol,
      });
    },
    [dispatch]
  );

  const updateInAmount = useCallback(
    (inAmount: number) => {
      dispatch({
        type: ActionTypes.UpdateInAmount,
        payload: inAmount,
      });
    },
    [dispatch]
  );

  const initialiseTransactionContext = useCallback(
    (payload: {
      txId: string;
      userId: string;
      tokenIn: TokenInfo;
      tokenOut: TokenInfo;
      fiatSymbol: string;
      inAmount: number;
    }) => {
      dispatch({
        type: ActionTypes.Init,
        payload: payload,
      });
    },
    [dispatch]
  );
  return {
    initialiseTransactionContext,
    setQuote,
    updateSlippage,
    updateDeadline,
    updateTokenIn,
    updateTokenOut,
    updateFiatSymbol,
    updateInAmount,
  };
};
