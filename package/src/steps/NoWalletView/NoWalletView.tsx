import React, { useCallback, useEffect } from "react";
import Heading from "../../common/Heading/Heading";
import classes from "./NoWalletView.module.css";
import { ReactComponent as Metamask } from "../../icons/metamask.svg";
import { ButtonLink } from "../../common/Buttons";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { isMetamaskEnabled } from "layer2";
import { useNav } from "../../NavContext";

interface Props {
  currentProgress: number | undefined;
}

const NoMetamaskView = ({ currentProgress }: Props) => {
  const { backScreen } = useNav();

  const checkWalletSupport = useCallback(() => {
    if (isMetamaskEnabled()) {
      backScreen();
    }
  }, [backScreen]);

  useEffect(() => {
    // initial check for browser/wallet support
    checkWalletSupport();

    // keep polling
    const interval = setInterval(() => {
      checkWalletSupport();
    }, 2000);

    return () => clearInterval(interval);
  }, [checkWalletSupport]);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader noSeparator percentage={currentProgress} />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Metamask className={classes.walletIcon} />
        <Heading
          textSubHeading="If you already have a Metamask Wallet please install on 
your browser."
          className={classes.heading}
          text="Install Metamask"
        />
        <ButtonLink
          className={classes.linkButton}
          external
          path="https://metamask.io/download/"
          text="Install Metamask"
        />
        <p className={classes.instruction}>
          For more info go to{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://metamask.io/"
          >
            https://metamask.io/
          </a>{" "}
        </p>
        <div className={classes.dividerContainer}>
          <hr />
          <p>OR</p>
        </div>

        <div className={classes.steps}>
          <p>
            <strong>Step 1:</strong> Go to your browser's Extensions store.
          </p>
          <p>
            <strong>Step 2:</strong> Search MetaMask.
          </p>
          <p>
            <strong>Step 3:</strong> Check legitimacy of download count. It
            should be at least 2000.
          </p>
          <p>
            <strong>Step 4:</strong> Download and follow setup instruction.
          </p>
        </div>
      </main>
    </div>
  );
};

export default NoMetamaskView;

// Step 1: Go to Chrome Web Store Extensions Section.

// Step 2: Search MetaMask.

// Step 3: Check the number of downloads to make sure that the legitimate MetaMask is being installed, as hackers might try to make clones of it.

// Step 4: Click the Add to Chrome button.
