import { useCallback, useContext } from "react";
import { TransactionContext } from "..";
import { BASE_API } from "../../ApiContext/api/constants";
import { WalletItemData } from "../../ApiContext/api/types/nextStep";
import { ActionTypes } from "../reducers";
import { useTransactionContext } from "./useTransactionContext";
import { getEnsNameFromAddress, isAddress, useEthers } from "layer2";

export const useTransactionCtxWallets = () => {
  const { dispatch } = useContext(TransactionContext);
  const { userId, wallets, selectedWalletAddress } = useTransactionContext();
  const { library } = useEthers();

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

  const addNewWallet = useCallback(
    async (newAddress: string) => {
      if (!newAddress) {
        return Promise.reject(new Error("Address cannot be empty."));
      }

      const duplicate = wallets.find((item) => item.address === newAddress);
      if (duplicate) {
        return Promise.reject(
          new Error(
            `There is already one wallet with address ('${duplicate.name}').`
          )
        );
      }

      if (!isAddress(newAddress)) {
        return Promise.reject(new Error(`Not a valid wallet address.`));
      }

      let name: string | null = "";
      if (library) {
        name = await getEnsNameFromAddress(newAddress, library);
      }
      if (!name) {
        name = `Account ${wallets.length + 1}`;
      }

      const wallet = {
        address: newAddress,
        name,
        network: "Mainnet",
      };
      const resp = await fetch(`${BASE_API}/updateUserWallet`, {
        method: "POST",
        body: JSON.stringify({
          wallet,
          userId,
        }),
      });

      if (!resp.ok) {
        throw await resp.json();
      }

      updateWallets([wallet, ...wallets]);
    },
    [library, updateWallets, userId, wallets]
  );

  const editWallet = useCallback(
    async (wallet: WalletItemData, address: string) => {
      if (!address) {
        return Promise.reject(new Error("Address cannot be empty."));
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

  const deleteWallet = useCallback(
    async (walletName: string) => {
      const wallet = wallets.find((item) => item.name === walletName);
      if (!wallet) {
        return;
      }

      if (wallet.address === selectedWalletAddress) {
        //selects MM wallet
        selectWalletAddress(undefined);
      }
      updateWallets(wallets.filter((item) => item.name !== walletName));

      const resp = await fetch(`${BASE_API}/removeUserWallet`, {
        method: "DELETE",
        body: JSON.stringify({
          walletName,
          userId,
        }),
      });

      if (!resp.ok) {
        updateWallets([
          wallet,
          ...wallets.filter((item) => item.name !== walletName),
        ]);

        throw await resp.json();
      }
    },
    [selectWalletAddress, selectedWalletAddress, updateWallets, userId, wallets]
  );

  return {
    updateWallets,
    selectWalletAddress,
    fetchAndUpdateUserWallets,
    editWallet,
    addNewWallet,
    deleteWallet,
  };
};
