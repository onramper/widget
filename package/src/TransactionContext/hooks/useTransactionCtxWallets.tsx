import { useCallback, useContext } from "react";
import { TransactionContext } from "..";
import { BASE_API } from "../../ApiContext/api/constants";
import { WalletItemData } from "../../ApiContext/api/types/nextStep";
import { ActionTypes } from "../reducers";
import { useTransactionContext } from "./useTransactionContext";

export const useTransactionCtxWallets = () => {
  const { dispatch } = useContext(TransactionContext);
  const { userId } = useTransactionContext();

  const updateWallets = useCallback(
    (wallets: WalletItemData[]) => {
      dispatch({
        type: ActionTypes.UpdateWallets,
        payload: wallets,
      });
    },
    [dispatch]
  );

  const selectWalletAddress = useCallback(
    (address?: string) => {
      dispatch({
        type: ActionTypes.SetSelectedWalletAddress,
        payload: address,
      });
    },
    [dispatch]
  );

  const fetchAndUpdateUserWallets = useCallback(async () => {
    const data = (await (
      await fetch(`${BASE_API}/getUserWallets/${userId}`)
    ).json()) as {
      wallets: WalletItemData[];
    };

    dispatch({
      type: ActionTypes.UpdateWallets,
      payload: data.wallets,
    });
  }, [dispatch, userId]);

  return {
    updateWallets,
    selectWalletAddress,
    fetchAndUpdateUserWallets,
  };
};
