import React, { useContext } from "react";
import { APIContext } from "../ApiContext";
import BuyCryptoView from "../BuyCryptoView";
import SkipTransaction from "./SkipTransaction";

const BaseScreenView: React.FC = () => {
  const { collected } = useContext(APIContext);
  const { skipTransactionScreen } = collected;

  if (skipTransactionScreen) {
    return <SkipTransaction />;
  } else {
    return <BuyCryptoView />;
  }
};

export default BaseScreenView;
