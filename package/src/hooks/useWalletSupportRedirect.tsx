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
      if (isMetamaskEnabled()) {
        return;
      } else if (!isMetamaskEnabled() && isMobile()) {
        // TODO: Screen with prompt to download Metamask app for mobile
        replaceScreen(
          <BrowserNotSupported currentProgress={currentProgress} />
        );
      } else if (
        browserSupportsMetamask() &&
        !isMetamaskEnabled() &&
        !isMobile()
      ) {
        nextScreen(<NoWalletView currentProgress={currentProgress} />);
      } else {
        replaceScreen(
          <BrowserNotSupported currentProgress={currentProgress} />
        );
      }
    } catch (error) {
      const myError = error as Error;
      replaceScreen(
        <BrowserNotSupported
          label={myError.message}
          currentProgress={currentProgress}
        />
      );
    }
  }, [currentProgress, nextScreen, replaceScreen]);

  useEffect(() => {
    // initial check for browser/wallet support
    checkWalletSupport();
  }, [checkWalletSupport]);
};
