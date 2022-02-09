import React, { useCallback, useEffect, useRef, useState } from "react";
import { TransactionSettingsProps } from "./TransactionSettings.models";
import commonClasses from "./../../styles.module.css";
import classes from "./TransactionSettings.module.css";
import { ReactComponent as SettingsIcon } from "./../../icons/settings.svg";
import InputDelegator from "../../common/Input/InputDelegator";
import { CSSTransition } from "react-transition-group";

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

const TransactionSettings: React.FC<TransactionSettingsProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(
    props.defaultSlippage.toFixed(2)
  );
  const [deadline, setDeadline] = useState(
    String(Math.floor((props.defaultDeadline / 60) * 100) / 100)
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

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
    <div className={classes["wrapper"]} ref={wrapperRef}>
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

          <button
            className={`${commonClasses["secondary-btn"]} ${classes["add-btn"]}`}
          >
            + Add destination wallet
          </button>
        </div>
      </Transition>
    </div>
  );
};

export default TransactionSettings;
