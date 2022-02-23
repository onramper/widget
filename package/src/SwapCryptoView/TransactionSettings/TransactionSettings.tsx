import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TransactionSettingsProps } from "./TransactionSettings.models";
import commonClasses from "./../../styles.module.css";
import classes from "./TransactionSettings.module.css";
import { ReactComponent as SettingsIcon } from "./../../icons/settings.svg";
import InputDelegator from "../../common/Input/InputDelegator";
import { CSSTransition } from "react-transition-group";
import DropdownCheckableGroup from "../../common/DropdownCheckableGroup/DropdownCheckableGroup";
import { ListItem } from "../../common/DropdownCheckableGroup/DropdownCheckableGroup.models";
import { BASE_API } from "../../ApiContext/api/constants";
import { NavContext } from "../../NavContext";
import Step from "../../steps/Step";
import { WallletListItem } from "../../ApiContext/api/types/nextStep";

const TransactionSettings: React.FC<TransactionSettingsProps> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(props.defaultSlippage.toFixed(2));
  const [deadline, setDeadline] = useState(
    String(Math.floor((props.defaultDeadline / 60) * 100) / 100)
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [wallets, setWallets] = useState(computeWallets(props.wallets));

  const computeSlippageAutoBtnClass = useCallback(() => {
    const outlineClass =
      props.defaultSlippage === Number(slippage)
        ? ""
        : commonClasses["outline"];
    return `${commonClasses["secondary-btn"]} ${outlineClass} ${classes["auto-btn"]}`;
  }, [props.defaultSlippage, slippage]);

  const resetSlippage = useCallback(() => {
    setSlippage(props.defaultSlippage.toFixed(2));
  }, [props.defaultSlippage]);

  const goToWalletDestination = useCallback(async () => {
    const stepUrl = `${BASE_API}/GoTo/TestGateway/destinationWallet`;
    const walletStep = await (
      await fetch(`${stepUrl}`, {
        method: "POST",
        body: JSON.stringify({ selectedWalletId: props.selectedWalletId }),
      })
    ).json();
    nextScreen(<Step nextStep={walletStep} />);
  }, [nextScreen, props.selectedWalletId]);

  useEffect(() => setWallets(computeWallets(props.wallets)), [props.wallets]);

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
              <InputDelegator
                align="right"
                label=""
                variant="setting"
                symbol="%"
                symbolPosition="end"
                name="slippage"
                type="number"
                value={slippage}
                onChange={(name: string, value: string) => setSlippage(value)}
              />
            </div>
          </div>
          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}>Transaction deadline:</div>
            <div className={classes["setting-content"]}>
              <InputDelegator
                align="center"
                label=""
                variant="setting"
                type="number"
                name="transactionDeadline"
                value={deadline}
                onChange={(name: string, value: string) => setDeadline(value)}
                className={classes["deadline-input"]}
              />
              <div className={classes["setting-label"]}>Minutes</div>
            </div>
          </div>

          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}>Destination wallet:</div>
            <div className={classes["setting-content"]}>
              <DropdownCheckableGroup
                suplimentBtnText="+ Add new wallet"
                addNewBtnText="+ Add a destination wallet"
                items={wallets}
                idSelected={props.selectedWalletId}
                onSelect={(item: ListItem) => props.onChangeWalletId(item.id)}
                onAdd={goToWalletDestination}
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

const computeWallets = (wallets: WallletListItem[]) =>
  wallets.map(
    (item) =>
      ({
        id: item.id,
        title: item.accountName,
        icon: item.icon,
        info: item.walletAddress,
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
