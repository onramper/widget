import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { NavContext } from "../../../NavContext";
import { EditSwapViewInput, EditSwapViewProps } from "./EditSwapView.models";
import commonClasses from "../../../styles.module.css";
import inputClasses from "../../../common/InputDropdown/InputDropdown.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../../common/Footer";
import ButtonAction from "../../../common/Buttons/ButtonAction";
import Heading from "../../../common/Heading/Heading";
import InputDropdown from "../../../common/InputDropdown/InputDropdown";
import uriToHttp, {
  apiKey,
  onChangeFloat,
  parseWrappedTokens,
} from "../../../utils";
import Breakdown from "../../../common/Breakdown/Breakdown";
import { ReactComponent as HexExclamationIcon } from "./../../../icons/hex-exclamation.svg";
import TransactionSettings from "../TransactionSettings/TransactionSettings";
import classes from "./EditSwapView.module.css";
import { ApiError } from "../../../ApiContext/api";
import { CSSTransition } from "react-transition-group";
import {
  useEtherBalance,
  getQuote,
  useTokenBalance,
  TokenInfo,
  QuoteDetails,
} from "layer2";
import { useDebouncedCallback } from "use-debounce";
import {
  useTransactionContext,
  useTransactionCtxActions,
} from "../../../TransactionContext/hooks";
import { useUsdPriceImpact } from "../../../TransactionContext/hooks/useUsdPriceImpact";
import { generateBreakdown } from "./utils";
import { BrakdownItem } from "../../../ApiContext/api/types/nextStep";
import { utils } from "ethers";

const insufficientFoundsError =
  "You have insufficient funds to complete this transaction";

const EditSwapView: React.FC<EditSwapViewProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [swapErrorMessage, setSwapErrorMessage] = useState<string>();

  const {
    tokenIn,
    tokenOut,
    quote,
    fiatSymbol,
    slippageTolerance,
    selectedWalletAddress,
  } = useTransactionContext();
  const { setQuote, updateInAmount } = useTransactionCtxActions();
  const [cryptoSpent] = useState(computeTokenIn(tokenIn, quote, fiatSymbol));
  const [cryptoReceived] = useState(
    computeTokenOut(tokenOut, quote, fiatSymbol)
  );
  const [localQuote, setLocalQuote] = useState(quote);
  const priceImpact = useUsdPriceImpact(
    tokenIn,
    tokenOut,
    Number(localQuote.amountDecimals),
    Number(localQuote.quoteGasAdjustedDecimals)
  );

  const [spentValue, setSpentValue] = useState(cryptoSpent.value);
  const [actualSpentValue, setActualSpentValue] = useState(cryptoSpent.value);
  const [receivedValue, setReceivedValue] = useState(cryptoReceived.value);
  const [, setLastCallCryptoChange] = useState<AbortController>();

  const ethBalance = useEtherBalance(selectedWalletAddress);
  const targetTokenBalance = useTokenBalance(
    cryptoReceived.address,
    selectedWalletAddress
  );

  const [breakdown, setBreakdown] = useState<BrakdownItem[][]>([]);
  const { backScreen } = useContext(NavContext);
  const [heading] = useState(computeHeading(cryptoSpent, cryptoReceived));

  const onActionButton = useCallback(async () => {
    setQuote(localQuote);
    updateInAmount(Number(spentValue));
    backScreen();
  }, [backScreen, localQuote, setQuote, spentValue, updateInAmount]);

  const getAndUpdateAbortController = useCallback(() => {
    const newController = new AbortController();
    const { signal } = newController;

    setLastCallCryptoChange((currentController) => {
      currentController?.abort();
      return newController;
    });

    return signal;
  }, []);

  const spendCryptoApi = useCallback(
    (value: number) => {
      const signal = getAndUpdateAbortController();

      return new Promise<{
        receivedCrypto: string;
      }>((resolve, reject) => {
        if (signal.aborted) {
          return reject(new DOMException("Aborted", "AbortError"));
        }

        const timeout = setTimeout(async () => {
          try {
            setIsLoading(true);
            const newQuote = await getQuote(
              cryptoSpent,
              cryptoReceived,
              value,
              false,
              apiKey,
              signal
            );

            if (signal.aborted) {
              return reject(new DOMException("Aborted", "AbortError"));
            }

            if (
              ethBalance &&
              Number(utils.formatEther(ethBalance)) < Number(value)
            ) {
              throw new ApiError(insufficientFoundsError, "INSUFICIENT_FUNDS");
            }

            setLocalQuote(newQuote);
            resolve({
              receivedCrypto: newQuote.quoteGasAdjustedDecimals,
            });
          } catch (error) {
            if (signal.aborted) {
              return reject(new DOMException("Aborted", "AbortError"));
            }

            reject(error);
          } finally {
            setIsLoading(false);
          }
        }, 0);

        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    },
    [cryptoReceived, cryptoSpent, ethBalance, getAndUpdateAbortController]
  );

  const updateReceivedValue = useCallback(
    (value: string) => {
      setSpentValue(value);

      if (Number(value) === 0) {
        getAndUpdateAbortController();
        setReceivedValue("0");
        setIsLoading(false);
        setSwapErrorMessage("");
        return;
      }

      const onUpdate = async () => {
        try {
          const response = await spendCryptoApi(Number(value));
          setSwapErrorMessage(undefined);
          if (response) {
            setReceivedValue(response.receivedCrypto);
          }
        } catch (_error) {
          const error = _error as Error;
          if (error?.name !== "AbortError") {
            setSwapErrorMessage(
              error?.message || "Oops! Something went wrong."
            );
          }
        }
      };
      onUpdate();
    },
    [getAndUpdateAbortController, spendCryptoApi]
  );

  const updateSpentDebounced = useDebouncedCallback(updateReceivedValue, 500);

  const onMaxClick = useCallback(async () => {
    if (ethBalance) {
      setActualSpentValue(utils.formatEther(ethBalance));
      updateReceivedValue(utils.formatEther(ethBalance));
    }
  }, [ethBalance, updateReceivedValue]);

  useEffect(() => {
    setBreakdown(
      generateBreakdown(
        localQuote,
        cryptoReceived.symbol,
        Number(slippageTolerance),
        priceImpact
      )
    );
  }, [cryptoReceived.symbol, localQuote, priceImpact, slippageTolerance]);

  useEffect(() => {
    if (swapErrorMessage && swapErrorMessage !== insufficientFoundsError) {
      return;
    }
    if (
      ethBalance &&
      Number(utils.formatEther(ethBalance)) < Number(spentValue)
    ) {
      setSwapErrorMessage(insufficientFoundsError);
      return;
    }
    setSwapErrorMessage("");
  }, [ethBalance, spentValue, swapErrorMessage]);

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
          label={cryptoSpent.label}
          value={actualSpentValue}
          onChange={(e) =>
            onChangeFloat(e, (value) => {
              setIsLoading(true);
              setActualSpentValue(value);
              updateSpentDebounced(value);
            })
          }
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${
            ethBalance ? utils.formatEther(ethBalance).slice(0, 5) : "0.00"
          }`}
          onMaxClick={onMaxClick}
          suffix={`(${cryptoSpent.fiatSymbol})`}
          handleProps={{
            icon: cryptoSpent.icon,
            value: cryptoSpent.currencyShortName,
            disabled: true,
          }}
          markedError={!!swapErrorMessage}
          useEditIcon={true}
        />

        <InputDropdown
          label={cryptoReceived.label}
          value={receivedValue}
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${
            targetTokenBalance
              ? utils.formatEther(targetTokenBalance).slice(0, 5)
              : "0.00"
          }`}
          suffix={`(${cryptoReceived.fiatSymbol})`}
          handleProps={{
            icon: cryptoReceived.icon,
            value: cryptoReceived.currencyShortName,
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
            onClick={onActionButton}
            text={isLoading ? "Updating quote..." : "Continue"}
            disabled={!Number(spentValue) || !!swapErrorMessage || isLoading}
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

const computeHeading = (
  cryptoSpent: EditSwapViewInput,
  cryptoReceived: EditSwapViewInput
) => {
  return (
    <>
      Swap {cryptoSpent.currencyLongName} ({cryptoSpent.currencyShortName})
      <br />
      with {cryptoReceived.currencyLongName} ({cryptoReceived.currencyShortName}
      )
    </>
  );
};

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

export default EditSwapView;
