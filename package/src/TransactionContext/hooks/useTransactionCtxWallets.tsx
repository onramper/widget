import { useCallback, useContext } from "react";
import { TransactionContext } from "..";
import { BASE_API } from "../../ApiContext/api/constants";
import { WalletItemData } from "../../ApiContext/api/types/nextStep";
import { ActionTypes } from "../reducers";
import { useTransactionContext } from "./useTransactionContext";
import { getEnsNameFromAddress } from "layer2";
import { useLayer2 } from "../../web3/config";
import { utils } from "ethers";

export const useTransactionCtxWallets = () => {
  const { dispatch } = useContext(TransactionContext);
  const { userId, wallets, selectedWalletAddress } = useTransactionContext();
  const { account: metaAddress, library } = useLayer2();

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

  const getGenericWalletName = useCallback(
    () => `Account ${wallets?.length + 1 ?? 0}`,
    [wallets.length]
  );

  const addNewWallet = useCallback(
    async (newAddress: string) => {
      if (!newAddress) {
        return Promise.reject(new Error("Address cannot be empty."));
      }

      if (newAddress === metaAddress) {
        return Promise.reject(
          new Error(
            `There is already one wallet with address (MetaMask Wallet).`
          )
        );
      }

      const duplicate = wallets.find((item) => item.address === newAddress);
      if (duplicate) {
        return Promise.reject(
          new Error(
            `There is already one wallet with address ('${duplicate.name}').`
          )
        );
      }

      if (!utils.isAddress(newAddress)) {
        return Promise.reject(new Error(`Not a valid wallet address.`));
      }

      let name: string | null = "";
      if (library) {
        name = await getEnsNameFromAddress(newAddress, library);
      }
      if (!name) {
        name = getGenericWalletName();
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
          address: wallet.address,
        }),
      });

      if (!resp.ok) {
        throw await resp.json();
      }

      updateWallets([wallet, ...wallets]);
    },
    [getGenericWalletName, library, metaAddress, updateWallets, userId, wallets]
  );

  /**
   * when a wallet item is edited, the name should be changed with the new corresponding ens name if any exists,
   * if not, the old name should be preserved only if the old address didn't use any ens name, otherwise another generic name is returned
   */
  const determineWalletNameOnEdit = useCallback(
    async (wallet: WalletItemData, newAddress: string) => {
      const ensNameByNewAddress = library
        ? await getEnsNameFromAddress(newAddress, library)
        : undefined;
      if (ensNameByNewAddress) {
        return ensNameByNewAddress;
      }

      const ensNameOfOldAddress = library
        ? await getEnsNameFromAddress(wallet.address, library)
        : undefined;
      if (ensNameOfOldAddress) {
        return getGenericWalletName();
      }

      return wallet.name;
    },
    [getGenericWalletName, library]
  );

  const editWallet = useCallback(
    async (wallet: WalletItemData, newAddress: string) => {
      if (!newAddress) {
        return Promise.reject(new Error("Address cannot be empty."));
      }

      if (newAddress === metaAddress) {
        return Promise.reject(
          new Error(
            `There is already one wallet with address (MetaMask Wallet).`
          )
        );
      }

      if (newAddress === wallet.address) {
        return Promise.resolve();
      }

      const duplicate = wallets.find(
        (item) => item !== wallet && item.address === newAddress
      );
      if (duplicate) {
        return Promise.reject(
          new Error(
            `There is already one wallet with address ('${duplicate.name}').`
          )
        );
      }

      if (!utils.isAddress(newAddress)) {
        return Promise.reject(new Error(`Not a valid wallet address.`));
      }

      const newOrOldName = await determineWalletNameOnEdit(wallet, newAddress);
      const oldAddress = wallet.address;
      const newWallet = { ...wallet, address: newAddress, name: newOrOldName };

      const resp = await fetch(`${BASE_API}/updateUserWallet`, {
        method: "POST",
        body: JSON.stringify({
          wallet: newWallet,
          userId,
          address: oldAddress,
        }),
      });

      if (!resp.ok) {
        throw await resp.json();
      }

      updateWallets(
        wallets.map((item) => (item === wallet ? newWallet : item))
      );

      if (oldAddress === selectedWalletAddress) {
        selectWalletAddress(newAddress);
      }
    },
    [
      determineWalletNameOnEdit,
      metaAddress,
      selectWalletAddress,
      selectedWalletAddress,
      updateWallets,
      userId,
      wallets,
    ]
  );

  const deleteWallet = useCallback(
    async (address: string) => {
      const wallet = wallets.find((item) => item.address === address);
      if (!wallet) {
        return;
      }

      if (wallet.address === selectedWalletAddress) {
        //selects MM wallet
        selectWalletAddress(undefined);
      }
      updateWallets(wallets.filter((item) => item.address !== address));

      const resp = await fetch(`${BASE_API}/removeUserWallet`, {
        method: "DELETE",
        body: JSON.stringify({
          address,
          userId,
        }),
      });

      if (!resp.ok) {
        updateWallets([
          wallet,
          ...wallets.filter((item) => item.address !== address),
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
