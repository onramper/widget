import React, { useState } from "react";
import { WalletItemProps } from "./WalletItem.models";
import InputDelegator from "../../../common/Input/InputDelegator";
import TextEllipsis from "../../../common/TextEllipsis/TextEllipsis";
import classes from "./WalletItem.module.css";
import { ReactComponent as CheckMarkIcon } from "../../../icons/checkmark.svg";
import { ReactComponent as EditIcon } from "../../../icons/pencil.svg";
import { ReactComponent as CheckmarkRoundIcon } from "../../../icons/check-round.svg";
import { ReactComponent as GarbageCanIcon } from "../../../icons/garbage-can.svg";

const WalletItem: React.FC<WalletItemProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div 
      className={`${classes["wrapper"]} ${
        !isEditing && props.isChecked ? classes["selected"] : ""
      }`}
    >
      <div className={classes["label"]}>
        <span> {props.label} </span>
        {props.onChangeAddress && (
          <EditIcon className={classes["edit-icon"]} onClick={() => setIsEditing(true)} />
        )}
      </div>

      <div className={classes["content"]} onClick={isEditing ? undefined : props.onCheck}>
        <Checkmark isChecked={props.isChecked} hidden={isEditing} />

        {!isEditing && (
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
                  <CheckmarkRoundIcon
                    className={classes["check-round"]}
                  />
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
        )}

        {isEditing && (
          <div className={classes["main-area"]}>
            <InputDelegator
              name="walletAddress"
              value={props.address}
              className={classes["address-input"]}
              onChange={(name: string, value: string) => {
                props.onChangeAddress && props.onChangeAddress(value);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Checkmark: React.FC<{ isChecked: boolean; hidden: boolean }> = (
  props
) => (
  <div
    className={`${classes["check-wrapper"]} ${
      props.isChecked ? classes["checked"] : ""
    }`}
    style={props.hidden ? { visibility: "hidden" } : {}}
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

export default WalletItem;
