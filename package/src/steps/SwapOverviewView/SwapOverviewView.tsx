import React, { useCallback, useEffect, useRef, useState } from "react";
import commonClasses from "../../styles.module.css";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { NextStep } from "../../ApiContext";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import classes from "./SwapOverviewView.module.css";
import { parseWrappedTokens } from "../../utils";
import ButtonAction from "../../common/Buttons/ButtonAction";
import {
  formatEther,
  isMetamaskEnabled,
  useEtherBalance,
  getQuote,
  getSwapParams,
  useLayer2,
  useSendTransaction,
} from "layer2";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";
import SwapDetailsBar from "./SwapDetailsBar/SwapDetailsBar";
import FeeBreakdown from "./FeeBreakdown/FeeBreakdown";
import { useWalletSupportRedirect, useConnectWallet } from "../../hooks";
import { useNav } from "../../NavContext";
import OrderCompleteView from "../OrderCompleteView/OrderCompleteView";
import EditSwapView from "./EditSwapView/EditSwapView";
import {
  useTransactionContext,
  useTransactionCtxWallets,
  useTranasactionCtxInit,
  useTransactionCtxActions
} from "../../TransactionContext/hooks";

const SwapOverviewView: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = (props) => {
  const [nextStep] = useState(props.nextStep);
  const { account: metaAddress, active } = useLayer2();
  const balance = useEtherBalance(metaAddress);
  const {
    currentQuote: quote,
    fiatConversionOut,
    fiatConversionIn,
    fiatSymbol,
    tokenIn,
    tokenOut,
    slippageTolerance,
    deadline,
  } = useTransactionContext();
  const { setQuote } = useTransactionCtxActions();
  const { fetchAndUpdateUserWallets } = useTransactionCtxWallets();

  const { sendTransaction, state } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isActive = metaAddress && active;
  useWalletSupportRedirect(nextStep.progress);
  const { connect, connectionPending, error } = useConnectWallet();
  const { nextScreen } = useNav();

  const beforeUnLoadRef = useRef<AbortController>(new AbortController());

  const { amountDecimals } = quote;

  const updateMessageAndClear = (mes: string) => {
    setMessage(mes);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdate = useCallback(async () => {
    setMessage("Updating quote...");
    setLoading(true);
    try {
      const newQuote = await getQuote(
        tokenIn,
        tokenOut,
        Number(amountDecimals),
        false,
        beforeUnLoadRef.current.signal
      );
      if (newQuote) {
        setQuote(newQuote);
        updateMessageAndClear("Quote successfully updated");
      }
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        return;
      }
      alert(error);
    } finally {
      setLoading(false);
    }
  }, [amountDecimals, setQuote, tokenIn, tokenOut]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  // if tokenIn === "WETH" then we want to display ETH instead
  const parsedTokenIn = parseWrappedTokens(tokenIn);
  const heading = `Swap ${parsedTokenIn.name} (${parsedTokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const handleEdit = useCallback(async () => {
    nextScreen(<EditSwapView progress={nextStep.progress} />);
  }, [nextScreen, nextStep.progress]);

  useEffect(() => {
    if (error) {
      updateMessageAndClear(error.message);
    }
  }, [error]);

  const handleSwap = async () => {
    if (metaAddress && balance) {
      setLoading(true);
      setMessage("Fetching best price...");
      try {
        const res = await getSwapParams(
          Number(formatEther(balance)),
          tokenIn,
          tokenOut,
          Number(amountDecimals),
          metaAddress,
          undefined,
          {
            slippageTolerance,
            deadline,
          }
        );

        setMessage("Please sign transaction");
        if (res?.data) {
          await sendTransaction({
            data: res.data,
            to: res.to,
            value: res.value,
            from: metaAddress,
          });
        }
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }
        alert(error);
      }
    } else {
      alert("please connect wallet");
    }
  };

  // replace this with better user feedback
  useEffect(() => {
    if (state.status === "Success") {
      setMessage("Success! 🥳");
      setLoading(false);
    }
    if (state.status === "Mining") {
      setMessage("Processing transaction...");
      nextScreen(
        <OrderCompleteView
          title="Success! Your Swap has been executed."
          description="You will receive an email when the swap is complete and the crypto has arrived in your wallet. "
          tokenOut={tokenOut}
        />
      );
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
  }, [nextScreen, state, tokenOut]);

  useEffect(() => {
    const onBeforeUnload = () => {
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  useEffect(() => {
    try {
      fetchAndUpdateUserWallets();
    } catch (err) {
      alert(err);
    }
  }, [fetchAndUpdateUserWallets]);

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
          conversionIn={`${fiatSymbol}${fiatConversionIn}`}
          conversionOut={`${fiatSymbol}${fiatConversionOut}`}
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

const WithContextInit: React.FC<{
  nextStep: NextStep & { type: "transactionOverview" };
}> = (props) => {
  const isInit = useTranasactionCtxInit(props.nextStep.data, Date.now());
  const { replaceScreen } = useNav();

  useEffect(() => {
    if (isInit) {
      replaceScreen(<SwapOverviewView nextStep={props.nextStep} />);
    }
  }, [isInit, props.nextStep, replaceScreen]);

  return <></>;
};

export default WithContextInit;
