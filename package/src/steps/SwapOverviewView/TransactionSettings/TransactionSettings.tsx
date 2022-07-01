import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TransactionSettingsProps } from "./TransactionSettings.models";
import commonClasses from "./../../../styles.module.css";
import classes from "./TransactionSettings.module.css";
import { ReactComponent as SettingsIcon } from "./../../../icons/settings.svg";
import { CSSTransition } from "react-transition-group";
import DropdownCheckableGroup from "../../../common/DropdownCheckableGroup/DropdownCheckableGroup";
import { ListItem } from "../../../common/DropdownCheckableGroup/DropdownCheckableGroup.models";
import { NavContext } from "../../../NavContext";
import { WalletItemData } from "../../../ApiContext/api/types/nextStep";
import DestinationWalletView from "../DestinationWalletView/DestinationWalletView";
import ErrorMessage from "../../../common/ErrorMessage/ErrorMessage";
import BaseInput from "../../../common/Input/BaseInput/BaseInput";
import { UNISWAP_DEFAULTS as defaultSettings } from "layer2";
import { useLayer2 } from "../../../web3/config";
import { metamaskWallet } from "../constants";
import {
  useTransactionContext,
  useTransactionCtxActions,
  useTransactionCtxWallets,
} from "../../../TransactionContext/hooks";

const { slippageTolerance: defaultSlippage } = defaultSettings;

const TransactionSettings: React.FC<TransactionSettingsProps> = (props) => {
  const {
    slippageTolerance: ctxSlippage,
    deadline: ctxDeadline,
    wallets: ctxWallets,
    selectedWalletAddress,
  } = useTransactionContext();
  const { selectWalletAddress } = useTransactionCtxWallets();
  const { updateDeadline, updateSlippage } = useTransactionCtxActions();
  const { nextScreen } = useContext(NavContext);
  const { account: mmAddress } = useLayer2();

  const [wallets, setWallets] = useState(computeWallets(ctxWallets, mmAddress));

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [slippageValue, setSlippageValue] = useState(ctxSlippage.toFixed(2));

  const [deadlineValue, setDeadlineValue] = useState(
    String(Math.floor((ctxDeadline / 60) * 100) / 100)
  );
  const [initialDeadlineValue] = useState(deadlineValue);

  const computeSlippageAutoBtnClass = useCallback(() => {
    const outlineClass =
      defaultSlippage === Number(slippageValue) || slippageValue === ""
        ? ""
        : commonClasses["outline"];
    return `${commonClasses["secondary-btn"]} ${outlineClass} ${classes["auto-btn"]}`;
  }, [slippageValue]);

  const resetSlippage = useCallback(() => {
    setSlippageValue(defaultSlippage.toFixed(2));
  }, []);

  const getErrorTextSlippage = useCallback(() => {
    if (slippageValue === "") {
      return;
    }

    const slippage = Number(slippageValue);
    if (slippage < 0 || slippage > 51) {
      return "Please enter a valid slippage";
    }
  }, [slippageValue]);

  const getSlippageWarningText = useCallback(() => {
    if (slippageValue === "") {
      return;
    }

    if (getErrorTextSlippage()) {
      return;
    }

    const slippage = Number(slippageValue);
    if (slippage < 0.05) {
      return "Your transaction may fail.";
    }

    if (slippage > 1) {
      return "Your transaction may be frontrun.";
    }
  }, [getErrorTextSlippage, slippageValue]);

  const onBlurSlippage = useCallback(() => {
    if (getErrorTextSlippage() || slippageValue === "") {
      resetSlippage();
      return;
    }
    setSlippageValue(Number(slippageValue).toFixed(2));
  }, [getErrorTextSlippage, resetSlippage, slippageValue]);

  const deadlineHasError = useCallback(() => {
    return !Number(deadlineValue) || Number(deadlineValue) < 0;
  }, [deadlineValue]);

  const onBlurDeadline = useCallback(() => {
    if (deadlineHasError()) {
      setDeadlineValue(initialDeadlineValue);
      return;
    }
    setDeadlineValue(Number(deadlineValue).toFixed(2));
  }, [deadlineHasError, deadlineValue, initialDeadlineValue]);

  const goToWalletDestination = useCallback(() => {
    nextScreen(<DestinationWalletView />);
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, [nextScreen]);

  useEffect(
    () => setWallets(computeWallets(ctxWallets, mmAddress)),
    [mmAddress, ctxWallets]
  );

  useEffect(() => {
    const onClickEvent = (event: MouseEvent) => {
      if (!event.target || wrapperRef.current?.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    window.addEventListener("click", onClickEvent);
    return () => {
      window.removeEventListener("click", onClickEvent);
    };
  }, []);

  //update context
  useEffect(
    () => updateDeadline((Number(deadlineValue) || 0) * 60),
    [deadlineValue, updateDeadline]
  );

  useEffect(
    () => updateSlippage(Number(slippageValue)),
    [slippageValue, updateSlippage]
  );

  const slippageError = getErrorTextSlippage();

  return (
    <div
      className={`${classes["wrapper"]} ${props.className || ""}`}
      ref={wrapperRef}
    >
      <SettingsIcon
        className={classes["icon"]}
        onClick={() => setIsOpen((value) => !value)}
      />

      <Transition ref={settingsRef} in={isOpen}>
        <div className={classes["settings-wrapper"]} ref={settingsRef}>
          <div className={classes["heading"]}> Transaction Settings </div>
          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}> Slippage tolerance: </div>
            <div className={classes["setting-content"]}>
              <button
                className={computeSlippageAutoBtnClass()}
                onClick={resetSlippage}
              >
                Auto
              </button>
              <BaseInput
                align="right"
                label=""
                variant="setting"
                symbol="%"
                symbolPosition="end"
                name="slippage"
                type="number"
                placeholder={defaultSlippage.toFixed(2)}
                error={!!slippageError}
                value={slippageValue}
                handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSlippageValue(e.target.value);
                }}
                onBlur={onBlurSlippage}
              />
            </div>
            <ErrorMessage className={classes["error"]} text={slippageError} />
            <ErrorMessage
              warning
              className={classes["error"]}
              text={getSlippageWarningText()}
            />
          </div>
          {/* <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}>Transaction deadline:</div>
            <div className={classes["setting-content"]}>
              <BaseInput
                align="center"
                label=""
                variant="setting"
                type="number"
                name="transactionDeadline"
                value={deadlineValue}
                handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDeadlineValue(e.target.value);
                }}
                error={deadlineHasError()}
                onBlur={onBlurDeadline}
                className={classes["deadline-input"]}
              />
              <div className={classes["setting-label"]}>Minutes</div>
            </div>
          </div> */}

          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}>Destination wallet:</div>
            <div className={classes["setting-content"]}>
              <DropdownCheckableGroup
                suplimentBtnText="+ Add new wallet"
                addNewBtnText="+ Add a destination wallet"
                items={wallets}
                idSelected={selectedWalletAddress || ""}
                onSelect={(item: ListItem) => selectWalletAddress(item.id)}
                onAdd={goToWalletDestination}
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

const computeWallets = (
  wallets: WalletItemData[],
  metamaskAddress: string | null | undefined
) =>
  [{ ...metamaskWallet, address: metamaskAddress || "" }, ...wallets].map(
    (item) =>
      ({
        id: item.address,
        title: item.name,
        icon: item.icon,
        info: item.address,
      } as ListItem)
  );

const Transition = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ in: boolean }>
>((props, ref) => {
  return (
    <CSSTransition
      nodeRef={ref}
      in={props.in}
      timeout={200}
      classNames={{
        enter: classes["collapse-enter"],
        enterActive: classes["collapse-enter-active"],
        exit: classes["collapse-exit"],
        exitActive: classes["collapse-exit-active"],
      }}
      unmountOnExit={true}
    >
      {props.children}
    </CSSTransition>
  );
});

export default TransactionSettings;
