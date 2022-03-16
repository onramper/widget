import { useCallback, useContext } from "react";
import { TransactionContext } from "..";
import { WalletItemData } from "../../ApiContext/api/types/nextStep";
import { ActionTypes } from "../reducers";

export const useTransactionCtxWallets = () => {
  const { dispatch } = useContext(TransactionContext);

  const updateWallets = useCallback(
    (wallets: WalletItemData[]) => {
      dispatch({
        type: ActionTypes.UpdateWallets,
        payload: wallets,
      });
    },
    [dispatch]
  );

  const selectWalletAddress = useCallback((address: string) => {
    dispatch({
        type: ActionTypes.SetSelectedWalletAddress,
        payload: address,
      });
  }, [dispatch]);

  return { updateWallets, selectWalletAddress };
};
