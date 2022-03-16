import {
  shortenIfAddress,
  useConnectEnsName,
  useEnsAvatar,
  useLayer2,
} from "layer2";
import React from "react";
import buttonClasses from "../ListItemButtonGroup/ListItemButton/ListItemButton.module.css";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { AccountDetailsProps } from "./AccountDetails.models";
import classes from "./AccountDetails.module.css";

const AccountDetails = ({ className }: AccountDetailsProps) => {
  const { account, active } = useLayer2();
  const ensName = useConnectEnsName();
  const ensAvatar = useEnsAvatar([ensName, account]);

  return account && active ? (
    <div
      className={`${buttonClasses["list-item"]} ${classes.AccountDetails} ${className}`}
    >
      {ensAvatar ? (
        <img
          className={`${buttonClasses["list-icon"]} ${classes.icon}`}
          src={ensAvatar}
          alt="user ens avatar"
        />
      ) : (
        <Jazzicon diameter={45} seed={jsNumberForAddress(account)} />
      )}
      <p className={buttonClasses["list-text"]}>
        {ensName ?? shortenIfAddress(account)}
      </p>
    </div>
  ) : null;
};

export default AccountDetails;
