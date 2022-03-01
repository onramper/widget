import { isMetamaskEnabled } from "layer2";
import React, { useCallback, useEffect } from "react";
import { useNav } from "../NavContext";
import { browserSupportsMetamask } from "../utils";
import NoWalletView from "../steps/NoWalletView/NoWalletView";
import BrowserNotSupported from "../steps/SwapOverviewView/BrowserNotSupported/BrowserNotSupported";

export enum SupportLevels {
  WrongBrowser,
  NoWallet,
}

export const useWalletSupportRedirect = (
  currentProgress: number | undefined
) => {
  const { nextScreen, replaceScreen } = useNav();

  const checkWalletSupport = useCallback(() => {
    if (!browserSupportsMetamask()) {
      replaceScreen(<BrowserNotSupported currentProgress={currentProgress} />);
    } else if (browserSupportsMetamask() && !isMetamaskEnabled()) {
      nextScreen(<NoWalletView currentProgress={currentProgress} />);
    }
  }, [currentProgress, nextScreen, replaceScreen]);

  useEffect(() => {
    // initial check for browser/wallet support
    checkWalletSupport();
  }, [checkWalletSupport]);
};
