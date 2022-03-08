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
  TokenInfo,
  useEtherBalance,
  useEthers,
  useLayer2,
  useSendTransaction,
  DEFAULTS as defaultSettings,
} from "layer2";
import ButtonSecondary from "../../common/Buttons/ButtonSecondary";
import SwapDetailsBar from "./SwapDetailsBar/SwapDetailsBar";
import FeeBreakdown from "./FeeBreakdown/FeeBreakdown";
import { useWalletSupportRedirect, useConnectWallet } from "../../hooks";
import { useNav } from "../../NavContext";
import OrderCompleteView from "../OrderCompleteView/OrderCompleteView";
import ConfirmSwapView from "./EditSwapView/EditSwapView";
import { createConfirmSwapProps } from "./utils";
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
  const { layer2 } = useLayer2();
  const isActive = account && active;
  useWalletSupportRedirect(nextStep.progress);
  const { connect, connectionPending, error } = useConnectWallet();
  const { nextScreen } = useNav();
  const [slippageTolerance, setSlippageTolerance] = useState(
    defaultSettings.slippageTolerance
  );
  const [deadline, setDeadline] = useState(defaultSettings.deadline);

  const {
    data: { tokenIn, tokenOut, fiatSymbol },
  } = nextStep;

  const updateMessageAndClear = (mes: string) => {
    setMessage(mes);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdateQuote = useCallback(
    async (tokenIn: TokenInfo, tokenOut: TokenInfo, amount: number) => {
      setMessage("Updating quote...");
      setLoading(true);
      try {
        const newQuote = await layer2.getQuote(
          tokenIn.chainId,
          amount,
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
    },
    [layer2]
  );

  // update the initial quote with the same parameters, on page load
  const handleUpdateCurrent = useCallback(() => {
    handleUpdateQuote(tokenIn, tokenOut, Number(quote.amountDecimals));
  }, [handleUpdateQuote, quote.amountDecimals, tokenIn, tokenOut]);

  useEffect(() => {
    handleUpdateCurrent();
  }, [handleUpdateCurrent]);

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
      const {
        spentValue,
        receivedValue,
        selectedWalletId,
        wallets,
        slippage,
        deadline,
      } = results;

      nextStep.data.transactionData.amountDecimals = spentValue;
      nextStep.data.transactionData.quoteGasAdjustedDecimals = receivedValue;
      quote.amountDecimals = spentValue;
      quote.quoteGasAdjustedDecimals = receivedValue;
      nextStep.data.walletsData.selectedWalletId = selectedWalletId;
      nextStep.data.walletsData.wallets = wallets;

      setNextStep({ ...nextStep });
      setQuote({ ...quote });
      setSlippageTolerance(slippage);
      setDeadline(deadline);
    };

    nextScreen(
      <ConfirmSwapView
        {...createConfirmSwapProps({
          data: nextStep.data,
          parsedTokenIn,
          tokenOut,
          fiatConversion,
          tokenInURL,
          tokenOutURL,
          quote,
          slippageTolerance,
          deadline: deadline,
        })}
        submitData={submitData}
      />
    );
  }, [
    deadline,
    getFiatConversion,
    nextScreen,
    nextStep,
    parsedTokenIn,
    quote,
    slippageTolerance,
    tokenIn.logoURI,
    tokenOut,
  ]);

  useEffect(() => {
    if (error) {
      updateMessageAndClear(error.message);
    }
  }, [error]);

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
          account,
          undefined,
          {
            slippageTolerance,
            deadline,
          }
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

  // replace this with better user feedback
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
