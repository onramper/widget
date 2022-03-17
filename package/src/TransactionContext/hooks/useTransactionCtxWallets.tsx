import { useCallback, useContext } from "react";
import { TransactionContext } from "..";
import { BASE_API } from "../../ApiContext/api/constants";
import { WalletItemData } from "../../ApiContext/api/types/nextStep";
import { ActionTypes } from "../reducers";
import { useTransactionContext } from "./useTransactionContext";
import { isAddress } from "layer2";

export const useTransactionCtxWallets = () => {
  const { dispatch } = useContext(TransactionContext);
  const { userId, wallets } = useTransactionContext();

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
    const resp = await fetch(`${BASE_API}/getUserWallets/${userId}`);
    const data = (await resp.json()) as {
      wallets: WalletItemData[];
    };

    if (!resp.ok) {
      throw data;
    }

    dispatch({
      type: ActionTypes.UpdateWallets,
      payload: data.wallets,
    });
  }, [dispatch, userId]);

  const editWallet = useCallback(
    async (wallet: WalletItemData, address: string) => {
      if (!address) {
        return Promise.reject(new Error("Value cannot be empty."));
      }

      const duplicate = wallets.find(
        (item) => item !== wallet && item.address === address
      );
      if (duplicate) {
        return Promise.reject(
          new Error(
            `There is already one wallet with address ('${duplicate.name}').`
          )
        );
      }

      if (!isAddress(address)) {
        return Promise.reject(new Error(`Not a valid wallet address.`));
      }

      const resp = await fetch(`${BASE_API}/updateUserWallet`, {
        method: "POST",
        body: JSON.stringify({
          wallet: { ...wallet, address },
          userId,
        }),
      });

      if (!resp.ok) {
        throw await resp.json();
      }

      updateWallets(
        wallets.map((item) => (item === wallet ? { ...item, address } : item))
      );
    },
    [updateWallets, userId, wallets]
  );

  return {
    updateWallets,
    selectWalletAddress,
    fetchAndUpdateUserWallets,
    editWallet,
  };
};
