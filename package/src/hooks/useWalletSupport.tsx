import { isMetamaskEnabled } from "layer2";
import { useEffect, useState } from "react";
import { browserSupportsMetamask } from "../utils";

export enum SupportLevels {
  WrongBrowser,
  NoWallet,
  Okay,
}

export const useWalletSupport = (): SupportLevels => {
  const [support, setSupport] = useState<SupportLevels>(SupportLevels.Okay);

  const checkWalletSupport = () => {
    if (!browserSupportsMetamask()) {
      setSupport(SupportLevels.WrongBrowser);
    } else if (browserSupportsMetamask() && !isMetamaskEnabled()) {
      setSupport(SupportLevels.NoWallet);
    } else {
      setSupport(SupportLevels.Okay);
    }
  };

  useEffect(() => {
    // initial check for browser/wallet support
    checkWalletSupport();

    // keep polling
    const interval = setInterval(() => {
      checkWalletSupport();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return support;
};
