import React, { useCallback, useEffect, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { NextStep } from "../../ApiContext";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import uriToHttp, { parseWrappedTokens } from "../../utils";
import ButtonAction from "../../common/Buttons/ButtonAction";
import {
  formatEther,
  InsufficientFundsError,
  InvalidParamsError,
  isMetamaskEnabled,
  OperationalError,
  QuoteDetails,
  useEtherBalance,
  useEthers,
  useLayer2,
  useSendTransaction,
} from "layer2";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";
import SwapDetailsBar from "./SwapDetailsBar/SwapDetailsBar";
import FeeBreakdown from "./FeeBreakdown/FeeBreakdown";
import { useWalletSupportRedirect, useConnectWallet } from "../../hooks";
import { useNav } from "../../NavContext";
import ConfirmSwapView from "./ConfirmSwapView/ConfirmSwapView";
import { createConfirmSwapProps, updatedStepFromEditSwap } from "./utils";
import { ConfirmSwapEditResults } from "./SwapOverviewView.models";

const SwapOverviewView: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = (props) => {
  const [nextStep, setNextStep] = useState(props.nextStep);
  const { account, active } = useEthers();
  const balance = useEtherBalance(account);
  const [quote, setQuote] = useState<QuoteDetails>(nextStep.data.transactionData);
  const { sendTransaction, state } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { layer2 } = useLayer2();
  const isActive = account && active;
  useWalletSupportRedirect(nextStep.progress);
  const { connect, connectionPending } = useConnectWallet();
  const { nextScreen } = useNav();

  const {
    data: { tokenIn, tokenOut, fiatSymbol },
  } = nextStep;

  useEffect(() => {
    // TODO: refresh to get new quote with setQuote()
  }, []);

  // if tokenIn === "WETH" then we want to display ETH instead
  const parsedTokenIn = parseWrappedTokens(tokenIn);
  const heading = `Swap ${parsedTokenIn.name} (${parsedTokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  // TODO: price oracle ??
  const getFiatConversion = useCallback(() => {
    return 200;
  }, []);

  const handleEdit = useCallback(async () => {
    const tokenInURL = uriToHttp(tokenIn.logoURI as string)[0];
    const tokenOutURL = uriToHttp(tokenOut.logoURI as string)[0];
    const fiatConversion = getFiatConversion();

    const submitData = (results: ConfirmSwapEditResults) => {
      const updateStep = updatedStepFromEditSwap(nextStep, results);
      setNextStep({ ...updateStep });
      setQuote(updateStep.data.transactionData);
    };

    nextScreen(
      <ConfirmSwapView
        {...createConfirmSwapProps({
          data: nextStep.data,
          parsedTokenIn,
          fiatConversion,
          tokenInURL,
          tokenOutURL,
        })}
        submitData={submitData}
      />
    );
  }, [
    getFiatConversion,
    nextScreen,
    nextStep,
    parsedTokenIn,
    tokenIn.logoURI,
    tokenOut.logoURI,
  ]);

  const handleSwap = async () => {
    if (account && balance) {
      setLoading(true);
      setMessage("Fetching best price...");
      try {
        const res = await layer2.getSwapParams(
          Number(formatEther(balance)),
          tokenIn.chainId,
          Number(quote.amountDecimals),
          tokenOut.address,
          account
        );
        setMessage("Please sign transaction");
        if (res) {
          sendTransaction({
            data: res.data,
            to: res.to,
            value: res.value,
            from: account,
          });
        }
      } catch (error) {
        setLoading(false);
        if (error instanceof InsufficientFundsError) {
          alert("insufficient funds!");
        }

        if (error instanceof InvalidParamsError) {
          alert("invalid params!");
        }
        if (error instanceof OperationalError) {
          alert("operational error!");
        }
      }
    } else {
      alert("please connect wallet");
    }
  };

  useEffect(() => {
    if (state.status === "Success") {
      setMessage("Success! 🥳");
      setLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }

    if (state.status === "Mining") {
      setMessage("Processing transaction...");
    }

    if (state.status === "Fail") {
      setMessage("Transaction failed");
      setLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }

    if (state.status === "Exception") {
      setMessage("Woops, something went wrong");
      setLoading(false);
      setTimeout(() => setMessage(""), 2000);
    }
  }, [state]);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader
        noSeparator
        useBackButton
        percentage={nextStep.progress}
      />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <Heading className={classes.heading} text={heading} />
        <SwapDetailsBar
          estimate={quote}
          tokenIn={parsedTokenIn}
          tokenOut={tokenOut}
          conversion={`${fiatSymbol}${getFiatConversion()}`}
        />
        <FeeBreakdown transactionDetails={quote} />
        <div className={classes.message}>{message}</div>
        <div className={classes.buttonContainer}>
          {isActive ? (
            <>
              <ButtonSecondary
                className={classes.buttonInGroup}
                text="Edit"
                onClick={handleEdit}
                disabled={loading}
              />
              <ButtonAction
                disabled={!isActive || loading}
                className={classes.buttonInGroup}
                text={"Confirm Swap"}
                onClick={handleSwap}
                pending={loading}
              />
            </>
          ) : (
            <ButtonAction
              text="Connect Wallet"
              pending={connectionPending}
              onClick={connect}
              disabled={!isMetamaskEnabled() || connectionPending}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SwapOverviewView;
