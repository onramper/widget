import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { TransactionErrorOverlayProps } from "./TransactionErrorOverlay.models";
import commonClasses from "../../../styles.module.css";
import classes from "./TransactionErrorOverlay.module.css";
import { ReactComponent as SettingsIcon } from "./../../../icons/settings.svg";
import { ReactComponent as CloseIcon } from "./../../../icons/close.svg";
import { NavContext } from "../../../NavContext";
import { ButtonAction } from "../../../common/Buttons";
import { CSSTransition } from "react-transition-group";

const contentsTimeout = 500;
let timeout: ReturnType<typeof setTimeout>;

const TransactionErrorOverlay: React.FC<TransactionErrorOverlayProps> = (
  props
) => {
  const [style] = useState({
    "--contents-timeout": `${contentsTimeout}ms`,
  } as React.CSSProperties);
  const [active, setActive] = useState(false);
  const { backScreen } = useContext(NavContext);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onDismiss = useCallback(() => {
    setActive(false);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      backScreen();
    }, 150);
  }, [backScreen]);

  useEffect(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setActive(true);
    }, 100);
  }, []);

  return (
    <Transition ref={wrapperRef} in={active}>
      <div
        ref={wrapperRef}
        className={`${commonClasses.view} ${classes["view"]}`}
      >
        <nav>
          <div> Failed </div>
          <CloseIcon className={classes["close-icon"]} onClick={onDismiss} />
        </nav>

        <main style={style} className={commonClasses.body}>
          <div className={classes["wrapper"]}>
            <div className={classes["settings-wrapper"]}>
              <SettingsIcon className={classes["setting-icon"]} />
            </div>

            <div className={classes["title"]}>Transaction Failed</div>
            <div className={classes["text-alert"]}>{props.textAlert}</div>
            <div className={classes["description"]}>{props.description}</div>

            <ButtonAction
              className={classes["dismiss-btn"]}
              onClick={onDismiss}
              text={"Dismiss"}
            />
          </div>
        </main>
      </div>
    </Transition>
  );
};

const Transition = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ in: boolean }>
>((props, ref) => {
  return (
    <CSSTransition
      nodeRef={ref}
      in={props.in}
      timeout={contentsTimeout}
      classNames={{
        enter: classes["contents-enter"],
        enterActive: classes["contents-enter-active"],
        exit: classes["contents-exit"],
        exitActive: classes["contents-exit-active"],
      }}
      unmountOnExit={true}
    >
      {props.children}
    </CSSTransition>
  );
});

export default TransactionErrorOverlay;
