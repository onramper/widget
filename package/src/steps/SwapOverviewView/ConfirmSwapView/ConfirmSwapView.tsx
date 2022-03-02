import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ErrorView from "../../../common/ErrorView";
import { NavContext } from "../../../NavContext";
import {
  ConfirmSwapViewProps,
  ConfirmSwapInput,
} from "./ConfirmSwapView.models";
import commonClasses from "../../../styles.module.css";
import inputClasses from "../../../common/InputDropdown/InputDropdown.module.css";
import ProgressHeader from "../../../common/Header/ProgressHeader/ProgressHeader";
import Footer from "../../../common/Footer";
import ButtonAction from "../../../common/Buttons/ButtonAction";
import Heading from "../../../common/Heading/Heading";
import InputDropdown from "../../../common/InputDropdown/InputDropdown";
import { onChangeFloat } from "../../../utils";
import Breakdown from "../../../common/Breakdown/Breakdown";
import { ReactComponent as HexExclamationIcon } from "./../../../icons/hex-exclamation.svg";
import TransactionSettings from "../TransactionSettings/TransactionSettings";
import classes from "./ConfirmSwapView.module.css";
import { ApiError } from "../../../ApiContext/api";
import { CSSTransition } from "react-transition-group";

const ConfirmSwapView: React.FC<ConfirmSwapViewProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [swapErrorMessage, setSwapErrorMessage] = useState<string>();
  const [heading] = useState(
    computeHeading(props.cryptoSpent, props.cryptoReceived)
  );

  // swap inputs
  const [spentValue, setSpentValue] = useState(props.cryptoSpent.value);
  const [balance, setBalance] = useState(props.cryptoSpent.balance);
  const [receivedValue, setReceivedValue] = useState(
    props.cryptoReceived.value
  );
  const [cryptoSpent] = useState(props.cryptoSpent);
  const [cryptoReceived] = useState(props.cryptoReceived);
  const [, setLastCallCryptoChange] = useState<AbortController>();

  // settings
  const [wallets, setWallets] = useState(props.wallets);
  const [selectedWalletId, setSelectedWalletId] = useState(
    props.selectedWalletId
  );
  const [slippage, setSlippage] = useState(props.defaultSlippage.toFixed(2));
  const [deadline, setDeadline] = useState(
    String(Math.floor((props.defaultDeadline / 60) * 100) / 100)
  );

  const { nextScreen, backScreen } = useContext(NavContext);

  const onActionButton = useCallback(async () => {
    setIsLoading(true);
    setSwapErrorMessage(undefined);

    try {
      props.submitData({
        spentValue,
        receivedValue,
        balance: balance || 0,
        selectedWalletId,
        wallets,
        slippage: Number(slippage),
        deadline: Number(deadline) * 60,
      });
      backScreen();
    } catch (_error) {
      const error = _error as { fatal: any; message: string };
      if (error.fatal) {
        nextScreen(<ErrorView />);
        return;
      }
    }
    setIsLoading(false);
  }, [
    backScreen,
    balance,
    deadline,
    nextScreen,
    props,
    receivedValue,
    selectedWalletId,
    slippage,
    spentValue,
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

  const updateReceivedValue = useCallback(
    (value: string) => {
      setSpentValue(value);

      const spendCryptoApi = (value: number) => {
        const signal = getAndUpdateAbortController();

        return new Promise<{
          balance: number;
          receivedCrypto: number;
        }>((resolve, reject) => {
          if (signal.aborted) {
            return reject(new DOMException("Aborted", "AbortError"));
          }

          const timeout = setTimeout(() => {
            try {
              // mock a conversion
              const fiatValue = value * 2711.36;
              const balance = 989.2692 - fiatValue;
              const receivedCrypto = fiatValue * 0.0000259158;
              if (balance < 0) {
                throw new ApiError(
                  "You have insufficient funds to complete this transaction",
                  "INSUFICIENT_FUNDS"
                );
              }
              resolve({
                balance: Number(balance.toFixed(4)),
                receivedCrypto: Number(receivedCrypto.toFixed(12)),
              });
            } catch (error) {
              reject(error);
            }
          }, 300);

          signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });
      };

      const onUpdate = async () => {
        try {
          const response = await spendCryptoApi(Number(value));
          setSwapErrorMessage(undefined);
          setBalance(response.balance);
          setReceivedValue(response.receivedCrypto.toString());
        } catch (_error) {
          const error = _error as Error;
          if (error?.name === "INSUFICIENT_FUNDS") {
            setSwapErrorMessage(error.message);
          }
        }
      };
      onUpdate();
    },
    [getAndUpdateAbortController]
  );

  const onMaxClick = useCallback(async () => {
    const spendAllBalanceApi = () => {
      const signal = getAndUpdateAbortController();

      return new Promise<{
        spentCrypto: number;
        receivedCrypto: number;
      }>((resolve, reject) => {
        if (signal.aborted) {
          return reject(new DOMException("Aborted", "AbortError"));
        }

        const timeout = setTimeout(() => {
          // mock a conversion
          const balance = 989.2692;
          const receivedCrypto = balance * 0.0000259158;
          const spentCrypto = balance / 2711.36;
          resolve({
            spentCrypto: Number(spentCrypto.toFixed(12)),
            receivedCrypto: Number(receivedCrypto.toFixed(12)),
          });
        }, 300);

        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    };

    try {
      const response = await spendAllBalanceApi();
      setBalance(0);
      setReceivedValue(response.receivedCrypto.toString());
      setSpentValue(response.spentCrypto.toString());
    } catch (_err) {}
  }, [getAndUpdateAbortController]);

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
            selectedWalletId={selectedWalletId}
            slippage={slippage}
            deadline={deadline}
            defaultSlippage={props.defaultSlippage}
            onChangeWalletId={setSelectedWalletId}
            onChangeDeadline={setDeadline}
            onChangeSlippage={setSlippage}
            cryptoName={props.cryptoSpent.currencyShortName}
          />
        </div>

        <ErrorIndication message={swapErrorMessage} />

        <InputDropdown
          label={cryptoSpent.label}
          value={spentValue}
          onChange={(e) => onChangeFloat(e, updateReceivedValue)}
          className={inputClasses["swap-screen"]}
          hint={`Balance: ${balance}`}
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
          suffix={`(${cryptoReceived.fiatSymbol}${cryptoReceived.fiatConversion})`}
          handleProps={{
            icon: cryptoReceived.icon,
            value: cryptoReceived.currencyShortName,
            disabled: true,
          }}
          readonly
        />

        <div className={classes["bottom-fields"]}>
          <Breakdown
            label={props.feeBreakdown.label}
            groups={props.feeBreakdown.groups}
          />
          <IndicationItem text={props.warning} />
        </div>

        <div
          className={`${commonClasses["body-form-child"]} ${commonClasses["grow-col"]}`}
        >
          <ButtonAction
            onClick={onActionButton}
            text={isLoading ? "Sending..." : "Continue"}
            disabled={!!swapErrorMessage || isLoading}
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
  cryptoSpent: ConfirmSwapInput,
  cryptoReceived: ConfirmSwapInput
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

export default ConfirmSwapView;
