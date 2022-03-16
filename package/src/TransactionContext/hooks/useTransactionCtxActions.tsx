import { useCallback, useContext } from "react";
import { TransactionContext } from "..";
import { InitParams } from "../models";
import { ActionTypes } from "../reducers";

export const useTransactionCtxActions = () => {
  const { dispatch } = useContext(TransactionContext);

  const init = useCallback(
    ({ userId }: InitParams) => {
      dispatch({
        type: ActionTypes.Init,
        payload: {
          userId,
        },
      });
    },
    [dispatch]
  );

  return { init };
};
