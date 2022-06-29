import { useContext } from "react";
import { TransactionContext } from "..";
import { useLayer2 } from "../../web3/config";

export const useTransactionContext = () => {
  const { account: metaAddress } = useLayer2();
  const { state } = useContext(TransactionContext);

  if (!state.selectedWalletAddress) {
    return { ...state, selectedWalletAddress: metaAddress };
  }
  return state;
};
