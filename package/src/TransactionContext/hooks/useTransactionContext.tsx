import { useLayer2 } from "layer2";
import { useContext } from "react";
import { TransactionContext } from "..";

export const useTransactionContext = () => {
  const { account: metaAddress } = useLayer2();
  const { state } = useContext(TransactionContext);

  if (!state.selectedWalletAddress) {
    return { ...state, selectedWalletAddress: metaAddress };
  }
  return state;
};
