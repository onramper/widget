import { isMetamaskEnabled } from "layer2";
import React, { useCallback, useEffect } from "react";
import { useNav } from "../NavContext";
import { browserSupportsMetamask } from "../utils";
import NoWalletView from "../steps/NoWalletView/NoWalletView";

export enum SupportLevels {
  WrongBrowser,
  NoWallet,
}

export const useWalletSupportRedirect = (
  currentProgress: number | undefined
) => {
  const { nextScreen } = useNav();

  const checkWalletSupport = useCallback(() => {
    if (!browserSupportsMetamask()) {
      // unsupported browser redirect
    } else if (browserSupportsMetamask() && !isMetamaskEnabled()) {
      nextScreen(<NoWalletView currentProgress={currentProgress} />);
    }
  }, [currentProgress, nextScreen]);

  useEffect(() => {
    // initial check for browser/wallet support
    checkWalletSupport();

    // keep polling
    const interval = setInterval(() => {
      checkWalletSupport();
      console.log("checking wallet support...");
    }, 2000);

    return () => clearInterval(interval);
  }, [checkWalletSupport]);
};
