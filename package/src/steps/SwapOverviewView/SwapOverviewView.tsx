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
import OrderCompleteView from "../OrderCompleteView/OrderCompleteView";
import ConfirmSwapView from "./ConfirmSwapView/ConfirmSwapView";
import { createConfirmSwapProps, updatedStepFromEditSwap } from "./utils";
import { ConfirmSwapEditResults } from "./SwapOverviewView.models";

const SwapOverviewView: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = (props) => {
  const [nextStep, setNextStep] = useState(props.nextStep);
  const { account, active } = useEthers();
  const balance = useEtherBalance(account);
  const [quote, setQuote] = useState<QuoteDetails>(
    nextStep.data.transactionData
  );
  const { sendTransaction, state } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { getQuote, getSwapParams } = useLayer2();
  const isActive = account && active;
  useWalletSupportRedirect(nextStep.progress);
  const { connect, connectionPending, error } = useConnectWallet();
  const { nextScreen } = useNav();

  const {
    data: { tokenIn, tokenOut, fiatSymbol },
  } = nextStep;

  const updateMessageAndClear = (mes: string) => {
    setMessage(mes);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdate = useCallback(async () => {
    setMessage("Updating quote...");
    setLoading(true);
    try {
      const newQuote = await getQuote(
        tokenIn.chainId,
        Number(quote.amountDecimals),
        tokenOut.address
      );
      if (newQuote) {
        setQuote(newQuote);
        updateMessageAndClear("Quote successfully updated");
      }
    } catch (error) {
      if (error instanceof InvalidParamsError) {
        updateMessageAndClear("Invalid Transaction Parameters");
      }
      if (error instanceof OperationalError) {
        updateMessageAndClear("Oops something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [getQuote, quote.amountDecimals, tokenIn.chainId, tokenOut.address]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

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
      updatedStepFromEditSwap(nextStep, quote, results);
      setNextStep({ ...nextStep });
      setQuote({ ...quote });
    };

    nextScreen(
      <ConfirmSwapView
        {...createConfirmSwapProps({
          data: nextStep.data,
          parsedTokenIn,
          fiatConversion,
          tokenInURL,
          tokenOutURL,
          quote,
        })}
        submitData={submitData}
      />
    );
  }, [
    getFiatConversion,
    nextScreen,
    nextStep,
    parsedTokenIn,
    quote,
    tokenIn.logoURI,
    tokenOut.logoURI,
  ]);

  useEffect(() => {
    if (error) {
      setMessage(error.message);
      setTimeout(() => setMessage(""), 3000);
    }
  }, [error]);

  const handleSwap = async () => {
    if (account && balance) {
      setLoading(true);
      setMessage("Fetching best price...");
      try {
        const res = await getSwapParams(
          Number(formatEther(balance)),
          tokenIn.chainId,
          Number(quote.amountDecimals),
          tokenOut.address,
          account
        );
        setMessage("Please sign transaction");
        if (res) {
          await sendTransaction({
            data: res.data,
            to: res.to,
            value: res.value,
            from: account,
          });

          nextScreen(
            <OrderCompleteView
              title="Success! Your Swap is being executed."
              description="You will receive an email when the swap is complete and the crypto has arrived in your wallet. "
            />
          );
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
