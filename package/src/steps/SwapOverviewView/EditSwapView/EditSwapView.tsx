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
import uriToHttp, { onChangeFloat, parseWrappedTokens } from "../../../utils";
import Breakdown from "../../../common/Breakdown/Breakdown";
import { ReactComponent as HexExclamationIcon } from "./../../../icons/hex-exclamation.svg";
import TransactionSettings from "../TransactionSettings/TransactionSettings";
import classes from "./EditSwapView.module.css";
import { ApiError } from "../../../ApiContext/api";
import { CSSTransition } from "react-transition-group";
import {
  formatEther,
  useEtherBalance,
  getQuote,
  useTokenBalance,
  TokenInfo,
  QuoteDetails,
} from "layer2";
import { useDebouncedCallback } from "use-debounce";
import {
  useTransactionContext,
  useTransactionCtxWallets,
  useTransactionCtxActions,
} from "../../../TransactionContext/hooks";

const EditSwapView: React.FC<EditSwapViewProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [swapErrorMessage, setSwapErrorMessage] = useState<string>();

  const {
    tokenIn,
    tokenOut,
    currentQuote,
    fiatSymbol,
    fiatConversionIn,
    fiatConversionOut,
    wallets: contextWallets,
    selectedWalletAddress: ctxWalletAddress,
    feeBreakdown,
  } = useTransactionContext();
  const { setQuote } = useTransactionCtxActions();

  const [cryptoSpent] = useState(
    computeTokenIn(tokenIn, currentQuote, fiatSymbol, fiatConversionIn)
  );
  const [cryptoReceived] = useState(
    computeTokenOut(tokenOut, currentQuote, fiatSymbol, fiatConversionOut)
  );
  const [localQuote, setLocalQuote] = useState(currentQuote);

  // swap inputs
  const [spentValue, setSpentValue] = useState(cryptoSpent.value);
  const [actualSpentValue, setActualSpentValue] = useState(cryptoSpent.value);
  const [receivedValue, setReceivedValue] = useState(cryptoReceived.value);

  const [, setLastCallCryptoChange] = useState<AbortController>();

  // settings
  const { updateWallets, selectWalletAddress } = useTransactionCtxWallets();
  const [wallets, setWallets] = useState(contextWallets);
  const [selectedWalletAddress, setSelectedWalletAddress] =
    useState(ctxWalletAddress);

  const [heading] = useState(computeHeading(cryptoSpent, cryptoReceived));

  const { backScreen } = useContext(NavContext);
  const ethBalance = useEtherBalance(selectedWalletAddress);
  const targetTokenBalance = useTokenBalance(
    cryptoReceived.address,
    selectedWalletAddress
  );

  const onActionButton = useCallback(async () => {
    setQuote(localQuote);

    // TODO: live-update the context instead
    updateWallets(wallets);
    selectWalletAddress(selectedWalletAddress);

    backScreen();
  }, [
    backScreen,
    localQuote,
    selectWalletAddress,
    selectedWalletAddress,
    setQuote,
    updateWallets,
    wallets,
  ]);

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
              Number(value),
              undefined,
              signal
            );

            if (signal.aborted) {
              return reject(new DOMException("Aborted", "AbortError"));
            }

            if (ethBalance && Number(formatEther(ethBalance)) < Number(value)) {
              throw new ApiError(
                "You have insufficient funds to complete this transaction",
                "INSUFICIENT_FUNDS"
              );
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
      setActualSpentValue(formatEther(ethBalance));
      updateReceivedValue(formatEther(ethBalance));
    }
  }, [ethBalance, updateReceivedValue]);

  return (
    <div className={commonClasses.view}>
      <ProgressHeader percentage={props.progress} useBackButton />
      <main className={`${commonClasses.body} ${classes["wrapper"]}`}>
        <div className={classes["top-section"]}>
          <Heading className={classes.heading} text={heading} />
          <TransactionSettings
            className={classes["settings"]}
            wallets={wallets}
            updateWallets={setWallets}
            selectedWalletAddress={selectedWalletAddress}
            onChangeWalletAddress={setSelectedWalletAddress}
            cryptoName={cryptoSpent.currencyShortName}
          />
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
            ethBalance ? formatEther(ethBalance).slice(0, 5) : "0.00"
          }`}
          onMaxClick={onMaxClick}
          suffix={`(${cryptoSpent.fiatSymbol}${cryptoSpent.fiatConversion})`}
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
              ? formatEther(targetTokenBalance).slice(0, 5)
              : "0.00"
          }`}
          suffix={`(${cryptoReceived.fiatSymbol}${cryptoReceived.fiatConversion})`}
          handleProps={{
            icon: cryptoReceived.icon,
            value: cryptoReceived.currencyShortName,
            disabled: true,
          }}
          readonly
        />

        <div className={classes["bottom-fields"]}>
          <Breakdown label={"Fee breakdown:"} groups={feeBreakdown} />
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
  fiatSymbol: string,
  fiatConversion: number
) => {
  const parsedTokenIn = parseWrappedTokens(tokenIn);
  const tokenInURL = uriToHttp(tokenIn.logoURI as string)[0];

  return {
    ...parsedTokenIn,
    label: "You spend",
    value: quote.amountDecimals,
    fiatConversion,
    fiatSymbol,
    currencyShortName: parsedTokenIn.symbol,
    currencyLongName: parsedTokenIn.name,
    icon: tokenInURL,
  };
};

const computeTokenOut = (
  tokenOut: TokenInfo,
  quote: QuoteDetails,
  fiatSymbol: string,
  fiatConversion: number
) => {
  const tokenOutURL = uriToHttp(tokenOut.logoURI as string)[0];

  return {
    ...tokenOut,
    label: "You receive",
    value: quote.quoteGasAdjustedDecimals,
    fiatConversion,
    fiatSymbol,
    currencyShortName: tokenOut.symbol,
    currencyLongName: tokenOut.name,
    icon: tokenOutURL,
  };
};

export default EditSwapView;
