import React, { useContext } from "react";
import { APIContext } from "../ApiContext";
import BuyCryptoView from "../BuyCryptoView";
import TransactionLoadingView from "./TransactionLoadingView";

const BaseScreenView: React.FC = () => {
  const {
    collected,
    data: { isRateError },
  } = useContext(APIContext);
  const { skipTransactionScreen } = collected;

  if (skipTransactionScreen && !isRateError) {
    return <TransactionLoadingView />;
  } else {
    return <BuyCryptoView />;
  }
};

export default BaseScreenView;
