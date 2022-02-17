import React, { useEffect, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { NextStep } from "../../ApiContext";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import { parseWrappedTokens } from "../../utils";
import ButtonAction from "../../common/Buttons/ButtonAction";
import { isMetamaskEnabled, useEthers } from "layer2";

const SwapOverviewView: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = ({ nextStep }) => {
  const { account, active, activateBrowserWallet } = useEthers();
  const [connecting, setConnecting] = useState(false);
  // const { layer2 } = useLayer2();

  const isActive = account && active;

  const {
    data: { tokenIn, tokenOut },
  } = nextStep;

  // if tokenIn === "WETH" then we want to display ETH instead
  const parsedTokenIn = parseWrappedTokens(tokenIn);
  const heading = `Swap ${parsedTokenIn.name} (${parsedTokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const handleConnect = () => {
    setConnecting(true);
    activateBrowserWallet();
  };

  useEffect(() => {
    if (isActive) {
      setConnecting(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isMetamaskEnabled()) {
      // go to other screen
    }
  }, []);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        noSeparator
        useBackButton
        percentage={nextStep.progress}
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading className={classes.heading} text={heading} />
        {account && <p>{account}</p>}
        <div className={classes.buttonContainer}>
          {isActive ? (
            <>
              <ButtonAction
                text={isActive ? "connected" : "Connect Wallet"}
                onClick={activateBrowserWallet}
              />
              <ButtonAction
                text={isActive ? "connected" : "Connect Wallet"}
                onClick={activateBrowserWallet}
              />
            </>
          ) : (
            <ButtonAction
              text="Connect Wallet"
              pending={connecting}
              onClick={handleConnect}
              disabled={!isMetamaskEnabled()}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SwapOverviewView;
