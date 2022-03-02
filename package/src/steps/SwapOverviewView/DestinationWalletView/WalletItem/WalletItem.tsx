import React, { useRef, useState } from "react";
import { WalletItemProps } from "./WalletItem.models";
import TextEllipsis from "../../../../common/TextEllipsis/TextEllipsis";
import classes from "./WalletItem.module.css";
import { ReactComponent as CheckMarkIcon } from "../../../../icons/checkmark.svg";
import { ReactComponent as EditIcon } from "../../../../icons/pencil.svg";
import { ReactComponent as CheckmarkRoundIcon } from "../../../../icons/check-round.svg";
import { ReactComponent as GarbageCanIcon } from "../../../../icons/garbage-can.svg";
import { CSSTransition } from "react-transition-group";
import WalletInput from "../WalletInput/WalletInput";

const WalletItem: React.FC<WalletItemProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(props.address || "");
  const [errorMessage, setErrorMessage] = useState<string>();
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const datailsWrapperRef = useRef<HTMLDivElement>(null);

  const onToggleEditing = () => {
    setAddress(props.address || "");
    setErrorMessage(undefined);
    setIsEditing((value) => !value);
  };

  const onSubmit = async () => {
    if (!props.onSubmitAddress) {
      return;
    }

    setErrorMessage(undefined);
    try {
      await props.onSubmitAddress(address);
      setIsEditing(false);
    } catch (_error) {
      const error = _error as Error;
      setErrorMessage(error.message);
    }
  };

  return (
    <div
      className={`${classes["wrapper"]} ${
        !isEditing && props.isChecked ? classes["selected"] : ""
      }`}
    >
      <div className={classes["label"]}>
        <span> {props.label} </span>
        {props.onSubmitAddress && (
          <EditIcon
            className={classes["edit-icon"]}
            onClick={onToggleEditing}
          />
        )}
      </div>

      <div className={classes["state-container"]}>
        <Transition ref={datailsWrapperRef} in={!isEditing}>
          <div ref={datailsWrapperRef} className={classes["wallet-content"]} >
            <Checkmark isChecked={props.isChecked} onClick={props.onCheck} />
              <div className={classes["details-area-wrapper"]} onClick={props.onCheck}>
                <WalletItemIcon icon={props.icon} />
                <TextEllipsis
                  text={props.title}
                  className={classes["item-title"]}
                />
                <div className={classes["item-info"]}>{props.info}</div>

                {[props.isConnected, props.onDelete].some((i) => i) && (
                  <div className={classes["right-content"]}>
                    {props.isConnected && (
                      <CheckmarkRoundIcon className={classes["check-round"]} />
                    )}
                    {props.onDelete && (
                      <GarbageCanIcon
                        className={classes["delete-icon"]}
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onDelete && props.onDelete();
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </Transition>

          <Transition ref={inputWrapperRef} in={isEditing}>
            <div className={classes["input-wrapper"]} ref={inputWrapperRef}>
              <WalletInput
                onSubmit={onSubmit}
                errorMessage={errorMessage}
                value={address}
                onChange={setAddress}
                autoFocus
              />
            </div>
          </Transition>
      </div>
    </div>
  );
};

const Checkmark: React.FC<{ isChecked: boolean; onClick:() => void }> = (props) => (
  <div
    className={`${classes["check-wrapper"]} ${
      props.isChecked ? classes["checked"] : ""
    }`}
    onClick={props.onClick}
  >
    <CheckMarkIcon />
  </div>
);

const WalletItemIcon: React.FC<{ icon?: string }> = (props) => (
  <div className={classes["icon-wrapper"]}>
    {props.icon && <img src={props.icon} alt="icon" />}
    {!props.icon && <div className={classes["default-item-icon"]}></div>}
  </div>
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
        enter: classes["enter"],
        enterActive: classes["enter-active"],
        exit: classes["exit"],
        exitActive: classes["exit-active"],
      }}
      unmountOnExit={true}
    >
      {props.children}
    </CSSTransition>
  );
});

export default WalletItem;
