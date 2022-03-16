import { useContext } from "react";
import { TransactionContext } from "..";

export const useTransactionContext = () => {
  return useContext(TransactionContext).state;
};
