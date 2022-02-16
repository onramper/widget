import React, { useRef, useState } from "react";
import { WalletItemProps } from "./WalletItem.models";
import InputDelegator from "../../../common/Input/InputDelegator";
import TextEllipsis from "../../../common/TextEllipsis/TextEllipsis";
import classes from "./WalletItem.module.css";
import { ReactComponent as CheckMarkIcon } from "../../../icons/checkmark.svg";
import { ReactComponent as EditIcon } from "../../../icons/pencil.svg";
import { ReactComponent as CheckmarkRoundIcon } from "../../../icons/check-round.svg";
import { ReactComponent as GarbageCanIcon } from "../../../icons/garbage-can.svg";
import { ReactComponent as EnterIcon } from "../../../icons/enter.svg";
import { CSSTransition } from "react-transition-group";

const WalletItem: React.FC<WalletItemProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(props.address || "");
  const [errorMessage, setErrorMessage] = useState<string>();
  const inputWrapperRef = useRef<HTMLDivElement>(null);

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
        <div
          className={classes["wallet-content"]}
          onClick={props.onCheck}
        >
          <Checkmark isChecked={props.isChecked} />

          <div className={classes["details-area-wrapper"]}>
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
                    onClick={props.onDelete}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <Transition ref={inputWrapperRef} in={isEditing} >
          <div className={classes["input-wrapper"]} ref={inputWrapperRef}>
            <InputDelegator
              label=""
              placeholder="e.g 0x3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5"
              icon={<EnterIcon />}
              iconPosition="end"
              onIconClick={onSubmit}
              externalIconClassName={classes["input-icon"]}
              error={errorMessage}
              onEnter={onSubmit}
              name="walletAddress"
              value={address}
              className={classes["address-input"]}
              onChange={(name: string, value: string) => {
                setAddress(value);
              }}
            />
          </div>
        </Transition>
      </div>
    </div>
  );
};

const Checkmark: React.FC<{ isChecked: boolean }> = (props) => (
  <div
    className={`${classes["check-wrapper"]} ${
      props.isChecked ? classes["checked"] : ""
    }`}
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
