import React, { useEffect, useRef, useState } from "react";
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

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
                className={`${commonClasses["secondary-btn"]} ${classes["reset-btn"]}`}
              >
                Auto
              </button>
              <InputDelegator
                label=""
                variant="setting"
                type="number"
                symbol="%"
                symbolPosition="end"
                name="slippage"
                value="0.10"
              />
            </div>
          </div>
          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}>Transaction deadline:</div>
            <div className={classes["setting-content"]}>
              <InputDelegator
                label=""
                variant="setting"
                type="number"
                name="transactionDeadline"
                value="0.10"
              />
              <div>Minutes</div>
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
