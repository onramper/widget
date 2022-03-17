import { useContext, useLayoutEffect, useState } from "react";
import { TransactionContext } from "..";
import { SwapOverviewStepData } from "../../ApiContext/api/types/nextStep";
import { ActionTypes } from "../reducers";
import { useTransactionContext } from "./useTransactionContext";

export const useTranasactionCtxInit = (
  data: SwapOverviewStepData,
  newKey: number
) => {
  const [key] = useState(newKey);
  const { dispatch } = useContext(TransactionContext);
  const { key: currentKey } = useTransactionContext();

  useLayoutEffect(() => {
    dispatch({
      type: ActionTypes.Init,
      payload: {
        key,
        userId: data.userId,
        currentQuote: data.transactionData,
        tokenIn: data.tokenIn,
        tokenOut: data.tokenOut,
      },
    });
  }, [dispatch, data, key]);

  return key === currentKey;
};
