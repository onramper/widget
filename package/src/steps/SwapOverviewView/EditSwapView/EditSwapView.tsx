import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NavContext, useNav } from "../../../NavContext";
import { EditSwapViewInput, EditSwapViewProps } from "./EditSwapView.models";
import commonClasses from "../../../styles.module.css";
import inputClasses from "../../../common/InputDropdown/InputDropdown.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../../common/Footer";
import ButtonAction from "../../../common/Buttons/ButtonAction";
import Heading from "../../../common/Heading/Heading";
import InputDropdown from "../../../common/InputDropdown/InputDropdown";
import uriToHttp, {
  formatTokenAmount,
  onChangeFloat,
  parseWrappedTokens,
  trimLargeNumber,
} from "../../../utils";
import Breakdown from "../../../common/Breakdown/Breakdown";
import { ReactComponent as HexExclamationIcon } from "./../../../icons/hex-exclamation.svg";
import TransactionSettings from "../TransactionSettings/TransactionSettings";
import classes from "./EditSwapView.module.css";
import { ApiError } from "../../../ApiContext/api";
import { CSSTransition } from "react-transition-group";
import { getUniswapQuote, TokenInfo, QuoteDetails } from "layer2";
import { useEtherBalance, useTokenBalance } from "@usedapp/core";
import { useDebouncedCallback } from "use-debounce";
import {
  useTransactionContext,
  useTransactionCtxActions,
} from "../../../TransactionContext/hooks";
import { useUsdPriceImpact } from "../../../TransactionContext/hooks/useUsdPriceImpact";
import { generateBreakdown } from "./utils";
import { BrakdownItem } from "../../../ApiContext/api/types/nextStep";
import { utils } from "ethers";
import { useLayer2 } from "../../../web3/config";
import { useUpdateQuote } from "../../../TransactionContext/hooks/useUpdateQuote";

const insufficientFoundsError =
  "You have insufficient funds to complete this transaction";

const EditSwapView: React.FC<EditSwapViewProps> = (props) => {
  const [swapErrorMessage, setSwapErrorMessage] = useState<string>();
  const { account } = useLayer2();

  const { inAmount, tokenIn, tokenOut, quote } = useTransactionContext();

  const [localInAmount, setLocalInAmount] = useState<string>(
    inAmount.toString()
  );

  const ethBalance = useEtherBalance(account);
  const tokenOutBalance = useTokenBalance(tokenOut.address, account);

  const [breakdown, setBreakdown] = useState<BrakdownItem[][]>([]);
  const { backScreen } = useNav();
  const { updateQuote, loading: quoteLoading } = useUpdateQuote();
  const beforeUnLoadRef = useRef<AbortController>(new AbortController());
  const heading = `Swap ${tokenIn.name} (${tokenIn.symbol}) for ${tokenOut.name} (${tokenOut.symbol})`;

  const debouncedUpdateQuote = useDebouncedCallback(updateQuote, 600);

  useEffect(() => {
    if (Number(localInAmount) > 0) {
      debouncedUpdateQuote(
        Number(localInAmount),
        beforeUnLoadRef.current.signal
      );
    }
  }, [debouncedUpdateQuote, localInAmount]);

  const onMaxClick = useCallback(async () => {
    if (ethBalance) {
      setLocalInAmount(utils.formatEther(ethBalance));
    }
  }, [ethBalance]);

  // useEffect(() => {
  //   setBreakdown(
  //     generateBreakdown(
  //       localQuote,
  //       cryptoReceived.symbol,
  //       Number(slippageTolerance),
  //       priceImpact
  //     )
  //   );
  // }, [cryptoReceived.symbol, localQuote, priceImpact, slippageTolerance]);

  // useEffect(() => {
  //   if (swapErrorMessage && swapErrorMessage !== insufficientFoundsError) {
  //     return;
  //   }
  //   if (
  //     ethBalance &&
  //     Number(utils.formatEther(ethBalance)) < Number(spentValue)
  //   ) {
  //     setSwapErrorMessage(insufficientFoundsError);
  //     return;
  //   }
  //   setSwapErrorMessage("");
  // }, [ethBalance, spentValue, swapErrorMessage]);

  const computeTokenIn = (
    tokenIn: TokenInfo,
    quote: QuoteDetails,
    fiatSymbol: string
  ) => {
    const parsedTokenIn = parseWrappedTokens(tokenIn);
    const tokenInURL = tokenIn?.logoURI ? uriToHttp(tokenIn.logoURI)[0] : "";

    return {
      ...parsedTokenIn,
      label: "You spend",
      value: quote.amountDecimals,
      fiatSymbol,
      currencyShortName: parsedTokenIn.symbol,
      currencyLongName: parsedTokenIn.name,
      icon: tokenInURL,
    };
  };

  const computeTokenOut = (
    tokenOut: TokenInfo,
    quote: QuoteDetails,
    fiatSymbol: string
  ) => {
    const tokenOutURL = tokenOut?.logoURI ? uriToHttp(tokenOut.logoURI)[0] : "";

    return {
      ...tokenOut,
      label: "You receive",
      value: quote.quoteGasAdjustedDecimals,
      fiatSymbol,
      currencyShortName: tokenOut.symbol,
      currencyLongName: tokenOut.name,
      icon: tokenOutURL,
    };
  };

  const formattedOutputAmount = quote?.toAmountMin
    ? formatTokenAmount(tokenOut, quote?.toAmountMin)
    : "0.000";

  useEffect(() => {
    const onBeforeUnload = () => {
      // //eslint-disable-next-line
      // debugger;
      beforeUnLoadRef.current.abort();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      onBeforeUnload();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader percentage={props.progress} useBackButton />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["top-section"]}>
          <Heading className={classes.heading} text={heading} />
          <TransactionSettings className={classes["settings"]} />
        </div>

        <ErrorIndication message={swapErrorMessage} />

        <InputDropdown
          label={"You spend"}
          value={localInAmount}
          onChange={(e) =>
            onChangeFloat(e, (value) => {
              setLocalInAmount(value);
            })
          }
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${
            ethBalance ? utils.formatEther(ethBalance).slice(0, 5) : "0.00"
          }`}
          onMaxClick={onMaxClick}
          suffix={`($${quote?.fromAmountUSD ?? "0.00"})`}
          handleProps={{
            icon: tokenIn.logoURI,
            value: tokenIn.symbol,
            disabled: true,
          }}
          markedError={!!swapErrorMessage}
          useEditIcon={true}
        />

        <InputDropdown
          label={"You receive"}
          value={formattedOutputAmount}
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${
            tokenOutBalance
              ? trimLargeNumber(formatTokenAmount(tokenOut, tokenOutBalance), 6)
              : "0.00"
          }`}
          suffix={`($${quote?.toAmountUSD ?? "0.00"})`}
          handleProps={{
            icon: tokenOut.logoURI,
            value: tokenOut.symbol,
            disabled: true,
          }}
          readonly
        />

        <div className={classes["bottom-fields"]}>
          <Breakdown label={"Fee breakdown:"} groups={breakdown} />
          <IndicationItem
            text={
              "Above mentioned figures are valid for 1 minute based upon current market rates."
            }
          />
        </div>

        <div
          className={`${commonClasses["body-form-child"]} ${commonClasses["grow-col"]}`}
        >
          <ButtonAction
            onClick={backScreen}
            text={quoteLoading ? "Updating quote..." : "Continue"}
            disabled={
              !Number(localInAmount) || !!swapErrorMessage || quoteLoading
            }
          />
          <Footer />
        </div>
      </main>
    </div>
  );
};

const ErrorIndication: React.FC<{ message?: string }> = (props) => {
  const [message, setMessage] = useState(props.message || "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.message) {
      setMessage(props.message);
    }
  }, [props.message]);

  return (
    <CSSTransition
      nodeRef={ref}
      in={!!props.message}
      timeout={200}
      classNames={{
        enter: commonClasses["collapse-enter"],
        enterActive: commonClasses["collapse-enter-active"],
        exit: commonClasses["collapse-exit"],
        exitActive: commonClasses["collapse-exit-active"],
      }}
      mountOnEnter
      unmountOnExit
    >
      <div className={classes["error-section"]} ref={ref}>
        <IndicationItem error text={message} />
      </div>
    </CSSTransition>
  );
};
const IndicationItem: React.FC<{ error?: boolean; text: string }> = (props) => {
  return (
    <div
      className={`${classes["info-wrapper"]} ${
        props.error ? classes["indication-error"] : ""
      }`}
    >
      <HexExclamationIcon className={classes["exclamation-icon"]} />
      <div className={classes["info-txt"]}>{props.text}</div>
    </div>
  );
};

export default EditSwapView;
