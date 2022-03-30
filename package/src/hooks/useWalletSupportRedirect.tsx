import { isMetamaskEnabled } from "layer2";
import React, { useCallback, useEffect } from "react";
import { useNav } from "../NavContext";
import { browserSupportsMetamask, isMobile } from "../utils";
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
    try {
      if(!browserSupportsMetamask()) {
        replaceScreen(
          <BrowserNotSupported currentProgress={currentProgress} />
        );
        return;
      }
      if (isMetamaskEnabled()) {
        return;
      }
      if (isMobile()) {
        // TODO: Screen with prompt to download Metamask app for mobile
        replaceScreen(
          <BrowserNotSupported currentProgress={currentProgress} />
        );
        return;
      }
      if (!isMetamaskEnabled() && !isMobile()) {
        nextScreen(<NoWalletView currentProgress={currentProgress} />);
        return;
      }

      replaceScreen(
        <BrowserNotSupported currentProgress={currentProgress} />
      );
    } catch (error) {
      replaceScreen(<BrowserNotSupported currentProgress={currentProgress} />);
    }
  }, [currentProgress, nextScreen, replaceScreen]);

  useEffect(() => {
    // initial check for browser/wallet support
    checkWalletSupport();
  }, [checkWalletSupport]);
};
